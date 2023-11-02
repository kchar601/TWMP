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
  secret: 'Retro Bowl',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

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
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
    const aggr = [{ $sort: { order: -1 } }];
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

app.get('/api/getAnnouncements', (req, res) => {
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
    const announcements = database.collection("announcements");
    const items = await announcements.find({}).toArray();
    if (req.session.closedAnnouncements) {
      items[0].closed = true;
    }
    res.json(items);
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
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
  if (req.session.isAuthenticated) {
    res.json({ isAuthenticated: true, role: req.session.role });
  } else {
    res.json({ isAuthenticated: false });
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
    