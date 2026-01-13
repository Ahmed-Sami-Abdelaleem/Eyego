const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/userdb?authSource=admin'
    );
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

module.exports = { connectDB, disconnectDB };