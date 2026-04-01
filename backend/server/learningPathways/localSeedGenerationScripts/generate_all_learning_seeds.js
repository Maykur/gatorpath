const generateLearningTracksSeed = require("./generate_learning_tracks_seed");
const generateProgramAliasesSeed = require("./generate_program_aliases_seed");
const generateProgramTrackMapSeed = require("./generate_program_track_map_seed");
const generateTaxonomySummary = require("./generate_taxonomy_summary");

// This script is intended to be run manually by devs when they want to refresh the learning taxonomy seed data in MongoDB 
// based on the current state of the programs collection and the taxonomy config rules
async function main() {
  await generateLearningTracksSeed();
  await generateProgramAliasesSeed();
  await generateProgramTrackMapSeed();
  await generateTaxonomySummary();

  console.log("Finished generating all learning taxonomy seed files from MongoDB.");
}

module.exports = main;

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
