//Part of this file was leveraged from GPT/Copilot
const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {authenticateToken} = require('../middlewares/jwtauthenticate');
const {verifyGoogleToken} = require('../../services/authHelpers.js');
const { handleGoogleSignup, handleTraditionalSignup } = require('../../services/signupHelpers');

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const Driverpost = require('../../models/driverpost_model');
const Passengerpost = require('../../models/passengerpost_model');

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

/**
 * @api {get} /profile Get Passenger Profile
 * @apiName GetPassengerProfile
 * @apiGroup Passenger
 * @apiPermission authenticated
 * 
 * @apiDescription Retrieve the profile information for the authenticated passenger, including their rideshare join requests and posts.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiSuccess {Object} user User profile information including avatar, rideshares, and passenger posts.
 * 
 * @apiError UserNotFound The user could not be found.
 * @apiError ServerError Unexpected server error.
 */


router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await Passenger.findById(req.user.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let avatarBase64;
        if (user.avatar && user.avatar.data) {
            avatarBase64 = `data:${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}`;
        }

        const JoinRequests = await joinRequest.find({ passengerId: req.user.userId })
                                              .populate('driverPostId')
                                              .exec();

        const rideshares = JoinRequests.map(request => {
            const rideshareDetails = {
                postId: request.driverPostId._id,
                startingLocation: request.driverPostId.startingLocation,
                endingLocation: request.driverPostId.endingLocation,
                startTime: request.driverPostId.startTime,
                status: request.status,
                additionalNotes: request.driverPostId.additionalNotes,
                numberOfSeats: request.driverPostId.numberOfSeats,
                ...(request.status === 'accepted' && {
                    licensenumber: request.driverPostId.licensenumber,
                    model: request.driverPostId.model,
                    phonenumber: request.driverPostId.phonenumber,
                    email: request.driverPostId.email
                })
            };
            return rideshareDetails;
        });

        const passengerPosts = await Passengerpost.find({ passengerId: req.user.userId });

        const userProfile = {
            ...user._doc, 
            avatar: avatarBase64,
            rideshares, 
            passengerPosts
        };

        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

/**
 * @api {get} /my-join-requests Get My Join Requests
 * @apiName GetMyJoinRequests
 * @apiGroup Passenger
 * @apiPermission authenticated
 * 
 * @apiDescription Retrieve all join requests made by the authenticated passenger.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiSuccess {Array} rideshares List of rideshare details associated with join requests.
 * 
 * @apiError ServerError Unexpected server error.
 */


router.get('/my-join-requests', authenticateToken, async (req, res) => {
    const passengerId = req.user.userId;

    try {
        const JoinRequests = await joinRequest.find({ passengerId })
                                              .populate('driverPostId')
                                              .exec();

        const rideshares = JoinRequests.map(request => {
            const rideshareDetails = {
                postId: request.driverPostId._id,
                startingLocation: request.driverPostId.startingLocation,
                endingLocation: request.driverPostId.endingLocation,
                startTime: request.driverPostId.startTime,
                status: request.status,
                additionalNotes: request.driverPostId.additionalNotes,
                numberOfSeats: request.driverPostId.numberOfSeats,
                ...(request.status === 'accepted' && {
                    licensenumber: request.driverPostId.licensenumber,
                    model:request.driverPostId.model,
                    phonenumber: request.driverPostId.phonenumber,
                    email: request.driverPostId.email
                })
            };
            return rideshareDetails;
        });

        res.json(rideshares);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @api {post} /register Register New User
 * @apiName RegisterUser
 * @apiGroup Authentication
 * @apiPermission none
 * 
 * @apiDescription Register a new passenger.
 * 
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * @apiParam {String} name User's name.
 * @apiParam {String} phonenumber User's phone number.
 * 
 * @apiSuccess {String} status Registration status.
 * @apiSuccess {String} message Success message.
 * 
 * @apiError ValidationError Validation error for inputs.
 * @apiError EmailExists Error if the email already exists.
 */

router.post('/register', (req, res) =>{
    let{email, password, name, phonenumber} = req.body;
    email = email.trim();
    password = password.trim();
    name = name.trim();
    phonenumber = phonenumber.trim();

    if(email == "" || password == "" || name == "" || phonenumber == ""){
        res.json({
            status: "FAILED",
            message: "Empty Input for some fields"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid Email"
        })
    } else if (!/^[a-zA-z]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid Name"
        })
    } else if (!/^\d{10}$/.test(phonenumber)){
        res.json({
            status: "FAILED",
            message: "Invalid PhoneNumber"
        })
    } else if (password.length < 8){
        res.json({
            status: "FAILED",
            message: "Invalid Password"
        })
    } else {
        emailExistsInBoth(email).then(emailExists =>{
            if (emailExists){
                res.json({
                    status: "FAILED",
                    message: "User with this email already exist as a driver or passenger"
                });
            } else{
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashPassword =>{
                    const newPassenger = new Passenger({
                        email,
                        password: hashPassword,
                        name,
                        phonenumber
                    });
                    newPassenger.save().then(result =>{
                        res.json({
                            status: "SUCCESS",
                            message: "Registration Successfully",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Error Occur when trying to save user account"
                        })
                    })
                }).catch(err =>{
                    res.json({
                        status: "FAILED",
                        message: "Error Occur when hashing password"
                    })
                })
            }

        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error Occur when trying to check for existing User"
            })
        })
    }
})

