//signupHelper.js
const bcrypt = require('bcrypt');
//const { emailExistsInBoth } = require('./validationHelpers');
const { createUser, generateAuthToken, verifyGoogleToken} = require('./authHelpers');
const jwt = require('jsonwebtoken'); // Assuming jwt is being used
const Driver = require('../models/driver_model');
const Passenger = require('../models/passenger_model');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Ensure this is secure
const REDIRECT_URI = 'http://localhost:3000/signup'; // The path in your frontend app where Google redirects to after auth
const axios = require('axios');

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

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
// Function for handling traditional signup
// Function for handling Google signup
const handleGoogleSignup = async (req, res, accountType) => {
    const { code } = req.body;

    try {
        // Exchange the authorization code for tokens
        const params = new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { id_token } = tokenResponse.data;

        // Verify the ID token and extract the user's Google profile
        const payload = await verifyGoogleToken(id_token);
        const emailFromGoogle = payload['email'];
        const nameFromGoogle = payload['name'];

        let Model = accountType === 'driver' ? Driver : Passenger;
        let user = await Model.findOne({ email: emailFromGoogle });

        // If the user does not exist in our database, create a new one
        if (!user) {
            user = await createUser(Model, {
                email: emailFromGoogle,
                name: nameFromGoogle,
                password: null, // Google users might not have a password
                phonenumber: '', // Optional: Prompt for phone number later
            });
        }

        // Generate a token for the user
        const authToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} registered successfully via Google`,
            token: authToken,
            user,
        });
    } catch (error) {
        console.error('Error during Google signup:', error.response ? error.response.data : error);
        return res.status(500).json({
            message: 'Internal server error during Google signup',
            details: error.message
        });
    }
};

module.exports = {
    handleTraditionalSignup,
    handleGoogleSignup
};
