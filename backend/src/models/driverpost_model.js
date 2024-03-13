const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriverpostSchema = new Schema({
  driverId: {type: Schema.Types.ObjectId, ref:'Driver', required: true},
  startingLocation: {
    type: String,
    required: true,
  },
  endingLocation: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
  },
  licensenumber:{
    type: String
  },
  model:{
    type: String
  },
  numberOfSeats: {
    type: Number,
  },
  phonenumber:{
    type: String
  },
  email:{
    type: String
  },
  additionalNotes: {
    type: String,
  },
  passengers: [{type:Schema.Types.ObjectId, ref:'Passenger'}],
  joinrequests: [{type: Schema.Types.ObjectId, ref:'Joinrequest'}]
});

const Driverpost = mongoose.model("Driverpost", DriverpostSchema);
module.exports = Driverpost;
