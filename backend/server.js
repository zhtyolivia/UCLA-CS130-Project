//Part of this file was leveraged from GPT/Copilot
require("dotenv").config();
const connectDB = require("./src/config/db");
connectDB();

const express = require("express");
const app = express();

// Use CORS middleware to enable CORS for all routes and origins
const cors = require('cors');
app.use(cors());

const PassengerRouter = require('./src/api/routes/passenger_api');
const DriverRouter = require('./src/api/routes/driver_api');
const DriverPostRouter = require('./src/api/routes/driverpost_api');
const PassengerPostRouter = require("./src/api/routes/passengerpost_api");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ride Sharing App Backend");
});


app.use('/passenger', PassengerRouter);
app.use('/driver', DriverRouter);
app.use('/driverpost',DriverPostRouter);
//app.use("/testAPI", testAPIRouter);
app.use("/passengerpost", PassengerPostRouter);


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
