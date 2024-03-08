require('dotenv').config();
const connectDB = require('./src/config/db');
connectDB();
var testAPIRouter = require("./src/api/routes/testAPI");


const express = require('express');
const app = express();

// Use CORS middleware to enable CORS for all routes and origins
const cors = require('cors');
app.use(cors());

const PassengerRouter = require('./src/api/routes/passenger_api');
const DriverRouter = require('./src/api/routes/driver_api')
const DriverPostRouter = require('./src/api/routes/driverpost_api')
app.use(express.json()); // Middleware for parsing JSON bodies

// Define a simple route
app.get('/', (req, res) => {
  res.send('Ride Sharing App Backend');
});

//
app.use('/passenger', PassengerRouter)
app.use('/driver', DriverRouter)
app.use('/driverpost',DriverPostRouter)
app.use("/testAPI", testAPIRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));