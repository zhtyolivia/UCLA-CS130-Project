require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

const express = require('express');
const app = express();

app.use(express.json()); // Middleware for parsing JSON bodies

// Define a simple route
app.get('/', (req, res) => {
  res.send('Ride Sharing App Backend');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));