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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5ort.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

app.get('/', (req, res) => {
  res.send('job is falling from the sky');
});

//jobs reletade apis start >
const jobsCollection = client.db("JobHouse").collection("jobs");
//make jobapplication collection stap 2 start>
const jobApplicationCollection = client.db("JobHouse").collection("job-applications");
//make jobapplication collection stap 2 end>

//joto job dorkar tar data nia nawa start>

app.get('/jobs', async (req, res) => {
     //condition for specfic data by email st>
  const email = req.query.email;
  let query={};
  if(email){
    query = {hr_email:email}
  }
      //condition specfic data by email end>
  const cursor = jobsCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

//jotp job dorkar tar data nia nawa end>

//loade data specpice jobdetails start >
app.get('/jobs/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await jobsCollection.findOne(query);
  res.send(result);
})
//loade data for jobdetails end >

//make post job for assignment start>
app.post('/jobs', async(req,res) =>{
  const newJob = req.body;
  const result = await jobsCollection.insertOne(newJob);
  res.send(result);
})
//make post job for assignment end>

//for a job how man application count start>
app.get('/job-applications/jobs/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const query = { jobId: new ObjectId(jobId) };
  const result = await jobApplicationCollection.find(query).toArray();
  res.send(result);
});
//for a job how man application count end>

//get some [0,1,many] data load use quary start>
app.get('/job-application', async (req, res) => {
  const email = req.query.email;
  const query = { applicant_email: email }
  const result = await jobApplicationCollection.find(query).toArray();
  //fokira way to aggergate data start>
  for (const application of result) {
    console.log(application.job_id)
    const query1 = { _id: new ObjectId(application.job_id) }
    const job = await jobsCollection.findOne(query1);
    if (job) {
      application.title = job.title;
      application.company = job.company;
      application.company_logo = job.company_logo;
      application.description = job.description;
    }
  }
  //fokira way to aggergate data start>

  res.send(result);
})
//get some [0,1,many] data load use quary end

//job applications api stap-1 start>
app.post('/job-applications', async (req, res) => {
  const application = req.body;
  const result = await jobApplicationCollection.insertOne(application);
  res.send(result);
})

//job applications api stap-1 end>

//for job patch/update start>
app.patch('/job-applications/:id',async(req,res) =>{
  const id = req.params.id;
  const data =req.body;
  const filter = { _id: new ObjectId(id)};
  const updateDoc ={
    $set:{
      status:data.status
    }
  }
  const result = await jobApplicationCollection.updateOne(filter,updateDoc);
  res.send(result);
})
//for job patch/update start>

//jobs reletade apis end >
app.listen(port, () => {
  console.log(`job id watinhg at: ${port}`);
})
