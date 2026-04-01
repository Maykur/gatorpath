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

function slugify(value = "") {
  return normalizeText(value).replace(/\s+/g, "-");
}

function dedupeByKey(items = [], getKey) {
  const map = new Map();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return [...map.values()];
}

async function main() {
  await mongoose.connect(process.env.mongo_url);

  const programs = await Program.find({}, { program_name: 1, program_type: 1, _id: 0 }).lean();

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

  const aliasDocs = dedupeByKey(
    [...majorAliasDocs, ...programAliasDocs],
    (doc) => `${doc.canonicalName}::${doc.programType}`
  );

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

  await ProgramAlias.deleteMany({});
  await LearningTrack.deleteMany({});
  await ProgramTrackMap.deleteMany({});

  if (learningTrackDocs.length) await LearningTrack.insertMany(learningTrackDocs);
  if (aliasDocs.length) await ProgramAlias.insertMany(aliasDocs);
  if (mapDocs.length) await ProgramTrackMap.insertMany(mapDocs);

  console.log(`Seeded ${learningTrackDocs.length} learning tracks.`);
  console.log(`Seeded ${aliasDocs.length} program aliases.`);
  console.log(`Seeded ${mapDocs.length} program-track mappings.`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (disconnectErr) {
    console.error(disconnectErr);
  }
  process.exit(1);
});
