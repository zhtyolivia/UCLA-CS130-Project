const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip connection in test environment
  if (process.env.NODE_ENV === 'test') return;

  try {
    await mongoose.connect(process.env.MONGODB_URI); // Use your actual connection string
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed', error.message);
  }
};

module.exports = connectDB;