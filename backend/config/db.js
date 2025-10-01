const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteca';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB Connection error:', err);
    process.exit(1);
  }
};
