//Part of this file was leveraged from GPT/Copilot
const mongoose = require("mongoose");
const express = require("express");
const Passengerpost = require("../../models/passengerpost_model");
const Passenger = require("../../models/passenger_model");
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const passengerpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];

/**
 * @api {get} /passengerposts/search Search Passenger Posts
 * @apiName SearchPassengerPosts
 * @apiGroup PassengerPost
 * @apiPermission none
 * 
 * @apiDescription Search for passenger posts based on a search term that matches either starting or ending locations.
 * 
 * @apiParam {String} term Search term for filtering posts based on starting or ending locations.
 * 
 * @apiSuccess {Object[]} posts Array of passenger posts matching the search criteria.
 * @apiSuccess {String} posts._id Unique identifier of the post.
 * @apiSuccess {String} posts.startingLocation Starting location of the post.
 * @apiSuccess {String} posts.endingLocation Ending location of the post.
 * @apiSuccess {String} posts.startTime Start time of the ride.
 * @apiSuccess {Number} posts.numberOfPeople Number of people involved in the post.
 * @apiSuccess {String} posts.additionalNotes Additional notes provided by the poster.
 * 
 * @apiError SearchFailed The search operation failed.
 */


passengerpostRouter.get("/search", async (req, res) => {
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
          const regex = new RegExp(term, 'i'); // Case-insensitive regex for each term
          searchQuery.$or.push({ startingLocation: regex });
          searchQuery.$or.push({ endingLocation: regex });
      });

      Passengerpost.find(searchQuery)
          .then((results) => {
              res.json(results);
          })
          .catch((error) => {
              console.error("Search failed:", error.message);
              res.status(500).json({ error: "Search operation failed" });
          });
  } else {
      // If no searchTerm is provided, return all passenger posts
      Passengerpost.find({})
          .then((results) => {
              res.json(results);
          })
          .catch((error) => {
              console.error("Failed to fetch passenger posts:", error.message);
              res.status(500).json({ error: "Failed to fetch passenger posts" });
          });
  }
});

/**
 * @api {get} /passengerposts/:postId Get Passenger Post Details
 * @apiName GetPassengerPostDetails
 * @apiGroup PassengerPost
 * @apiPermission none
 * 
 * @apiDescription Retrieve details of a specific passenger post by its ID.
 * 
 * @apiParam {String} postId The unique identifier of the passenger post.
 * 
 * @apiSuccess {Object} post The passenger post details.
 * @apiSuccess {String} post._id Unique identifier of the post.
 * @apiSuccess {String} post.startingLocation Starting location of the post.
 * @apiSuccess {String} post.endingLocation Ending location of the post.
 * @apiSuccess {String} post.startTime Start time of the ride.
 * @apiSuccess {Number} post.numberOfPeople Number of people involved in the post.
 * @apiSuccess {String} post.additionalNotes Additional notes provided by the poster.
 * 
 * @apiError PostNotFound The specified post was not found.
 */

// Given post id, show all the post info.
passengerpostRouter.get('/:postId', async (req, res) => {
  const { postId } = req.params; // Extract the postId from the URL parameters

  try {
      const post = await Passengerpost.findById(postId).exec(); // Fetch the post from the database

      if (!post) {
          return res.status(404).json({ message: "Passenger post not found" });
      }
      res.json(post); // Return the post details
  } catch (error) {
      console.error('Error fetching passenger post:', error);
      res.status(500).json({ message: 'Error fetching passenger post' });
  }
});

/**
 * @api {post} /passengerposts/newpost Create New Passenger Post
 * @apiName CreateNewPassengerPost
 * @apiGroup PassengerPost
 * @apiPermission authenticated
 * 
 * @apiDescription Create a new passenger post for a ride share.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiParam {String} startingLocation Starting location of the ride.
 * @apiParam {String} endingLocation Ending location of the ride.
 * @apiParam {String} startTime Start time of the ride.
 * @apiParam {Number} numberOfPeople Number of people looking to join the ride.
 * @apiParam {String} additionalNotes Additional notes about the ride.
 * 
 * @apiSuccess {String} status Operation status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Created passenger post details.
 * 
 * @apiError FailedPostCreation An error occurred during the creation of the passenger post.
 */



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

/**
 * @api {delete} /passengerposts/deletepost/:postId Delete Passenger Post
 * @apiName DeletePassengerPost
 * @apiGroup PassengerPost
 * @apiPermission authenticated
 * 
 * @apiDescription Delete a passenger post by its ID. Only the post creator can delete their post.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * @apiParam {String} postId The unique identifier of the post to be deleted.
 * 
 * @apiSuccess {String} status Operation status.
 * @apiSuccess {String} message Success message indicating the post has been deleted.
 * 
 * @apiError PostNotFound The post to be deleted was not found, or the user does not have permission to delete it.
 * @apiError DeletionFailed An error occurred during the deletion process.
 */


// Delete route that uses the post ID as a unique identifier
passengerpostRouter.delete(
  "/deletepost/:postId",
  authenticateToken,
  async (req, res) => {
    const passengerId = req.user.userId; // Assuming this is populated by the authenticateToken middleware
    const postId = req.params.postId;

    try {
      // Convert string IDs to ObjectId for comparison
      const objectIdPassengerId = new mongoose.Types.ObjectId(passengerId);
      const objectIdPostId = new mongoose.Types.ObjectId(postId);

      // First, find the post to ensure it exists and belongs to the requesting passenger
      const post = await Passengerpost.findOne({
        _id: objectIdPostId,
        passengerId: objectIdPassengerId,
      });

      if (!post) {
        return res.status(404).json({
          status: "FAILED",
          message:
            "Post not found or you do not have permission to delete this post",
        });
      }

      // Delete the found post
      await Passengerpost.findByIdAndDelete(objectIdPostId);

      // Remove the post reference from the Passenger document, if necessary
      // Assuming the Passenger model has a field named 'passengerposts' storing post references
      await Passenger.findByIdAndUpdate(objectIdPassengerId, {
        $pull: { passengerposts: objectIdPostId },
      });

      res.json({ status: "SUCCESS", message: "Post deleted successfully" });
    } catch (err) {
      console.error(err); // For debugging purposes
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred during the deletion process",
      });
    }
  }
);

module.exports = passengerpostRouter;
