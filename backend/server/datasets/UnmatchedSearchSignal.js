const mongoose = require("mongoose");

const UnmatchedSearchSignalSchema = new mongoose.Schema({
  rawValue: { type: String, required: true, trim: true },
  normalizedValue: { type: String, default: null },
  inputType: { type: String, enum: ["Major", "Minor", "Certificate", "Other"], required: true },
  matchedCanonical: { type: String, default: null },
  matchedProgramType: { type: String, enum: ["Major", "Minor", "Certificate", null], default: null },
  confidence: { type: Number, default: 0 },
  needsReview: { type: Boolean, default: true },
  seenCount: { type: Number, default: 1 },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  exampleSearchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "SearchSubmission" }],
  notes: { type: String, default: "" }
});

UnmatchedSearchSignalSchema.index({ rawValue: 1, inputType: 1 }, { unique: true });

module.exports = mongoose.model("UnmatchedSearchSignal", UnmatchedSearchSignalSchema);
