const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    email: String,
    password: String,
    name: String,
    phonenumber: String,
});

const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;