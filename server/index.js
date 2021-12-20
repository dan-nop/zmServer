const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

const uri = "mongodb+srv://" + process.env.DB_USER+ ":" + process.env.DB_PASS + "@cluster0.bj6x7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/api", (req, res) => {
  client.connect(err => {
    let collection = client.db("zmd").collection("zombies").find({}).toArray((err, collection) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(collection);
        res.send(collection);
      }
    });
    // perform actions on the collection object
  });
  // res.json({ collection: collection });
});

app.put("/api", (req, res) => {
  console.log(req.body);
  // res.json({ message: "Got form!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
  