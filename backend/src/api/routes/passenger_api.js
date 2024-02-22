const express = require('express');
const router = express.Router();

const Driver = require('../../models/driver_model');
const Passenger = require('../../models/passenger_model');
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

module.exports = router;