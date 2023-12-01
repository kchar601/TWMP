const express = require('express');
const session = require('express-session');
const { fstat } = require('fs');
const bcrypt = require("bcrypt");
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("twmp").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  run().catch(console.dir);
}

app.get('/api/getFAQ', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  async function run() { 
  try{
    await client.connect();
    const database = client.db("twmp");
    await database.command({ ping: 1 });
    const aggr = [{ $sort: { order: 1 } }];
    const coll = database.collection('faqs');
    const cursor = coll.aggregate(aggr);
    const result = await cursor.toArray();
    res.json(result);
  }
  catch(err){
    console.log(err);
  }
  finally{
    await client.close();
  }
}
  run().catch(console.dir);
})

app.post('/api/updateFAQ', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  console.log(req.body);
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      const result = await dbo.collection("faqs").findOne({ _id: new ObjectId(req.body._id) });
      console.log(result);
      if (result) {
        console.log("faq found");
        await dbo.collection("faqs").updateOne({ _id: new ObjectId(req.body._id) }, {$set: {question: req.body.question, answer: req.body.answer, order: req.body.order}});
        res.json({success: true});
      } else {
        console.log("faq not found");
        res.json({success: false});
      };
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
})

app.post('/api/deleteFAQ', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      await dbo.collection("faqs").deleteOne({ _id: new ObjectId(req.body._id) });
      res.json({success: true});
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
})

app.get('/api/addFAQ', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      await dbo.collection("faqs").insertOne({question: "New Question", answer: "New Answer", order: 1});
      const newFAQ = await dbo.collection("faqs").findOne({question: "New Question"});
      console.log(newFAQ);
      res.json({success: true, _id: newFAQ._id});
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
})

app.post('/api/getAnnouncements', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const currentDate = new Date(); // Current date

  console.log(currentDate);

  async function run() { 
    try {
      await client.connect();
      const database = client.db("twmp");
      await database.command({ ping: 1 });
      const announcements = database.collection("announcements");

      const items = await announcements.aggregate([
        {
          $match: {
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
          }
        }
      ]).toArray();

      if (items.length > 0){
        if (req.session.closedAnnouncements && req.body.page !== '/faq.html') {
          items[0].closed = true;
        }
        else {
          items[0].closed = false;
        }
      }

      res.json(items);
    }
    catch(err) {
      console.log(err);
    }
    finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.get('/api/getAllAnnouncements', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() { 
    try {
      await client.connect();
      const database = client.db("twmp");
      await database.command({ ping: 1 });
      const announcements = database.collection("announcements");

      const items = await announcements.find().toArray();

      res.json(items);
    }
    catch(err) {
      console.log(err);
    }
    finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.get('/api/closedAnnouncements', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  async function run() { 
  try{
    req.session.closedAnnouncements = true;
    res.json({ success: true });
    console.log('closed announcements');
  }
  catch(err){
    console.log(err);
  }
}
  run().catch(console.dir);
}
)

app.post('/api/checkLogin', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  var user = {username: req.body.username};
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      const result = await dbo.collection("users").findOne(user);
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
      };
    } catch (err) {
      //console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
})

app.get('/api/permissions', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  console.log(req.session.isAuthenticated);
  console.log(req.session.role);
  if (req.session.isAuthenticated && req.session.role === 'admin') {
    res.json([true]);
  } else {
    res.json([false]);
  }
});

app.post('/api/addEmail', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  var email = {email: req.body.email};
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      const result = await dbo.collection("email_list").findOne(email);
      if (result) {
        console.log("email found");
        res.json({success: false});
      } else {
        await dbo.collection("email_list").insertOne(email);
        res.json({success: true});
      };
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
}
)

app.post('/api/filterMeetings', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
    // Assuming `req.body` is your parsed JSON object from the client:
    const { type, open, medium } = req.body;

    let matchQuery = { "medium": medium };
    if (type) {
        matchQuery.type = type;
    }
    if (open === true) {
        matchQuery.open = open;
    }
  async function run(){
    try{
      const db = client.db('twmp');
      const results = await db.collection('meetings').aggregate([
        { $match: matchQuery }
      ]).toArray();
      res.json(results);
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
    }
      run().catch(console.dir);
  })
    
  app.get('/api/maps-api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
  });

app.post('/api/sendMsg', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const email = req.body.email;
    const name = req.body.name;
    const message = req.body.message;
    const html = `<p>Name: ${name}</p><p>Return email: ${email}</p><p>Message: ${message}</p>`;
    const mailOptions = {
      from: 'user@twmp.org', // sender address
      to: 'charltonkeith8@gmail.com', // list of receivers
      subject: 'Contact Form', // Subject line
      html: html // HTML body content
  };
  
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
  res.json({status: "success"});
});

app.get('/api/checkSession', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  if (req.session.isAuthenticated) {
    res.json([true]);
  } else {
    res.json([false]);
  }
});

app.post('/api/updateAnnouncement', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  console.log(req.body);
  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);  
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      const result = await dbo.collection("announcements").findOne({ _id: new ObjectId(req.body._id) });
      console.log(result);
      if (result) {
        console.log("announcement found");
        await dbo.collection("announcements").updateOne({ _id: new ObjectId(req.body._id) }, {$set: {name: req.body.name, startDate: startDate, endDate: endDate, message: req.body.message}});
        res.json({success: true});
      } else {
        console.log("announcement not found");
        res.json({success: false});
      };
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
}
)

app.get('/api/addAnnouncement', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      await dbo.collection("announcements").insertOne({name: "New Announcement", startDate: new Date(), endDate: new Date(), message: "New Announcement"});
      const newAnn = await dbo.collection("announcements").findOne({name: "New Announcement"});
      console.log(newAnn);
      res.json({success: true, _id: newAnn._id});
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
}
)

app.post('/api/deleteAnnouncement', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      }
  );
  async function run() {
    try {
      await client.connect();
      const dbo = client.db("twmp");
      await dbo.command({ ping: 1 });
      await dbo.collection("announcements").deleteOne({ _id: new ObjectId(req.body._id) });
      res.json({success: true});
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
}
)