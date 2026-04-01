const fs = require("fs");
const path = require("path");
const { LEARNING_TRACKS } = require("./taxonomy_config");

const outputPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/learning_tracks_seed.json"
);

async function main() {
  const learningTrackDocs = LEARNING_TRACKS.map((track) => ({
    key: track.key,
    label: track.label,
    active: true,
    triggers: track.triggers || track.keywords || [],
    languages: track.languages || [],
    platforms: track.platforms || [],
    resourceTags: track.resourceTags || [],
    resourceQueries: track.resourceQueries || [],
    certificationQueries: track.certificationQueries || [],
    version: track.version || 1,
  }));

  fs.writeFileSync(outputPath, JSON.stringify(learningTrackDocs, null, 2), "utf-8");
  console.log(`Wrote ${learningTrackDocs.length} learning tracks to ${outputPath}`);
}

module.exports = main;

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}