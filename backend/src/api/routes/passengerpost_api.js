const mongoose = require("mongoose");
const express = require("express");
const Passengerpost = require("../../models/passengerpost_model");
const Passenger = require("../../models/passenger_model");
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const passengerpostRouter = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];
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
