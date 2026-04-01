const fs = require("fs");
const path = require("path");
const {MAJOR_FAMILIES, inferTracksForProgram} = require("../taxonomy_config");
const {withProgramsFromDb} = require("../load_programs_from_db");

const outputPath = path.resolve(__dirname, "../../learningPathSeeds/program_track_map_seed.json");

// Helper function that deduplcates items based on provided key function. It uses a Map for uniqueness
function dedupeByKey(items = [], getKey) {
  const map = new Map();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return [...map.values()];
}

// This script generates the program_track_map_seed.json file which defines the mapping between programs and learning tracks 
// based on both the major family manual mappings and the inferred mappings from program names
async function main() {
  // Fetch programs from MongoDB and generate mapping docs based on both major family manual mappings
  await withProgramsFromDb(async (programs) => {
    const majorMapDocs = MAJOR_FAMILIES.map((m) => ({
      canonicalName: m.canonicalName,
      programType: m.programType,
      linkedTracks: m.linkedTracks || [],
      source: "major_family_manual_v1",
      confidence: 0.95,
    }));


    // Fetch programs from MongoDB and generate mapping docs based on the inferred tracks
    const programMapDocs = programs.map((p) => ({
      canonicalName: p.program_name,
      programType: p.program_type,
      linkedTracks: inferTracksForProgram(p.program_name, p.program_type),
      source: "auto_name_rules_v1",
      confidence: 0.72,
    }));

    // Dedupe the combined list of mapping docs from major families and programs
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
