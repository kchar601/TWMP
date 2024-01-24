const express = require('express');
const session = require('express-session');
const { fstat } = require('fs');
const bcrypt = require("bcrypt");
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
var cookie = require('cookie');
const mime = require('mime');
const nodemailer = require('nodemailer');
const app = express()
const port = 3000


app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (mime.getType(path) === 'application/javascript') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  secure: false,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  }
});

const uri = process.env.MONGO_URI;

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`)

})

function isAdmin(req, res, next) {
  if (req.session.isAuthenticated && req.session.role === 'admin') {
    next();
  } else {
    res.json([false]);
  }
};

app.get('/api/checkSession', isAdmin, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // If the middleware passes, the user is both authenticated and an admin
  res.json([true]);
});

async function mongodbConnection(req, res, next) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
      await client.connect();

      // Attach the client to the request object
      req.dbClient = client;
      req.db = client.db("twmp"); // replace with your database name

      // Close the client when the response is finished
      res.on('finish', async () => {
          await req.dbClient.close();
      });

      next();
  } catch (error) {
      // Handle connection error
      await client.close();
      res.status(500).send("Error connecting to the database");
      console.error("Failed to connect to the database", error);
  }
}

app.use(mongodbConnection);

app.get('/api/getFAQ', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    // Use the db object from the request, provided by the middleware
    const aggr = [{ $sort: { order: 1 } }];
    const coll = req.db.collection('faqs');
    const result = await coll.aggregate(aggr).toArray();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching FAQs" });
  }
});

app.post('/api/updateFAQ', isAdmin, async (req, res) => {
  console.log(req.body);
  try {
    res.setHeader('Content-Type', 'application/json');
    const result = await req.db.collection('faqs').findOne({ _id: new ObjectId(req.body._id) });
    console.log(result);
    if (result) {
      console.log("faq found");
      await req.db.collection("faqs").updateOne({ _id: new ObjectId(req.body._id) }, {$set: {question: req.body.question, answer: req.body.answer, order: req.body.order}});
      res.json({success: true});
    } else {
      console.log("faq not found");
      res.json({success: false});
    };
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the FAQ" });
  }
});

app.post('/api/deleteFAQ', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const result = await req.db.collection('faqs').findOne({ _id: new ObjectId(req.body._id) });
    console.log(result);
    if (result) {
      console.log("faq found");
      await req.db.collection("faqs").deleteOne({ _id: new ObjectId(req.body._id) });
      res.json({success: true});
    } else {
      console.log("faq not found");
      res.json({success: false});
    };
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the FAQ" });
  }
});

app.get('/api/addFAQ', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    // Insert a new FAQ
    const newFAQData = { question: "New Question", answer: "New Answer", order: 1 };
    const insertResult = await req.db.collection("faqs").insertOne(newFAQData);

    // Check if the insert was successful
    if (insertResult.acknowledged && insertResult.insertedId) {
      console.log("New FAQ added:", insertResult.insertedId);
      res.json({ success: true, _id: insertResult.insertedId });
    } else {
      res.json({ success: false, message: "Failed to add new FAQ" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding a new FAQ" });
  }
});


app.post('/api/getAnnouncements', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const currentDate = new Date();
    console.log(currentDate);

    const announcements = req.db.collection("announcements");
    const items = await announcements.aggregate([
      {
        $match: {
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate }
        }
      }
    ]).toArray();

    if (items.length > 0){
      items.forEach(item => {
        item.closed = req.session.closedAnnouncements && req.body.page !== '/faq.html';
      });
    }

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching announcements" });
  }
});

app.get('/api/getAllAnnouncements', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const announcements = req.db.collection("announcements");
    const items = await announcements.find().toArray();

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching all announcements" });
  }
});

app.get('/api/closedAnnouncements', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    
    req.session.closedAnnouncements = true;
    console.log('closed announcements');

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post('/api/checkLogin', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    var user = { username: req.body.username };
    const result = await req.db.collection("users").findOne(user);

    if (result) {
      console.log("user found");
      const passwordMatch = await bcrypt.compare(req.body.password, result.password);

      if (passwordMatch) {
        req.session.isAuthenticated = true;
        req.session.role = 'admin';
        res.json([true]);
      } else {
        res.json([false]);
      }
    } else {
      res.json([false]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.post('/api/addEmail', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    var email = { email: req.body.email };
    const result = await req.db.collection("email_list").findOne(email);

    if (result) {
      console.log("email found");
      res.json({ success: false });
    } else {
      await req.db.collection("email_list").insertOne(email);
      res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding the email" });
  }
});

app.post('/api/filterMeetings', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const { type, open, medium } = req.body;
    let matchQuery = { "medium": medium };
    if (type) {
        matchQuery.type = type;
    }
    if (open) {
        matchQuery.open = open;
    }

    const results = await req.db.collection('meetings').aggregate([
      { $match: matchQuery }
    ]).toArray();

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while filtering meetings" });
  }
});

  app.get('/api/maps-api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
  });

  app.post('/api/sendMsg', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const email = req.body.email;
      const name = req.body.name;
      const message = req.body.msg;
      const html = `<p><b>Name:</b> ${name}</p><p><b>Return email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`;
  
      const mailOptions = {
        from: 'user@twmp.org',
        to: 'communications@twmp.org',
        subject: 'TWMP Contact Form',
        html: html
      };
      
      await transporter.sendMail(mailOptions);
      console.log('Message sent');
      res.json({status: "success"});
    } catch (error) {
      console.error(error);
      res.status(500).json({status: "error", message: "Failed to send message"});
    }
  });  

app.post('/api/updateAnnouncement', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);

    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    const _id = new ObjectId(req.body._id);

    const result = await req.db.collection("announcements").findOne({ _id: _id });
    console.log(result);

    if (result) {
      console.log("announcement found");
      await req.db.collection("announcements").updateOne({ _id: _id }, {$set: {name: req.body.name, startDate: startDate, endDate: endDate, message: req.body.message}});
      res.json({success: true});
    } else {
      console.log("announcement not found");
      res.json({success: false});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the announcement" });
  }
});

app.get('/api/addAnnouncement', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const newAnnouncement = {name: "New Announcement", startDate: new Date(), endDate: new Date(), message: "New Announcement"};
    const insertResult = await req.db.collection("announcements").insertOne(newAnnouncement);

    if (insertResult.acknowledged && insertResult.insertedId) {
      console.log("New Announcement added:", insertResult.insertedId);
      res.json({success: true, _id: insertResult.insertedId});
    } else {
      res.json({success: false, message: "Failed to add new announcement"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding a new announcement" });
  }
});

app.post('/api/deleteAnnouncement', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const deleteResult = await req.db.collection("announcements").deleteOne({ _id: new ObjectId(req.body._id) });

    if (deleteResult.deletedCount > 0) {
      console.log("Announcement deleted");
      res.json({success: true});
    } else {
      console.log("Announcement not found");
      res.json({success: false});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the announcement" });
  }
});

app.get('/api/addMeeting', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const newMeeting = {name: "New Meeting", type: "meeting", medium: "zoom", open: true, link: "https://zoom.us/j/1234567890", description: "New Meeting"};
    const insertResult = await req.db.collection("meetings").insertOne(newMeeting);

    if (insertResult.acknowledged && insertResult.insertedId) {
      console.log("New Meeting added:", insertResult.insertedId);
      res.json({success: true, _id: insertResult.insertedId});
    } else {
      res.json({success: false, message: "Failed to add new meeting"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding a new meeting" });
  }
});

app.post('/api/deleteMeeting', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const deleteResult = await req.db.collection("meetings").deleteOne({ _id: new ObjectId(req.body._id) });

    if (deleteResult.deletedCount > 0) {
      console.log("Meeting deleted");
      res.json({success: true});
    } else {
      console.log("Meeting not found");
      res.json({success: false});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the meeting" });
  }
});

app.post('/api/updateMeeting', isAdmin, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);

    const _id = new ObjectId(req.body._id);

    const result = await req.db.collection("meetings").findOne({ _id: _id });
    console.log(result);

    if (result) {
      console.log("meeting found");
      await req.db.collection("meetings").updateOne({ _id: _id }, {$set: {name: req.body.name, type: req.body.type, medium: req.body.medium, open: req.body.open, link: req.body.link, description: req.body.description}});
      res.json({success: true});
    } else {
      console.log("meeting not found");
      res.json({success: false});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the meeting" });
  }
});