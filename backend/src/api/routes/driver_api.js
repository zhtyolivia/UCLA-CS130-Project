const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middlewares/jwtauthenticate');
const { handleGoogleSignup, handleTraditionalSignup } = require('../../services/signupHelpers');
//const { emailExistsInBoth } = require('../../services/validationHelpers');
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


module.exports = router;