const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

//DB_USER = Job_house
//DB_PASS = lkPJ4XG85ZgLflzZ

//mongoDB conect start >


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS }@cluster0.i5ort.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//mongoDB conect end >

app.get('/',(req,res)=>{
  res.send('job is falling from the sky');
});

//jobs reletade apis start >
const jobsCollection = client.db("JobHouse").collection("jobs");

app.get('/jobs',async(req, res)=>{
  const cursor =jobsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

//loade data for jobdetails start >
app.get('/jobs/:id',async(req,res)=>{
   const id = req.params.id;
   const query = {_id: new ObjectId(id)}
   const result = await jobsCollection.findOne(query);
  res.send(result);
})
//loade data for jobdetails start >

//jobs reletade apis end >
app.listen(port, () =>{
  console.log(`job id watinhg at: ${port}`);
})
