const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
// Use CORS middleware to enable CORS for all routes and origins
app.use(cors());
const port = process.env.PORT || 3001; // Choose a port different from your frontend

app.use(express.json());

// MongoDB connection string
require('dotenv').config();
const mongoString = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(mongoString)
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    // Here you can start defining routes and using the MongoDB client
    // Example: const collection = client.db("test").collection("devices");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
