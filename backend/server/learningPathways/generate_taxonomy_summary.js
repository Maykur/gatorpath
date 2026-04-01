const fs = require("fs");
const path = require("path");
const { LEARNING_TRACKS, MAJOR_FAMILIES } = require("./taxonomy_config");
const { withProgramsFromDb } = require("./load_programs_from_db");

const aliasPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/program_aliases_seed.json"
);
const mapPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/program_track_map_seed.json"
);
const outputPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/taxonomy_summary.json"
);

async function main() {
  await withProgramsFromDb(async (programs) => {
    const aliases = JSON.parse(fs.readFileSync(aliasPath, "utf-8"));
    const maps = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

    const typeCounts = programs.reduce((acc, p) => {
      acc[p.program_type] = (acc[p.program_type] || 0) + 1;
      return acc;
    }, {});

    const duplicateNames = Object.entries(
      programs.reduce((acc, p) => {
        acc[p.program_name] = (acc[p.program_name] || 0) + 1;
        return acc;
      }, {})
    )
      .filter(([, count]) => count > 1)
      .map(([name, count]) => ({ name, count }));

    const trackCoverage = maps.reduce((acc, doc) => {
      for (const link of doc.linkedTracks || []) {
        acc[link.trackKey] = (acc[link.trackKey] || 0) + 1;
      }
      return acc;
    }, {});

    const summary = {
      generatedAt: new Date().toISOString(),
      totals: {
        majors: MAJOR_FAMILIES.length,
        scrapedPrograms: programs.length,
        aliasDocs: aliases.length,
        trackDocs: maps.length,
        learningTracks: LEARNING_TRACKS.length,
      },
      programTypeCounts: typeCounts,
      duplicateProgramNamesAcrossTypes: duplicateNames,
      trackCoverage,
    };

    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), "utf-8");
    console.log(`Wrote taxonomy summary to ${outputPath}`);
  });
}

module.exports = main;

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
