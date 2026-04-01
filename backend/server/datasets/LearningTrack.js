const mongoose = require("mongoose");

// Schema for learning tracks that programs can be associated with based on their name and type
const LearningTrackSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    label: {
        type: String,
        required: true,
        trim: true
    },

    active: {
        type: Boolean,
        default: true
    },

    triggers: [{
        type: String,
        trim: true
    }],

    languages: [{
        type: String,
        trim: true
    }],

    platforms: [{
        type: String,
        trim: true
    }],

    resourceTags: [{
        type: String,
        trim: true
    }],

    resourceQueries: [{
        type: String,
        trim: true
    }],

    certificationQueries: [{
        type: String,
        trim: true
    }],

    version: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("LearningTrack", LearningTrackSchema);
