const express = require("express");
const res = require("express/lib/response");
const { MongoClient } = require('mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const uri = "mongodb+srv://" + process.env.DB_USER+ ":" + process.env.DB_PASS + "@cluster0.bj6x7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function updateZombie(req, res) {
  try {
    await client.connect();
    const database = client.db("zmd");
    const zombies = database.collection("zombies");
    // create a document to insert
    if (req.body.action === "add") {
      const zombie = {
        zid: req.body.zid,
        location: req.body.location,
        notes: req.body.notes
      }
      const result = await zombies.insertOne(zombie);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } else if (req.body.action === "delete") {
      const result = await zombies.deleteOne({zid:req.body.zid});
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    } else if (req.body.action === "save") {
      const query = {zid:req.body.zid};
      const previousLocation = await zombies.findOne(query);
      console.log(previousLocation);
      const updateDoc = {
        $set: {
          pLoc: previousLocation.location,
          location: req.body.location
        }
      };
      const result = await zombies.updateOne(query, updateDoc);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
    }
    
  } finally {
    await client.close();
    res.send({status:200});
  }
}

app.get("/api", (req, res) => {
  console.log("GET REQ");
  client.connect(err => {
    let collection = client.db("zmd").collection("zombies").find({}).toArray((err, collection) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(collection);
        res.send(collection);
      }
    });
  });
});

app.post("/api/update", (req, res) => {
  console.log("POST");
  console.log(req.body);
  updateZombie(req, res); 
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
  