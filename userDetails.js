const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

// Connecting Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Setting up the schema
const User = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  salt: String,
});

// Setting up the passport plugin
User.plugin(passportLocalMongoose, {
});

module.exports = mongoose.model('User', User);
