const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PassengerpostSchema = new Schema({
  passengerId: {type: Schema.Types.ObjectId, ref:'Passenger', required: true},
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
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  additionalNotes: {
    type: String,
    // required: false,
  }
});

const Passengerpost = mongoose.model("Passengerpost", PassengerpostSchema);
module.exports = Passengerpost;
