const express = require("express");
const DriverPost = require("../../models/driverPosts");

const searchRoute = express.Router();

// Array to hold all the keywords to split
const delimiters = ["to", ",", "-", " "];

searchRoute.get("/search", async (req, res) => {
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
  DriverPost.find(searchQuery)
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

// searchRoute.get("/", async (req, res) => {
//   console.log("Root path accessed");
//   res.send("Hello from the root path!");
// });

module.exports = searchRoute;
