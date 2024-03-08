const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
    email: String,
    password: String,
    name: String,
    phonenumber: String,
    driverposts: [{
        driverpostId: {type: Schema.Types.ObjectId, ref: 'Driverpost'},
        status: String,
    }]
});

const Passenger = mongoose.model('Passenger', PassengerSchema);
module.exports = Passenger;
