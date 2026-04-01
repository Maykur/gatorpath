const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({path: path.join(__dirname, "../../.env")});

const Program = require("../../datasets/Program");

// Utility function to load programs from the db and exe provided function with that data, ensuring proper connection
async function withProgramsFromDb(workFn) {
  // Ensure mongo_url is set
  if (!process.env.mongo_url) {
    throw new Error("mongo_url missing in backend/.env");
  }

  // Check if already connected to avoid unnecessary connections
  const shouldDisconnectAfter = mongoose.connection.readyState === 0;

  // Connect if not already connected
  if (shouldDisconnectAfter) {
    await mongoose.connect(process.env.mongo_url);
  }

  try {
    // Get program_type and program_name for all programs to track inference and program mapping
    const programs = await Program.find({},{program_name: 1, program_type: 1, _id: 0})
      .sort({program_type: 1, program_name: 1})
      .lean();

    return await workFn(programs);
  }
  // Make sure connection closes afterwards
  finally {
    if (shouldDisconnectAfter) {
      await mongoose.disconnect();
    }
  }
}

module.exports = { withProgramsFromDb };
