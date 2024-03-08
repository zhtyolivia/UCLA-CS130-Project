const express = require("express");
const Driverpost = require("../../models/driverpost_model");
const Driver = require('../../models/driver_model');
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const driverpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];

driverpostRouter.post('/newpost', authenticateToken, async (req, res) =>{
  const driverId = req.user.userId;
  let{startingLocation, endingLocation, startTime, numberOfSeats, additionalNotes} = req.body;
  startingLocation = startingLocation.trim();
  endingLocation = endingLocation.trim();
  startTime = startTime.trim();
  //numberOfSeats = numberOfSeats.trim();
  additionalNotes = additionalNotes.trim();

  try {
    // Create the new rideshare post
    const newdriverpost = new Driverpost({
      driverId, // Assuming your Driverpost model has a field for driverId
      startingLocation,
      endingLocation,
      startTime,
      numberOfSeats,
      additionalNotes
    });

    const result = await newdriverpost.save();

    // Update the driver's document to include this new rideshare post
    await Driver.findByIdAndUpdate(driverId, {
      $push: { driverposts: result._id } // Assuming your Driver model has a 'rides' field that stores ride IDs
    });

    res.json({
      status: "SUCCESS",
      message: "New Driver post created successfully",
      data: result,
    });
  } catch (err) {
    res.json({
      status: "FAILED",
      message: "An error occurred when trying to create a new driver post"
    });
  }
});

// for getting all posts
driverpostRouter.get("/", async (req, res) => {
  try {
    const posts = await Driverpost.find({});
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


driverpostRouter.get("/search", async (req, res) => {
  let searchTerm = req.query.term;
  // console.log("searchTerm", searchTerm);

  if (!searchTerm) {
    return res.status(400).json({ error: "No search term provided" });
  }

  delimiters.forEach((delimiter) => {
    // Add space before and after the delimiter if not already present
    // So if it is "LA, SD" it will become "LA , SD"
    const spacedDelimiter = ` ${delimiter.trim()} `;
    searchTerm = searchTerm.split(delimiter).join(spacedDelimiter);
  });
  // Split by space and remove empty strings
  let terms = searchTerm.split(" ").filter(Boolean);
  terms = terms.filter((term) => !delimiters.includes(term));
  // console.log("Terms after splitting and filtering:", terms);

  // Construct a search query using all terms for both starting and ending locations
  let searchQuery = { $or: [] };
  terms.forEach((term) => {
    searchQuery.$or.push({ startingLocation: term });
    searchQuery.$or.push({ endingLocation: term });
  });
  // console.log("Constructed searchQuery:", JSON.stringify(searchQuery, null, 2));

  // Perform the search operation
  Driverpost.find(searchQuery)
    .maxTimeMS(30000)
    .then((results) => {
      // If no results found, results will be an empty array
      // console.log(`Number of results found: ${results.length}`);
      //console.log("Results found:", results);
      res.json(results);
    })
    .catch((error) => {
      // Log the error for server-side debugging
      console.error("Search failed:", error.message);
      // Return an empty array if there's an error during the search
      res.json([]);
    });
});

module.exports = driverpostRouter;
