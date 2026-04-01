const mongoose = require("mongoose");

const ProgramTrackMapSchema = new mongoose.Schema({
  canonicalName: { type: String, required: true, trim: true },
  programType: { type: String, enum: ["Major", "Minor", "Certificate"], required: true },
  linkedTracks: [{
    trackKey: { type: String, required: true, trim: true },
    weight: { type: Number, required: true }
  }],
  source: { type: String, default: "manual" },
  confidence: { type: Number, default: 0.75 }
});

ProgramTrackMapSchema.index({ canonicalName: 1, programType: 1 }, { unique: true });

module.exports = mongoose.model("ProgramTrackMap", ProgramTrackMapSchema);
