const express = require("express");
const Passengerpost = require("../../models/passengerpost_model");
const Passenger = require("../../models/passenger_model");
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const passengerpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];

passengerpostRouter.post("/newpost", authenticateToken, async (req, res) => {
  const passengerId = req.user.userId;
  let {
    startingLocation,
    endingLocation,
    startTime,
    numberOfPeople,
    additionalNotes,
  } = req.body;
  startingLocation = startingLocation.trim();
  endingLocation = endingLocation.trim();
  startTime = startTime.trim();
  additionalNotes = additionalNotes.trim();

  try {
    // Create the new rideshare post
    const newpassengerpost = new Passengerpost({
      passengerId, // Assuming your Passengerpost model has a field for driverId
      startingLocation,
      endingLocation,
      startTime,
      numberOfPeople,
      additionalNotes,
    });

    const result = await newpassengerpost.save();

    // Update the passenger's document to include this new rideshare post
    await Passenger.findByIdAndUpdate(passengerId, {
      $push: { passengerposts: result._id }, // Assuming your Passenger model has a 'rides' field that stores ride IDs
    });

    res.json({
      status: "SUCCESS",
      message: "New Driver post created successfully",
      data: result,
    });
  } catch (err) {
    res.json({
      status: "FAILED",
      message: "An error occurred when trying to create a new driver post",
    });
  }
});

passengerpostRouter.get("/search", async (req, res) => {
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
  Passengerpost.find(searchQuery)
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

module.exports = passengerpostRouter;
