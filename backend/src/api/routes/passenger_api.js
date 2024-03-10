const express = require('express');
const multer = require("multer");
const sharp = require("sharp");
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

// ======================================== Sign Up ==========================================
router.post('/register', async (req, res) => {
    let { email, password, name, phonenumber } = req.body;

    // Trim input fields if they exist, otherwise set them to an empty string to avoid TypeError
    email = email ? email.trim() : "";
    password = password ? password.trim() : "";
    name = name ? name.trim() : "";
    phonenumber = phonenumber ? phonenumber.trim() : "";

    // Validation
    if (email === "" || password === "" || name === "" || phonenumber === "") {
        return res.json({
            status: "FAILED",
            message: "Empty input for some fields"
        });
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email"
        });
    } else if (!/^[a-zA-Z\s]*$/.test(name)) { // Modified regex to allow spaces in names
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
            message: "Password must be at least 8 characters long"
        });
    }

    try {
        const emailExists = await emailExistsInBoth(email);
        if (emailExists) {
            return res.json({
                status: "FAILED",
                message: "User with this email already exists as a driver or passenger"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newPassenger = new Passenger({
            email,
            password: hashPassword,
            name,
            phonenumber
        });

        const result = await newPassenger.save();
        res.json({
            status: "SUCCESS",
            message: "Registration successful",
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.json({
            status: "FAILED",
            message: "An error occurred when trying to register"
        });
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
router.post(
    "/:id/avatar",
    upload.single("avatar"),
    async (req, res) => {
      try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
          return res.status(404).send({ error: "Passenger not found" });
        }
  
        // Resize the image to a square, maintaining aspect ratio
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
    },
    (error, req, res, next) => {
      // Error handling middleware for Multer
      res.status(400).send({ error: error.message });
    }
);

module.exports = router;