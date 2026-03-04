const mongoose = require("mongoose");

// Schema for users of the app
const UserSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    },

    email: {
        type: String, required: true, unique: true
    },
    
    // PW is hashed
    password: {
        type: String, required: true
    },

    major: {
        type: String, required: true
    },

    year: {
        type: String, required: true
    }, 

    profileIcon: {
        type: String
    },

    date: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model("UserInfo", UserSchema);
