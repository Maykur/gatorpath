// Get major schema from db
const mongoose = require('mongoose');

const progSchema = new mongoose.Schema({
  program_name: String,
  description: String,
  program_type: String
});

module.exports = mongoose.model('Programs', progSchema)