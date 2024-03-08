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
    // required: true,
  },
  numberOfSeats: {
    type: Number,
    // required: true,
  },
  additionalNotes: {
    type: String,
    // required: false,
  },
  passengers: [{type:Schema.Types.ObjectId, ref:'Passenger'}],
  joinrequests: [{type: Schema.Types.ObjectId, ref:'Joinrequest'}]
});

const Driverpost = mongoose.model("Driverpost", DriverpostSchema);
module.exports = Driverpost;
