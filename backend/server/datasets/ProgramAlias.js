const mongoose = require("mongoose");

// Schema for canonical program names and their aliases to help with consistent taxonomy and searchability
const ProgramAliasSchema = new mongoose.Schema({
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

  slug: {
    type: String,
    required: true,
    trim: true
  },

  aliases: [{
    type: String,
    trim: true
  }],

  tokens: [{
    type: String,
    trim: true
  }],

  active: {
    type: Boolean,
    default: true
  }
});

ProgramAliasSchema.index({canonicalName: 1, programType: 1}, {unique: true});
ProgramAliasSchema.index({slug: 1, programType: 1}, {unique: true});

module.exports = mongoose.model("ProgramAlias", ProgramAliasSchema);
