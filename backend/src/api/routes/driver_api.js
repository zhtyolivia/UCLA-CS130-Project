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


/**
 * @api {get} /my-driver-posts Get My Driver Posts
 * @apiName GetMyDriverPosts
 * @apiGroup Driver
 * @apiPermission authenticated
 * 
 * @apiDescription Fetch all posts created by the authenticated driver.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiSuccess {Object[]} driverposts List of driver posts.
 * @apiSuccess {String} driverposts._id Post ID.
 * @apiSuccess {String} driverposts.title Post title.
 * @apiSuccess {Object[]} driverposts.passengers List of passengers in the post.
 * @apiSuccess {String} driverposts.passengers.name Passenger name.
 * @apiSuccess {String} driverposts.passengers.email Passenger email.
 * @apiSuccess {String} driverposts.passengers.phonenumber Passenger phone number.
 * 
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error",
 *       "error": "Detailed error message"
 *     }
 */

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

/**
 * @api {get} /my-join-requests Get My Join Requests
 * @apiName GetMyJoinRequests
 * @apiGroup Driver
 * @apiPermission authenticated
 * 
 * @apiDescription Fetch all join requests to the driver's posts.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiSuccess {Object[]} joinRequests List of join requests.
 * @apiSuccess {String} joinRequests.requestId Request ID.
 * @apiSuccess {String} joinRequests.postId Driver post ID related to the request.
 * @apiSuccess {String} joinRequests.passengerName Name of the requesting passenger.
 * @apiSuccess {String} joinRequests.startingLocation Starting location of the ride.
 * @apiSuccess {String} joinRequests.endingLocation Ending location of the ride.
 * @apiSuccess {String} joinRequests.startTime Time when the ride starts.
 * @apiSuccess {String} joinRequests.status Request status (e.g., pending, accepted, rejected).
 * @apiSuccess {String} joinRequests.message Optional message from the passenger.
 * 
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error",
 *       "error": "Detailed error message"
 *     }
 */

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

/**
 * @api {get} /profile Get Driver Profile
 * @apiName GetDriverProfile
 * @apiGroup Driver
 * @apiPermission authenticated
 * 
 * @apiDescription Fetch the profile of the authenticated driver.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiSuccess {Object} profile Driver's profile information.
 * @apiSuccess {String} profile._id Driver's ID.
 * @apiSuccess {String} profile.name Driver's name.
 * @apiSuccess {String} profile.email Driver's email.
 * @apiSuccess {String} [profile.avatar] Driver's avatar in base64 encoding.
 * @apiSuccess {String} profile.phonenumber Driver's phone number.
 * 
 * @apiError UserNotFound The id of the User was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

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

/**
 * @api {post} /register Register Driver
 * @apiName RegisterDriver
 * @apiGroup Driver
 * @apiPermission none
 * 
 * @apiDescription Register a new driver or passenger.
 * 
 * @apiParam {String} email Driver's email.
 * @apiParam {String} password Driver's password.
 * @apiParam {String} name Driver's name.
 * @apiParam {String} phonenumber Driver's phone number.
 * @apiParam {String} [code] Authentication code for Google signup.
 * @apiParam {String} accountType Type of account (driver or passenger).
 * 
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token for the newly registered driver.
 * 
 * @apiError EmailInUse The email address is already in use.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Email already in use"
 *     }
 */

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

/**
 * @api {post} /signin Driver Sign-in
 * @apiName DriverSignIn
 * @apiGroup Driver
 * @apiPermission none
 * 
 * @apiDescription Sign in for existing drivers.
 * 
 * @apiParam {String} email Driver's email.
 * @apiParam {String} password Driver's password.
 * 
 * @apiSuccess {String} status Operation status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Driver's data.
 * @apiSuccess {String} token JWT token for the authenticated driver.
 * 
 * @apiError InvalidCredentials The credentials provided were invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": "FAILED",
 *       "message": "Invalid credential"
 *     }
 */

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


/**
 * @api {post} /updateProfile Update Driver Profile
 * @apiName UpdateDriverProfile
 * @apiGroup Driver
 * @apiPermission authenticated
 * 
 * @apiDescription Update the profile information of the authenticated driver.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiParam {String} userId Driver's user ID.
 * @apiParam {String} [name] Driver's new name.
 * @apiParam {String} [phonenumber] Driver's new phone number.
 * @apiParam {String} [email] Driver's new email.
 * @apiParam {String} [newPassword] Driver's new password.
 * 
 * @apiSuccess {String} status Operation status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} userId Updated driver's ID.
 * 
 * @apiError UserNotFound The id of the User was not found.
 * @apiError EmailInUse The email address is already in use by another account.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

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

/**
 * @api {get} /passengerposts Get Passenger Posts
 * @apiName GetPassengerPosts
 * @apiGroup Passenger
 * @apiPermission authenticated
 * 
 * @apiDescription Fetch all posts created by passengers.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiSuccess {Object[]} passengerPosts List of passenger posts.
 * 
 * @apiError ServerError Failed to fetch passenger posts.
 */



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

/**
 * @api {post} /avatar Upload/Update Avatar
 * @apiName UploadUpdateAvatar
 * @apiGroup Driver
 * @apiPermission authenticated
 * 
 * @apiDescription Upload or update the avatar for the authenticated driver.
 * 
 * @apiHeader {String} Authorization Driver's unique access token.
 * 
 * @apiParam {File} avatar The avatar image file to upload (jpg, jpeg, or png).
 * 
 * @apiSuccess {String} message A message indicating the avatar was updated successfully.
 * 
 * @apiError BadRequest The file uploaded is not an image or exceeds the size limit.
 * @apiError DriverNotFound The authenticated driver was not found.
 * @apiError ServerError Unexpected server error.
 */

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
