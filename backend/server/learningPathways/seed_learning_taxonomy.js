/*
  CITATIONS:
  https://mongoosejs.com/docs/
  - Used as reference for Mongoose query patterns
*/
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Program = require("../datasets/Program");
const ProgramAlias = require("../datasets/ProgramAlias");
const LearningTrack = require("../datasets/LearningTrack");
const ProgramTrackMap = require("../datasets/ProgramTrackMap");

const {
  MAJOR_FAMILIES,
  LEARNING_TRACKS,
  buildProgramRecord,
  inferTracksForProgram,
  normalizeText,
} = require("./taxonomy_config");

// Helper function to build a slug version of a program name for easier matching/searching
function slugify(value = "") {
  return normalizeText(value).replace(/\s+/g, "-");
}

// Helper function to remove duplicates from an array using a custom key
function dedupeByKey(items = [], getKey) {
  const map = new Map();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return [...map.values()];
}

// Main function to seed learning tracks, aliases, and program-track mappings into MongoDB
async function main() {
  // Connect to MongoDB using the connection string from the .env file
  await mongoose.connect(process.env.mongo_url);

  // Pull all programs currently stored in MongoDB
  const programs = await Program.find({}, {program_name: 1, program_type: 1, _id: 0}).lean();

  // Build learning track documents from the configured track definitions
  const learningTrackDocs = LEARNING_TRACKS.map((track) => ({
    key: track.key,
    label: track.label,
    active: true,
    triggers: track.triggers || [],
    languages: track.languages || [],
    platforms: track.platforms || [],
    resourceTags: track.resourceTags || [],
    resourceQueries: track.resourceQueries || [],
    certificationQueries: track.certificationQueries || [],
    version: track.version || 1,
  }));

  // Build alias docs for the manually defined major families
  const majorAliasDocs = MAJOR_FAMILIES.map((m) => ({
    canonicalName: m.canonicalName,
    programType: m.programType,
    slug: slugify(m.canonicalName),
    aliases: m.aliases || [],
    tokens: Array.from(
      new Set(
        [m.canonicalName, ...(m.aliases || [])]
          .join(" ")
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean)
      )
    ),
    active: true,
  }));

  // Build alias docs for all programs pulled from MongoDB
  const programAliasDocs = programs.map((p) => {
    const base = buildProgramRecord(p.program_name, p.program_type);

    return {
      canonicalName: base.canonicalName,
      programType: base.programType,
      slug: slugify(base.canonicalName),
      aliases: base.aliases,
      tokens: base.tokens,
      active: true,
    };
  });

  // Merge manual and generated aliases, then deduplicate them
  const aliasDocs = dedupeByKey(
    [...majorAliasDocs, ...programAliasDocs],
    (doc) => `${doc.canonicalName}::${doc.programType}`
  );

  // Build program-track mappings for manually defined major families
  const majorMapDocs = MAJOR_FAMILIES.map((m) => ({
    canonicalName: m.canonicalName,
    programType: m.programType,
    linkedTracks: m.linkedTracks || [],
    source: "major_family_manual_v1",
    confidence: 0.95,
  }));

  // Build program-track mappings for all MongoDB programs using inference rules
  const programMapDocs = programs.map((p) => ({
    canonicalName: p.program_name,
    programType: p.program_type,
    linkedTracks: inferTracksForProgram(p.program_name, p.program_type),
    source: "auto_name_rules_v1",
    confidence: 0.72,
  }));

  // Merge manual and generated mappings, then deduplicate them
  const mapDocs = dedupeByKey(
    [...majorMapDocs, ...programMapDocs],
    (doc) => `${doc.canonicalName}::${doc.programType}`
  );

  // Clear old seeded collections so the newest taxonomy data fully replaces the old one
  await ProgramAlias.deleteMany({});
  await LearningTrack.deleteMany({});
  await ProgramTrackMap.deleteMany({});

  // Insert the newly built documents into MongoDB
  if (learningTrackDocs.length) {
    await LearningTrack.insertMany(learningTrackDocs);
  }

  if (aliasDocs.length) {
    await ProgramAlias.insertMany(aliasDocs);
  }

  if (mapDocs.length) {
    await ProgramTrackMap.insertMany(mapDocs);
  }

  // Log how many records were inserted for each collection
  console.log(`Seeded ${learningTrackDocs.length} learning tracks.`);
  console.log(`Seeded ${aliasDocs.length} program aliases.`);
  console.log(`Seeded ${mapDocs.length} program-track mappings.`);

  // Disconnect from MongoDB after seeding is complete
  await mongoose.disconnect();
}

// If error occurs during seeding, log it, disconnect, and exit the process
main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (disconnectErr) {
    console.error(disconnectErr);
  }
  process.exit(1);
});
