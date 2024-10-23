const config = require("config");
const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';

// Connect to MongoDB
mongoose.connect(config.MONGODB_URL)
.then(() => console.log(`Connected to ${env} MongoDB`))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;