const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middlewares/jwtauthenticate');
//const { handleGoogleSignup, handleTraditionalSignup } = require('../../services/signupHelpers');
const { emailExistsInBoth } = require('../../services/validationHelpers');
const { createUser, generateAuthToken, verifyGoogleToken} = require('../../services/authHelpers');

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');

// Encapsulate the API
router.get('/profile', authenticateToken, (req, res) => {
    Driver.findById(req.user.userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.json(user);
    })
    .catch(err => res.status(500).send({ message: err.message }));
});

// Function for handling traditional signup
const handleGoogleSignup = async (req, res, token, accountType) => {
    try {
        const payload = await verifyGoogleToken(token);
        const emailFromGoogle = payload['email'];
        const nameFromGoogle = payload['name'];

        let user;
        let Model = accountType === 'driver' ? Driver : Passenger;
        user = await Model.findOne({ email: emailFromGoogle });

        if (!user) {
            user = new Model({
                email: emailFromGoogle,
                name: nameFromGoogle,
                password: null, // No password for Google signup
                phonenumber: '', // Might prompt the user for this later
            });
            await user.save();
        }

        console.log("Email from Google:", emailFromGoogle);
        const authToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} registered successfully via Google`, token: authToken, user, emailFromGoogle });
    } catch (error) {
        console.error('Error during Google signup:', error);
        return res.status(500).json({ message: 'Internal server error during Google signup' });
    }
};

const handleTraditionalSignup = async (req, res, email, password, name, phonenumber, accountType) => {
    if (email == "" || password == "" || name == "" || phonenumber == "") {
        return res.json({
            status: "FAILED",
            message: "Empty input for some fields"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email"
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        return res.json({
            status: "FAILED",
            message: "Invalid name"
        });
    } else if (!/^\d{10}$/.test(phonenumber)) {
        return res.json({
            status: "FAILED",
            message: "Invalid phone number"
        });
    } else if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password must be at least 8 characters"
        });
    } else {
        emailExistsInBoth(email).then(exists => {
            if (exists) {
                return res.json({
                    status: "FAILED",
                    message: "User with this email already exists"
                });
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashPassword => {
                    let newUser;
                    if (accountType === 'driver') {
                        newUser = new Driver({
                            email,
                            password: hashPassword,
                            name,
                            phonenumber
                        });
                    } else { // Default to Passenger if accountType is not specified or is 'passenger'
                        newUser = new Passenger({
                            email,
                            password: hashPassword,
                            name,
                            phonenumber
                        });
                    }
                    newUser.save().then(result => {
                        return res.json({
                            status: "SUCCESS",
                            message: "Registration successful",
                            data: result,
                        });
                    }).catch(err => {
                        console.error("Error saving user account:", err);
                        return res.json({
                            status: "FAILED",
                            message: "Error saving user account"
                        });
                    });
                }).catch(err => {
                    console.error("Error hashing password:", err);
                    return res.json({
                        status: "FAILED",
                        message: "Error hashing password"
                    });
                });
            }
        }).catch(err => {
            console.error("Error checking for existing user:", err);
            return res.json({
                status: "FAILED",
                message: "Error checking for existing user"
            });
        });
    }
};

// Updated /register endpoint to call the appropriate function based on the request
router.post('/register', async (req, res) => {
    const { email, password, name, phonenumber, token, accountType } = req.body;

    // Decide between Google signup and traditional signup based on the presence of a token
    if (token) {
        await handleGoogleSignup(req, res, token, accountType);
    } else {
        await handleTraditionalSignup(req, res, email, password, name, phonenumber, accountType);
    }
});

// Endpoint using the refactored functions
/*
router.post('/register', async (req, res) => {
    const { email, password, name, phonenumber, token, accountType } = req.body;
    const Model = accountType === 'driver' ? Driver : Passenger;

    try {
        let result;
        if (token) {
            result = await handleGoogleSignup({ token, Model });
        } else {
            result = await handleTraditionalSignup({ email, password, name, phonenumber, Model });
        }
        res.status(200).json({ 
            message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} registered successfully`, 
            token: result.authToken, 
            user: result.user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
*/
// Helper function to check if email exists for both Driver and Passenger
/*
async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();
    return passengerExists || driverExists ? true : false;
}
*/
/*
router.post('/register', async (req, res) => {
    const { email, password, name, phonenumber, token, accountType } = req.body;

    // Handle Google Signup
    if (token) {
        try {
            const payload = await verifyGoogleToken(token);
            const emailFromGoogle = payload['email'];
            const nameFromGoogle = payload['name'];

            let user;
            let Model = accountType === 'driver' ? Driver : Passenger;
            user = await Model.findOne({ email: emailFromGoogle });

            if (!user) {
                user = new Model({
                    email: emailFromGoogle,
                    name: nameFromGoogle,
                    password: null, // No password for Google signup
                    phonenumber: '', // Might prompt the user for this later
                });
                await user.save();
            }

            console.log("Email from Google:", emailFromGoogle);
            //console.log("Name from Google:", nameFromGoogle);
            const authToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
            return res.status(200).json({ message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} registered successfully via Google`, token: authToken, user, emailFromGoogle});
        } catch (error) {
            console.error('Error during Google signup:', error);
            return res.status(500).json({ message: 'Internal server error during Google signup' });
        }
    }

    // Traditional Signup Logic
    if (email == "" || password == "" || name == "" || phonenumber == "") {
        return res.json({
            status: "FAILED",
            message: "Empty Input for some fields"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid Email"
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        return res.json({
            status: "FAILED",
            message: "Invalid Name"
        });
    } else if (!/^\d{10}$/.test(phonenumber)) {
        return res.json({
            status: "FAILED",
            message: "Invalid PhoneNumber"
        });
    } else if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password must be at least 8 characters"
        });
    } else {
        emailExistsInBoth(email).then(exists => {
            if (exists) {
                return res.json({
                    status: "FAILED",
                    message: "User with this email already exists"
                });
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashPassword => {
                    let newUser;
                    if (accountType === 'driver') {
                        newUser = new Driver({
                            email,
                            password: hashPassword,
                            name,
                            phonenumber
                        });
                    } else { // Default to Passenger if accountType is not specified or is 'passenger'
                        newUser = new Passenger({
                            email,
                            password: hashPassword,
                            name,
                            phonenumber
                        });
                    }
                    newUser.save().then(result => {
                        return res.json({
                            status: "SUCCESS",
                            message: "Registration successful",
                            data: result,
                        });
                    }).catch(err => {
                        return res.json({
                            status: "FAILED",
                            message: "Error saving user account"
                        });
                    });
                }).catch(err => {
                    return res.json({
                        status: "FAILED",
                        message: "Error hashing password"
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            return res.json({
                status: "FAILED",
                message: "Error checking for existing user"
            });
        });
    }
});
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


module.exports = router;