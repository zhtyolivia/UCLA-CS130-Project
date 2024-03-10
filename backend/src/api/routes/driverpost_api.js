const express = require("express");
const Driverpost = require("../../models/driverpost_model");
const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const driverpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];

driverpostRouter.patch('/join-requests/:requestId/accept', authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  try {
      const JoinRequest = await joinRequest.findById(requestId);
      // Update the join request status to 'accepted'
      JoinRequest.status = 'accepted';
      await JoinRequest.save();
      const driverPost = await Driverpost.findById(JoinRequest.driverPostId);
      if (!driverPost) {
          return res.status(404).json({ message: 'Driver post not found' });
      }

      // Assuming driverPost has an array to store passengerIds of accepted passengers
      if (!driverPost.passengers.includes(JoinRequest.passengerId)) {
          driverPost.passengers.push(JoinRequest.passengerId);
          await driverPost.save();
      }
      res.json({ message: 'Join request accepted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

driverpostRouter.patch('/join-requests/:requestId/decline', authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  try {
      const JoinRequest = await joinRequest.findById(requestId);
      if (!JoinRequest) {
          return res.status(404).json({ message: 'Join request not found' });
      }

      JoinRequest.status = 'declined';
      await JoinRequest.save();

      res.json({ message: 'Join request declined' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

driverpostRouter.get('/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const passengerId = req.user.userId; // Assuming `req.user` holds authenticated user info and has a userId field

  try {
    const driverPost = await Driverpost.findById(postId).exec();

    if (!driverPost) {
      return res.status(404).json({ message: 'Driver post not found' });
    }

    // Query for a join request by the current passenger for this driver post
    const JoinRequest = await joinRequest.findOne({
      driverPostId: postId,
      passengerId: passengerId
    }).exec();

    // Prepare the response object including the driverPost details
    let response = {
      driverPost: driverPost,
      hasJoined: false, // Default to false
      joinRequestStatus: null // Default to null
    };

    // If a join request exists, modify the response object accordingly
    if (JoinRequest) {
      response.hasJoined = true;
      response.joinRequestStatus = JoinRequest.status;
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

driverpostRouter.post('/:postId/join', authenticateToken, async (req, res) => {
  try {
    const passengerId = req.user.userId; // Assuming `req.user` is populated by your authentication middleware
    const { postId } = req.params;
    const { message } = req.body;

    // Optional: Check if the post exists and if a join request already exists
    const existingPost = await Driverpost.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Rideshare post not found' });
    }

    const existingRequest = await joinRequest.findOne({ driverPostId: postId, passengerId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Join request already sent' });
    }

    // Create a new join request
    const newJoinRequest = new joinRequest({
      driverPostId: postId,
      passengerId,
      message,
      status: 'pending', // Explicitly setting status, though it's the default value
    });

    const savedJoinRequest = await newJoinRequest.save();

    // Update the Passenger document to include this new join request
    await Passenger.findByIdAndUpdate(passengerId, {
      $push: { joinrequests: savedJoinRequest._id }
    });

    await Driverpost.findByIdAndUpdate(postId, {
      $push: { joinrequests: savedJoinRequest._id }
    });

    if (existingPost.driverId) {
      await Driver.findByIdAndUpdate(existingPost.driverId._id, {
        $push: { joinrequests: savedJoinRequest._id }
      });
    }
    //TO DO: send email notification

    res.status(201).json({
      message: 'Join request sent successfully',
      joinRequest: savedJoinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



driverpostRouter.post('/newpost', authenticateToken, async (req, res) =>{
  const driverId = req.user.userId;
  let{startingLocation, endingLocation, startTime, licensenumber, model, numberOfSeats, additionalNotes} = req.body;
  startingLocation = startingLocation.trim();
  endingLocation = endingLocation.trim();
  startTime = startTime.trim();
  licensenumber = licensenumber.trim();
  model = model.trim();
  //numberOfSeats = numberOfSeats.trim();
  additionalNotes = additionalNotes.trim();

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        status: "FAILED",
        message: "Driver not found"
      });
    }
    const { phonenumber, email } = driver;
    const newdriverpost = new Driverpost({
      driverId, // Assuming your Driverpost model has a field for driverId
      startingLocation,
      endingLocation,
      startTime,
      licensenumber,
      model,
      numberOfSeats,
      phonenumber,
      email,
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
