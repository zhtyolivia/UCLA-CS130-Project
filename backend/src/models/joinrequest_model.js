const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joinRequestSchema = new Schema({
  passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger' },
  driverPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driverpost' },
  message:{type: String},
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now }
});

const Joinrequest = mongoose.model('Joinrequest', joinRequestSchema);
module.exports = Joinrequest;