router.post('/register/google', async (req, res) => {
    const code = req.body.code; 
    const { accountType } = req.body;
    console.log('Google Signup attempt with Authorization Code:', code);
    await handleGoogleSignup(req, res, code, accountType);
});

/**
 * @api {post} /signin User Sign In
 * @apiName UserSignIn
 * @apiGroup Authentication
 * @apiPermission none
 * 
 * @apiDescription Sign in for an existing passenger.
 * 
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * 
 * @apiSuccess {String} status Sign in status.
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token Auth token for the user.
 * 
 * @apiError LoginError Error during login process.
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
        Passenger.find({email}).then(data => {
            if (data){
                const token = jwt.sign({ userId: data[0]._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                const hashPassword = data[0].password;
                bcrypt.compare(password,hashPassword).then(result =>{
                    if (result){
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
 * @api {put} /update Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup Passenger
 * @apiPermission authenticated
 * 
 * @apiDescription Update the profile information for the authenticated passenger.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiParam {String} [name] New name of the passenger.
 * @apiParam {String} [phonenumber] New phone number of the passenger.
 * @apiParam {String} [email] New email of the passenger.
 * @apiParam {String} [newPassword] New password for the passenger.
 * 
 * @apiSuccess {String} status Update status.
 * @apiSuccess {String} message Success message.
 * 
 * @apiError UserNotFound The user could not be found.
 * @apiError ValidationError Validation error for inputs.
 */


router.put('/update', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { name, phonenumber, email, newPassword } = req.body;

    try {
        const user = await Passenger.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (name) user.name = name.trim();
        if (phonenumber) user.phonenumber = phonenumber.trim();

        if (email && email !== user.email) {
            const emailTaken = await emailExistsInBoth(email);
            if (emailTaken) {
                return res.status(400).send({ message: "Email already in use" });
            }
            user.email = email.trim();
        }

        if (newPassword) {
            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
        }

        await user.save();
        res.status(200).send({
            status: "SUCCESS",
            message: "Profile updated successfully",
            data: user
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

/**
 * @api {get} /driverposts Get All Driver Posts
 * @apiName GetAllDriverPosts
 * @apiGroup DriverPost
 * @apiPermission authenticated
 * 
 * @apiDescription Retrieve all driver posts available for passengers to view.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * 
 * @apiSuccess {Array} driverPosts List of all driver posts.
 * 
 * @apiError ServerError Unexpected server error.
 */


router.get('/driverposts', authenticateToken, async (req, res) => {
    try {
        const driverPosts = await Driverpost.find({});
        res.status(200).json(driverPosts);
    } catch (error) {
        console.error('Failed to fetch driver posts:', error);
        res.status(500).json({ message: 'Failed to fetch driver posts' });
    }
});

// ======================================== Avatar ==========================================
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
 * @apiGroup Passenger
 * @apiPermission authenticated
 * 
 * @apiDescription Upload or update the avatar for the authenticated passenger.
 * 
 * @apiHeader {String} Authorization Passenger's unique access token.
 * @apiParam {File} avatar The avatar image file to upload.
 * 
 * @apiSuccess {String} message Success message indicating the avatar was updated.
 * 
 * @apiError BadRequest The file uploaded is not an image or exceeds the size limit.
 * @apiError PassengerNotFound The authenticated passenger was not found.
 */


router.post("/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "Avatar is required." });
    }

    try {
        const passenger = await Passenger.findById(req.user.userId);
        if (!passenger) {
            return res.status(404).send({ error: "Passenger not found" });
        }

        const buffer = await sharp(req.file.buffer)
            .resize(250, 250, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy,
            })
            .png()
            .toBuffer();

        passenger.avatar = { data: buffer, contentType: "image/png" };
        await passenger.save();
        res.send({ message: "Avatar updated successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});


module.exports = router;