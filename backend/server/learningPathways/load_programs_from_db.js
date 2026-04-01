const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Program = require("../datasets/Program");

async function withProgramsFromDb(workFn) {
  if (!process.env.mongo_url) {
    throw new Error("mongo_url missing in backend/.env");
  }

  const shouldDisconnectAfter = mongoose.connection.readyState === 0;

  if (shouldDisconnectAfter) {
    await mongoose.connect(process.env.mongo_url);
  }

  try {
    const programs = await Program.find(
      {},
      { program_name: 1, program_type: 1, _id: 0 }
    )
      .sort({ program_type: 1, program_name: 1 })
      .lean();

    return await workFn(programs);
  } finally {
    if (shouldDisconnectAfter) {
      await mongoose.disconnect();
    }
  }
}

module.exports = { withProgramsFromDb };
