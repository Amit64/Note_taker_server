const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const port = process.env.PORT || 3005;


app.use(express.json());
app.use(cors());


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izlwf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("noteManager").collection("notes");

    //get api to read all notes
    //http://localhost:3005/notes

    /**
     * body{
    "userName": "Adil",
    "textData": "hello sylhet"
}
     */
    app.get("/notes", async (req, res) => {
      const q = req.query;
      const cursor = notesCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });

    //create noteTasker
    //http://localhost:3005/note
    app.post("/note", async (req, res) => {
      const data = req.body;
      //console.log(data);
      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    //update noteTasker
    //http://localhost:3005/note/6272f194336d03b16072798e
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
    //   console.log("from update api", data);
    //   console.log("from put method", id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          userName: data.userName,//or we can use ...data or req.body
          textData: data.textData,
        },
      };
      const result = await notesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    //Delete Note
    http://localhost:3005/note/6272f194336d03b16072798e
    app.delete('/note/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:ObjectId(id)}
        const result = await notesCollection.deleteOne(filter);
        res.send(result)

    })

  } finally {
  }
}

run().catch(console.dir);
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('connected to db-notes');
//   //client.close();
// });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("listening to port = ", port);
});
