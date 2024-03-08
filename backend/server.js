require('dotenv').config();
const connectDB = require('./src/config/db');
connectDB();

const express = require('express');
const app = express();

const PassengerRouter = require('./src/api/routes/passenger_api');
const DriverRouter = require('./src/api/routes/driver_api')
const DriverPostRouter = require('./src/api/routes/driverpost_api')
app.use(express.json()); // Middleware for parsing JSON bodies

// Define a simple route
app.get('/', (req, res) => {
  res.send('Ride Sharing App Backend');
});

app.use('/passenger', PassengerRouter)
app.use('/driver', DriverRouter)
app.use('/driverpost',DriverPostRouter)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));