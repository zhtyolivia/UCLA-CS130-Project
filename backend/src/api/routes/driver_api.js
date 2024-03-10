const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const Passengerpost = require('../../models/passengerpost_model');
const joinRequest = require('../../models/joinrequest_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {authenticateToken} = require('../middlewares/jwtauthenticate');

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

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
                    const newDriver = new Driver({
                        email,
                        password: hashPassword,
                        name,
                        phonenumber
                    });
                    newDriver.save().then(result =>{
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

router.put('/update', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { name, phonenumber, email, newPassword } = req.body;

    try {
        const user = await Driver.findById(userId);
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
