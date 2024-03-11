const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const Driverpost = require('../../models/driverpost_model');
const Passengerpost = require('../../models/passengerpost_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {authenticateToken} = require('../middlewares/jwtauthenticate');
const {verifyGoogleToken} = require('../../services/authHelpers.js')
async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await Passenger.findById(req.user.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Convert avatar buffer to base64 string if exists
        let avatarBase64;
        if (user.avatar && user.avatar.data) {
            avatarBase64 = `data:${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}`;
        }

        // Fetch all join requests made by the passenger
        const JoinRequests = await joinRequest.find({ passengerId: req.user.userId })
                                              .populate('driverPostId')
                                              .exec();

        // Prepare join request details
        const rideshares = JoinRequests.map(request => {
            const rideshareDetails = {
                postId: request.driverPostId._id,
                startingLocation: request.driverPostId.startingLocation,
                endingLocation: request.driverPostId.endingLocation,
                startTime: request.driverPostId.startTime,
                status: request.status,
                additionalNotes: request.driverPostId.additionalNotes,
                numberOfSeats: request.driverPostId.numberOfSeats,
                // Include full details if accepted, partial if pending or rejected
                ...(request.status === 'accepted' && {
                    licensenumber: request.driverPostId.licensenumber,
                    model: request.driverPostId.model,
                    phonenumber: request.driverPostId.phonenumber,
                    email: request.driverPostId.email
                })
            };
            return rideshareDetails;
        });

        // Fetch all posts made by the passenger
        const passengerPosts = await Passengerpost.find({ passengerId: req.user.userId });

        // Include join request details with user profile information
        const userProfile = {
            ...user._doc, // Spread the user document to include all user info
            avatar: avatarBase64,
            rideshares, // Add the rideshare details to the profile response
            passengerPosts
        };

        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

router.get('/my-join-requests', authenticateToken, async (req, res) => {
    const passengerId = req.user.userId; // Assuming the passenger's ID is stored in req.user.userId

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
                // Include full details if accepted, partial if pending or rejected
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

module.exports = router;

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

router.put('/update', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { name, phonenumber, email, newPassword } = req.body;

    try {
        const user = await Passenger.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Update name and phone number
        if (name) user.name = name.trim();
        if (phonenumber) user.phonenumber = phonenumber.trim();

        // Update email after validation
        if (email && email !== user.email) {
            // Validate and check for existing email
            const emailTaken = await emailExistsInBoth(email);
            if (emailTaken) {
                return res.status(400).send({ message: "Email already in use" });
            }
            user.email = email.trim();
            // Optional: Implement email verification
        }

        // Update password
        if (newPassword) {
            // Validate new password strength here

            // Hash new password and update
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

// GET all driver posts for passengers to view
router.get('/driverposts', authenticateToken, async (req, res) => {
    try {
        const driverPosts = await Driverpost.find({}); // Modify query as needed
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

// API endpoint to upload and update the passenger's avatar
router.post("/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
    if (!req.file) { // Check if the file is not uploaded
        return res.status(400).send({ message: "Avatar is required." });
    }

    try {
        // Use the authenticated user's ID instead of getting it from the URL
        const passenger = await Passenger.findById(req.user.userId);
        if (!passenger) {
            return res.status(404).send({ error: "Passenger not found" });
        }

        // Proceed with resizing and saving the avatar as before
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
    // Error handling middleware for Multer
    res.status(400).send({ error: error.message });
});



// THIRD PARTY SIGN UP 
router.post('/google-signup', async (req, res) => {
    const { token } = req.body; // This is the ID token from Google
    try {
        const payload = await verifyGoogleToken(token);

        const email = payload['email'];
        const name = payload['name'];
        // Google does not provide a phone number, so it will be null initially
        // You might prompt the user to add it later in their profile settings

        // Check if the user already exists
        let user = await emailExistsInBoth(email);
        if (!user) {
            // User doesn't exist, create a new one
            user = new Passenger({
                email,
                name,
                // Set password to null or a hashed random string since it won't be used for Google signups
                password: await bcrypt.hash(`${Math.random()*1000000}`, 10),
                phonenumber: '', // Consider making phonenumber optional in your model or setting a placeholder
                // Additional fields like Google ID or a flag to indicate this user signed up with Google
            });
            await user.save();
        } else {
            // User already exists. Here you can handle user login instead.
        }

        // Generate a token for the user (optional, depends on your auth flow)
        const authToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        res.status(200).json({ message: "User authenticated successfully", token: authToken, user });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;