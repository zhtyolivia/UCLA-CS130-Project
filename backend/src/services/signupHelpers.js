//signupHelper.js
const bcrypt = require('bcrypt');
//const { emailExistsInBoth } = require('./validationHelpers');
const { createUser, generateAuthToken, verifyGoogleToken} = require('./authHelpers');
const jwt = require('jsonwebtoken'); // Assuming jwt is being used
const Driver = require('../models/driver_model');
const Passenger = require('../models/passenger_model');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Ensure this is secure
const REDIRECT_URL = 'http://localhost:3000'; // The path in your frontend app where Google redirects to after auth
const axios = require('axios');

async function emailExistsInBoth(email) {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();

    return passengerExists || driverExists ? true : false;
}

const handleTraditionalSignup = async (req, res, email, password, name, phonenumber, accountType) => {
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
};
// Function for handling traditional signup
// Function for handling Google signup
const handleGoogleSignup = async (req, res, code, accountType) => {


    try {
        // Exchange the authorization code for tokens
        const params = new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_url: REDIRECT_URL,
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
