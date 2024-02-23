var express = require("express");
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log("Accessed /testAPI");
    res.send('API is working properly');
});


module.exports = router; // Corrected the typo here
