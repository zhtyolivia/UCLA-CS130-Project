const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    email: String,
    password: String,
    name: String,
    phonenumber: String,
    driverposts: [{type: Schema.Types.ObjectId, ref: 'Driverpost'}],
    joinrequests: [{type: Schema.Types.ObjectId, ref:'Joinrequest'}]
});

const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;
