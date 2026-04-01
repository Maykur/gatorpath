const fs = require("fs");
const path = require("path");
const {
  MAJOR_FAMILIES,
  inferTracksForProgram,
} = require("./taxonomy_config");
const { withProgramsFromDb } = require("./load_programs_from_db");

const outputPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/program_track_map_seed.json"
);

function dedupeByKey(items = [], getKey) {
  const map = new Map();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return [...map.values()];
}

async function main() {
  await withProgramsFromDb(async (programs) => {
    const majorMapDocs = MAJOR_FAMILIES.map((m) => ({
      canonicalName: m.canonicalName,
      programType: m.programType,
      linkedTracks: m.linkedTracks || [],
      source: "major_family_manual_v1",
      confidence: 0.95,
    }));

    const programMapDocs = programs.map((p) => ({
      canonicalName: p.program_name,
      programType: p.program_type,
      linkedTracks: inferTracksForProgram(p.program_name, p.program_type),
      source: "auto_name_rules_v1",
      confidence: 0.72,
    }));

    const mapDocs = dedupeByKey(
      [...majorMapDocs, ...programMapDocs],
      (doc) => `${doc.canonicalName}::${doc.programType}`
    );

    fs.writeFileSync(outputPath, JSON.stringify(mapDocs, null, 2), "utf-8");
    console.log(`Wrote ${mapDocs.length} program-track map docs to ${outputPath}`);
  });
}

module.exports = main;

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
