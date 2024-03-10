const express = require('express');
const router = express.Router();

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
const joinRequest = require('../../models/joinrequest_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {authenticateToken} = require('../middlewares/jwtauthenticate')

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

router.get('/profile', authenticateToken, (req, res) => {
    Passenger.findById(req.user.userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.json(user);
    })
    .catch(err => res.status(500).send({ message: err.message }));
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


module.exports = router;