const mongoose = require("mongoose");

const driverPostSchema = new mongoose.Schema({
  startingLocation: String,
  endingLocation: String,
});

const DriverPost = mongoose.model("DriverPost", driverPostSchema);
module.exports = DriverPost;
