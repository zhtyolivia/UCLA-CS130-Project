const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middlewares/jwtauthenticate');
const { handleGoogleSignup, handleTraditionalSignup } = require('../../services/signupHelpers');
const { createUser, generateAuthToken, verifyGoogleToken} = require('../../services/authHelpers');

//Data Module
const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');

const Passengerpost = require('../../models/passengerpost_model');
const joinRequest = require('../../models/joinrequest_model');
const Driverpost = require("../../models/driverpost_model");

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

router.get('/my-driver-posts', authenticateToken, async (req, res) => {
    const driverId = req.user.userId;
    try {
        const driverWithPosts = await Driver.findById(driverId)
            .populate({
                path: 'driverposts', // Populating driver posts
                populate: {
                    path: 'passengers', // Nested population for passengers within each driver post
                    model: 'Passenger', // Specify the model name if not automatically inferred
                    select: 'name email phonenumber' // Adjust according to the details you want to include (e.g., name, email)
                }
            })
            .exec();

      res.json(driverWithPosts.driverposts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

router.get('/my-join-requests', authenticateToken, async (req, res) => {
    const driverId = req.user.userId; // Assuming the driver's ID is stored in req.user.userId

    try {
        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const joinRequestsDetails = await joinRequest.find({
            '_id': { $in: driver.joinrequests }}).populate('driverPostId passengerId');

        const detailedRequests = joinRequestsDetails.map(request => ({
            requestId: request._id,
            postId: request.driverPostId._id,
            passengerName: request.passengerId.name,
            startingLocation: request.driverPostId.startingLocation,
            endingLocation: request.driverPostId.endingLocation,
            startTime: request.driverPostId.startTime,
            status: request.status,
            message: request.message,
        }));

        res.json(detailedRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await Driver.findById(req.user.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Initialize the user profile object with user details
        let userProfile = {
            ...user._doc, // Spread the user document to include all user info
            avatar: undefined, // Initialize avatar field
        };

        // Convert avatar buffer to base64 string if exists
        if (user.avatar && user.avatar.data) {
            userProfile.avatar = `data:${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}`;
        }

        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Updated /register endpoint to call the appropriate function based on the request
router.post('/register', async (req, res) => {
    console.log(req.body); // Add this line to log the request body
    const { email, password, name, phonenumber, code, accountType } = req.body;
    console.log("Signup attempt:", code ? "Google Signup" : "Traditional Signup");
    // Decide between Google signup and traditional signup based on the presence of a token
    if (code) {
        await handleGoogleSignup(req, res, code, accountType);
    } else {
        await handleTraditionalSignup(req, res, email, password, name, phonenumber, accountType);
    }
});
router.post('/signin', (req, res) =>{
    let{email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty input"
        })
    } else {
        Driver.find({email}).then(data => {
            if (data){
                const hashPassword = data[0].password;
                //console.log(hashPassword);
                bcrypt.compare(password,hashPassword).then(result =>{
                    if (result){
                        //console.log("same");
                        const token = jwt.sign({ userId: data[0]._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                        res.json({
                            status: "Success",
                            message: "User Successfully logged in",
                            data: data,
                            token: token
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Wrong password"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error Occur when trying to check for password"
                    })
                })
            }else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credential"
                })
            }
        }).catch(err => {
            res.json({
              status: "FAILED",
              message: "No existing User with input email",
            });
          });
    }
});

router.post('/updateProfile', async (req, res) => {
    const { userId, name, phonenumber, email, newPassword } = req.body;

    try {
        const user = await Driver.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name.trim();
        if (phonenumber) user.phonenumber = phonenumber.trim();

        if (email && email.trim() !== user.email) {
            const emailTaken = await emailExistsInBoth(email.trim());
            if (emailTaken) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email.trim();
        }

        if (newPassword) {
            // Optionally, validate new password strength here
            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
        }

        await user.save();
        res.status(200).json({
            status: "SUCCESS",
            message: "Profile updated successfully",
            userId: user._id // Consider what data needs to be returned to the user
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/passengerposts', authenticateToken, async (req, res) => {
    try {
        const passengerPosts = await Passengerpost.find({});
        res.status(200).json(passengerPosts);
    } catch (error) {
        console.error('Failed to fetch passenger posts:', error);
        res.status(500).json({ message: 'Failed to fetch passenger posts' });
    }
});

// ======================================== Avatar ==========================================
// Multer setup for file handling
const upload = multer({
    limits: { fileSize: 16 * 1024 * 1024 }, // 16MB limit
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Please upload an image file (jpg, jpeg, or png)."));
      }
      cb(undefined, true);
    },
});

// API endpoint to upload and update the driver's avatar
router.post("/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
    if (!req.file) { // Check if the file is not uploaded
        return res.status(400).send({ message: "Avatar is required." });
    }

    try {
        // Use the authenticated driver's ID from the token
        const driver = await Driver.findById(req.user.userId);
        if (!driver) {
            return res.status(404).send({ error: "Driver not found" });
        }

        // Proceed with resizing and saving the avatar
        const buffer = await sharp(req.file.buffer)
            .resize(250, 250, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy,
            })
            .png()
            .toBuffer();

        driver.avatar = { data: buffer, contentType: "image/png" };
        await driver.save();
        res.send({ message: "Avatar updated successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}, (error, req, res, next) => {
    // Error handling middleware for Multer
    res.status(400).send({ error: error.message });
});


module.exports = router;
