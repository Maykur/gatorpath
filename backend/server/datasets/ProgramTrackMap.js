const mongoose = require("mongoose");

// Schema for mapping canonical program names and types to associated learning tracks with weights for relevance
const ProgramTrackMapSchema = new mongoose.Schema({
  canonicalName: {
    type: String,
    required: true,
    trim: true
  },

  programType: {
    type: String,
    enum: ["Major", "Minor", "Certificate"],
    required: true
  },

  // Array of linked tracks with weights indicating relevance (0 to 1)
  linkedTracks: [{
    trackKey: {
      type: String,
      required: true,
      trim: true
    },
    
    weight: {
      type: Number,
      required: true
    }
  }],

  source: {
    type: String,
    default: "manual"
  },

  confidence: {
    type: Number,
    default: 0.75
  }
});

ProgramTrackMapSchema.index({canonicalName: 1, programType: 1}, {unique: true});

module.exports = mongoose.model("ProgramTrackMap", ProgramTrackMapSchema);
