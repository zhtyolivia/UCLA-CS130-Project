const express = require("express");
const Driverpost = require("../../models/driverpost_model");
const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const sendEmail = require('../../utils/emailService');
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const driverpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];
driverpostRouter.get("/search", async (req, res) => {
  let searchTerm = req.query.term;

  if (searchTerm) {
      // Your existing code for processing the search term and constructing the search query
      delimiters.forEach((delimiter) => {
          const spacedDelimiter = ` ${delimiter.trim()} `;
          searchTerm = searchTerm.split(delimiter).join(spacedDelimiter);
      });

      let terms = searchTerm.split(" ").filter(Boolean);
      terms = terms.filter((term) => !delimiters.includes(term));

      let searchQuery = { $or: [] };
      terms.forEach((term) => {
          const regex = new RegExp(term, 'i'); // Case-insensitive regex for each term
          searchQuery.$or.push({ startingLocation: regex });
          searchQuery.$or.push({ endingLocation: regex });
      });

      Driverpost.find(searchQuery)
          .then((results) => {
              res.json(results);
          })
          .catch((error) => {
              console.error("Search failed:", error.message);
              res.status(500).json({ error: "Search operation failed" });
          });
  } else {
      // If no searchTerm is provided, return all posts
      Driverpost.find({})
          .then((results) => {
              res.json(results);
          })
          .catch((error) => {
              console.error("Failed to fetch posts:", error.message);
              res.status(500).json({ error: "Failed to fetch posts" });
          });
  }
});

driverpostRouter.patch('/join-requests/:requestId/accept', authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  try {
      const JoinRequest = await joinRequest.findById(requestId);
      if (JoinRequest.status !== 'pending') {
        // If the join request is not pending, do not proceed with acceptance
        return res.status(400).json({ message: 'Join request is not pending or has already been processed' });
      }
  
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

      // Send email notification to the passenger
      const passenger = await Passenger.findById(JoinRequest.passengerId)
      if (!passenger) {
        console.log('Passenger not found');
      } else {
        // console.log('Passenger email:', passenger.email);
        const subject = 'Ride Share Request Update';
        const text = `Your ride share request for the post starting at ${driverPost.startingLocation} has been accepted.`;
        await sendEmail(passenger.email, subject, text);
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
      if (JoinRequest.status !== 'pending') {
        // If the join request is not pending, do not proceed with acceptance
        return res.status(400).json({ message: 'Join request is not pending or has already been processed' });
      }

      JoinRequest.status = 'declined';
      await JoinRequest.save();

      // Send email notification to the passenger
      const driverPost = await Driverpost.findById(JoinRequest.driverPostId);
      const passenger = await Passenger.findById(JoinRequest.passengerId)
      if (!passenger) {
        console.log('Passenger not found');
      } else {
        // console.log('Passenger email:', passenger.email);
        const subject = 'Ride Share Request Update';
        const text = `Your ride share request for the post starting at ${driverPost.startingLocation} has been accepted.`;
        await sendEmail(passenger.email, subject, text);
      }
      res.json({ message: 'Join request declined' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

driverpostRouter.get('/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const passengerId = req.user.userId; // Assuming `req.user` holds authenticated user info and has a userId field

  try {
    const driverPost = await Driverpost.findById(postId).populate('driverId').exec();

    if (!driverPost) {
      return res.status(404).json({ message: 'Driver post not found' });
    }

    // Query for a join request by the current passenger for this driver post
    const JoinRequest = await joinRequest.findOne({
      driverPostId: postId,
      passengerId: passengerId
    }).exec();

    let driverAvatar = undefined;
    // Convert driver avatar buffer to base64 string if exists and join request is accepted
    if (driverPost.driverId.avatar && driverPost.driverId.avatar.data) {
      driverAvatar = `data:${driverPost.driverId.avatar.contentType};base64,${driverPost.driverId.avatar.data.toString('base64')}`;
    }
    // Prepare the response object including the driverPost details
    let response = {
      driverPost: {
        // Include all driverPost details that are always visible
        startingLocation: driverPost.startingLocation,
        endingLocation: driverPost.endingLocation,
        startTime: driverPost.startTime,
        numberOfSeats: driverPost.numberOfSeats,
        additionalNotes: driverPost.additionalNotes,
        // Conditionally include the license number
        ...(JoinRequest && JoinRequest.status === 'accepted' && {
          avatar:driverAvatar,
          drivername: driverPost.driverId.name,
          licenseNumber: driverPost.licensenumber,
          model: driverPost.model,
          email: driverPost.driverId.email,
          phonenumber: driverPost.driverId.phonenumber}),
      },
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
    
    //send email notification
    const driver = await Driver.findById(existingPost.driverId);
    if (!driver) {
      console.error('Driver not found');
    } else {
      // Prepare email notification details
      const subject = 'New Ride Share Join Request';
      const text = `A new passenger has requested to join your ride share from ${existingPost.startingLocation} to ${existingPost.endingLocation}. Please check your dashboard for more details.`;

      // Send email to the Driver
      await sendEmail(driver.email, subject, text);
    }

    res.status(201).json({
      message: 'Join request sent successfully',
      joinRequest: savedJoinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

driverpostRouter.post('/:postId/cancel', authenticateToken, async (req, res) => {
  const passengerId = req.user.userId; // Assuming `req.user` is populated by your authentication middleware
  const { postId } = req.params;

  try {
    // Find the join request made by this passenger for the specified post
    const JoinRequest = await joinRequest.findOne({
      driverPostId: postId,
      passengerId: passengerId,
    });

    // If no join request is found, return an error
    if (!JoinRequest) {
      return res.status(404).json({ message: 'Join request not found or already cancelled' });
    }

    // Optionally, update the Passenger document to remove this join request
    await Passenger.findByIdAndUpdate(passengerId, {
      $pull: { joinrequests: JoinRequest._id }
    });

    // Optionally, update the DriverPost document to remove this join request
    await Driverpost.findByIdAndUpdate(postId, {
      $pull: { joinrequests: JoinRequest._id ,passengers: passengerId}
    });

    // If the post belongs to a driver, you might also want to remove this join request from the Driver document
    const existingPost = await Driverpost.findById(postId);
    if (existingPost && existingPost.driverId) {
      await Driver.findByIdAndUpdate(existingPost.driverId, {
        $pull: { joinrequests: JoinRequest._id}
      });
    }
    // Remove the join request
    await joinRequest.findByIdAndDelete(JoinRequest._id);
    res.json({ message: 'Join request cancelled successfully' });
  } catch (error) {
    console.error(error);
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




module.exports = driverpostRouter;
