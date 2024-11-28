const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Only email should be unique
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
