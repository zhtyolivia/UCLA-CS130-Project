//Part of this file was leveraged from GPT/Copilot
const express = require("express");
const Driverpost = require("../../models/driverpost_model");
const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const sendEmail = require('../../utils/emailService');
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const driverpostRouter = express.Router();

const delimiters = ["to", ",", "-", " "];

/**
 * @api {get} /search Search Driver Posts
 * @apiName SearchDriverPosts
 * @apiGroup DriverPost
 * @apiPermission none
 * 
 * @apiDescription Search for driver posts based on starting or ending location.
 * 
 * @apiParam {String} term Search term for starting or ending location.
 * 
 * @apiSuccess {Object[]} posts List of matching driver posts.
 * @apiSuccess {String} posts.startingLocation Starting location of the driver post.
 * @apiSuccess {String} posts.endingLocation Ending location of the driver post.
 * 
 * @apiError (Error 500) ServerError Internal server error during the search operation.
 */


driverpostRouter.get("/search", async (req, res) => {
  let searchTerm = req.query.term;

  if (searchTerm) {
      delimiters.forEach((delimiter) => {
          const spacedDelimiter = ` ${delimiter.trim()} `;
          searchTerm = searchTerm.split(delimiter).join(spacedDelimiter);
      });

      let terms = searchTerm.split(" ").filter(Boolean);
      terms = terms.filter((term) => !delimiters.includes(term));

      let searchQuery = { $or: [] };
      terms.forEach((term) => {
          const regex = new RegExp(term, 'i');
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



/**
 * @api {patch} /join-requests/:requestId/accept Accept Join Request
 * @apiName AcceptJoinRequest
 * @apiGroup JoinRequest
 * @apiPermission authenticated
 * 
 * @apiDescription Accept a passenger's join request for a driver post.
 * 
 * @apiParam {String} requestId ID of the join request to accept.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (Error 400) BadRequest Join request is not pending or already processed.
 * @apiError (Error 404) NotFound Driver post not found.
 * @apiError (Error 500) ServerError Internal server error.
 */


driverpostRouter.patch('/join-requests/:requestId/accept', authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  try {
      const JoinRequest = await joinRequest.findById(requestId);
      if (JoinRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Join request is not pending or has already been processed' });
      }

      JoinRequest.status = 'accepted';
      await JoinRequest.save();
      const driverPost = await Driverpost.findById(JoinRequest.driverPostId);
      if (!driverPost) {
          return res.status(404).json({ message: 'Driver post not found' });
      }
      if (!driverPost.passengers.includes(JoinRequest.passengerId)) {
          driverPost.passengers.push(JoinRequest.passengerId);
          driverPost.numberOfSeats -= JoinRequest.seatsneeded;
          await driverPost.save();
      }

      const passenger = await Passenger.findById(JoinRequest.passengerId)
      if (!passenger) {
        console.log('Passenger not found');
      } else {
        const subject = 'Ride Share Request Update';
        const text = `Your ride share request for the post starting at ${driverPost.startingLocation} has been accepted.`;
        await sendEmail(passenger.email, subject, text);
      }
      res.json({ message: 'Join request accepted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @api {patch} /join-requests/:requestId/decline Decline Join Request
 * @apiName DeclineJoinRequest
 * @apiGroup JoinRequest
 * @apiPermission authenticated
 * 
 * @apiDescription Decline a passenger's join request for a driver post.
 * 
 * @apiParam {String} requestId ID of the join request to decline.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (Error 400) BadRequest Join request is not pending or already processed.
 * @apiError (Error 404) NotFound Join request not found.
 * @apiError (Error 500) ServerError Internal server error.
 */

driverpostRouter.patch('/join-requests/:requestId/decline', authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  try {
      const JoinRequest = await joinRequest.findById(requestId);
      if (!JoinRequest) {
          return res.status(404).json({ message: 'Join request not found' });
      }
      if (JoinRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Join request is not pending or has already been processed' });
      }

      JoinRequest.status = 'declined';
      await JoinRequest.save();

      const driverPost = await Driverpost.findById(JoinRequest.driverPostId);
      const passenger = await Passenger.findById(JoinRequest.passengerId)
      if (!passenger) {
        console.log('Passenger not found');
      } else {
        const subject = 'Ride Share Request Update';
        const text = `Your ride share request for the post starting at ${driverPost.startingLocation} has been accepted.`;
        await sendEmail(passenger.email, subject, text);
      }
      res.json({ message: 'Join request declined' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @api {get} /:postId Get Driver Post Details
 * @apiName GetDriverPostDetails
 * @apiGroup DriverPost
 * @apiPermission authenticated
 * 
 * @apiDescription Get detailed information about a specific driver post.
 * 
 * @apiParam {String} postId ID of the driver post to retrieve.
 * 
 * @apiSuccess {Object} driverPost Detailed information about the driver post.
 * @apiSuccess {Boolean} hasJoined Indicates if the user has joined the post.
 * @apiSuccess {String} joinRequestStatus Status of the join request if any.
 * 
 * @apiError (Error 404) NotFound Driver post not found.
 * @apiError (Error 500) ServerError Internal server error.
 */

driverpostRouter.get('/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const passengerId = req.user.userId; 

  try {
    const driverPost = await Driverpost.findById(postId).populate('driverId').exec();

    if (!driverPost) {
      return res.status(404).json({ message: 'Driver post not found' });
    }

    const JoinRequest = await joinRequest.findOne({
      driverPostId: postId,
      passengerId: passengerId
    }).exec();

    let driverAvatar = undefined;
    if (driverPost.driverId.avatar && driverPost.driverId.avatar.data) {
      driverAvatar = `data:${driverPost.driverId.avatar.contentType};base64,${driverPost.driverId.avatar.data.toString('base64')}`;
    }
    let response = {
      driverPost: {
        startingLocation: driverPost.startingLocation,
        endingLocation: driverPost.endingLocation,
        startTime: driverPost.startTime,
        numberOfSeats: driverPost.numberOfSeats,
        additionalNotes: driverPost.additionalNotes,
        ...(JoinRequest && JoinRequest.status === 'accepted' && {
          avatar:driverAvatar,
          drivername: driverPost.driverId.name,
          licenseNumber: driverPost.licensenumber,
          model: driverPost.model,
          email: driverPost.driverId.email,
          phonenumber: driverPost.driverId.phonenumber}),
      },
      hasJoined: false,
      joinRequestStatus: null
    };

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


/**
 * @api {post} /:postId/join Send Join Request
 * @apiName SendJoinRequest
 * @apiGroup JoinRequest
 * @apiPermission authenticated
 * 
 * @apiDescription Send a join request to a driver post.
 * 
 * @apiParam {String} postId ID of the driver post to join.
 * @apiParam {Number} seatsneeded Number of seats needed.
 * @apiParam {String} [message] Optional message to the driver.
 * 
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Object} joinRequest Details of the created join request.
 * 
 * @apiError (Error 400) BadRequest Not enough seats available or join request already sent.
 * @apiError (Error 404) NotFound Rideshare post not found.
 * @apiError (Error 500) ServerError Internal server error.
 */

driverpostRouter.post('/:postId/join', authenticateToken, async (req, res) => {
  try {
    const passengerId = req.user.userId; 
    const { postId } = req.params;
    const { seatsneeded, message } = req.body;

    const existingPost = await Driverpost.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Rideshare post not found' });
    }

    if (seatsneeded > existingPost.numberOfSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const existingRequest = await joinRequest.findOne({ driverPostId: postId, passengerId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Join request already sent' });
    }

    const newJoinRequest = new joinRequest({
      driverPostId: postId,
      passengerId,
      seatsneeded,
      message,
      status: 'pending',
    });

    const savedJoinRequest = await newJoinRequest.save();

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

    const driver = await Driver.findById(existingPost.driverId);
    if (!driver) {
      console.error('Driver not found');
    } else {
      const subject = 'New Ride Share Join Request';
      const text = `A new passenger has requested to join your ride share from ${existingPost.startingLocation} to ${existingPost.endingLocation}. Please check your dashboard for more details.`;

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

/**
 * @api {post} /:postId/cancel Cancel Join Request
 * @apiName CancelJoinRequest
 * @apiGroup JoinRequest
 * @apiPermission authenticated
 * 
 * @apiDescription Cancel a previously sent join request for a driver post.
 * 
 * @apiParam {String} postId ID of the driver post associated with the join request to cancel.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (Error 404) NotFound Join request not found or already cancelled.
 * @apiError (Error 500) ServerError Internal server error.
 */

driverpostRouter.post('/:postId/cancel', authenticateToken, async (req, res) => {
  const passengerId = req.user.userId;
  const { postId } = req.params;

  try {
    const JoinRequest = await joinRequest.findOne({
      driverPostId: postId,
      passengerId: passengerId,
    });

    if (!JoinRequest) {
      return res.status(404).json({ message: 'Join request not found or already cancelled' });
    }

    await Passenger.findByIdAndUpdate(passengerId, {
      $pull: { joinrequests: JoinRequest._id }
    });

    if (JoinRequest.status === 'accepted') {
      await Driverpost.findByIdAndUpdate(postId, {
        $pull: { joinrequests: JoinRequest._id, passengers: passengerId },
        $inc: { numberOfSeats: JoinRequest.seatsneeded }
      });
    } else {
      await Driverpost.findByIdAndUpdate(postId, {
        $pull: { joinrequests: JoinRequest._id, passengers: passengerId }
      });
    }

    const existingPost = await Driverpost.findById(postId);
    if (existingPost && existingPost.driverId) {
      await Driver.findByIdAndUpdate(existingPost.driverId, {
        $pull: { joinrequests: JoinRequest._id}
      });
    }
    await joinRequest.findByIdAndDelete(JoinRequest._id);

    const driver = await Driver.findById(existingPost.driverId);
    if (driver) {
      const subject = 'Ride Share Join Request Cancelled';
      const text = `A passenger has cancelled their request to join your ride share from ${existingPost.startingLocation} to ${existingPost.endingLocation}.`;

      await sendEmail(driver.email, subject, text);
    }

    res.json({ message: 'Join request cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @api {post} /newpost Create New Driver Post
 * @apiName CreateNewDriverPost
 * @apiGroup DriverPost
 * @apiPermission authenticated
 * 
 * @apiDescription Create a new driver post for a ride share.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiParam {String} startingLocation Starting location of the ride.
 * @apiParam {String} endingLocation Ending location of the ride.
 * @apiParam {String} startTime Start time of the ride.
 * @apiParam {String} licensenumber License number of the vehicle.
 * @apiParam {String} model Vehicle model.
 * @apiParam {Number} numberOfSeats Number of seats offered.
 * @apiParam {String} additionalNotes Additional notes about the ride.
 * 
 * @apiSuccess {String} status Operation status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Created driver post details.
 * 
 * @apiError DriverNotFound The driver creating the post could not be found.
 * @apiError FailedPostCreation An error occurred during the creation of the driver post.
 */


driverpostRouter.post('/newpost', authenticateToken, async (req, res) =>{
  const driverId = req.user.userId;
  let{startingLocation, endingLocation, startTime, licensenumber, model, numberOfSeats, additionalNotes} = req.body;
  startingLocation = startingLocation.trim();
  endingLocation = endingLocation.trim();
  startTime = startTime.trim();
  licensenumber = licensenumber.trim();
  model = model.trim();
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
      driverId, 
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

    await Driver.findByIdAndUpdate(driverId, {
      $push: { driverposts: result._id } 
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


/**
 * @api {get} / Get All Posts
 * @apiName GetAllPosts
 * @apiGroup DriverPost
 * @apiPermission none
 * 
 * @apiDescription Retrieve all driver posts available in the system.
 * 
 * @apiSuccess {Object[]} posts Array containing all driver posts.
 * @apiSuccess {String} posts._id ID of the driver post.
 * @apiSuccess {String} posts.startingLocation Starting location of the ride.
 * @apiSuccess {String} posts.endingLocation Ending location of the ride.
 * @apiSuccess {String} posts.startTime Start time of the ride.
 * @apiSuccess {Number} posts.numberOfSeats Number of seats offered.
 * @apiSuccess {String} posts.licensenumber License number of the vehicle.
 * @apiSuccess {String} posts.model Vehicle model.
 * @apiSuccess {String} posts.additionalNotes Additional notes about the ride.
 * 
 * @apiError InternalServerError An error occurred on the server while fetching the posts.
 */


driverpostRouter.get("/", async (req, res) => {
  try {
    const posts = await Driverpost.find({});
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = driverpostRouter;
