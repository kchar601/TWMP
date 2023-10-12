const express = require('express');
const { fstat } = require('fs');
const bcrypt = require("bcryptjs");
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
var cookie = require('cookie');
const app = express()
const port = 3000
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log("hello");
  try{
    await client.connect();
    const database = client.db("twmp");
    await database.command({ ping: 1 });
    const announcements = database.collection("announcements");
    const items = await announcements.find({}).toArray();
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




