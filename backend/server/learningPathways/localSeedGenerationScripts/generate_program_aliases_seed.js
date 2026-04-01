const fs = require("fs");
const path = require("path");
const {MAJOR_FAMILIES, buildProgramRecord, normalizeText} = require("../taxonomy_config");
const {withProgramsFromDb} = require("../load_programs_from_db");

const outputPath = path.resolve(__dirname, "../../learningPathSeeds/program_aliases_seed.json");

// Helper function that slugifies a string by normalizing it and replacing spaces with hyphens
function slugify(value = "") {
  return normalizeText(value).replace(/\s+/g, "-");
}

// Helper function that deduplicates an array of items based on a provided key function. It uses a Map for uniqueness
function dedupeByKey(items = [], getKey) {
  const map = new Map();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return [...map.values()];
}

// This script generates the program_aliases_seed.json file based on the current programs in MongoDB and the major family config rules. 
// It combines the canonical names and aliases from both sources, deduplicates them, and outputs a JSON file that can be used to seed the ProgramAlias collection in MongoDB.
async function main() {
  await withProgramsFromDb(async (programs) => {
    // Alias docs for major families defined in  taxonomy_config, can group multiple related programs under a common canonical name and type
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

    // Alias docs generated from the actual programs in db, using buildProgramRecord to apply the heuristic rules for alias generation
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

    // Dedupe the combined list of alias docs from major families and programs
    const aliasDocs = dedupeByKey(
      [...majorAliasDocs, ...programAliasDocs],
      (doc) => `${doc.canonicalName}::${doc.programType}`
    );

    fs.writeFileSync(outputPath, JSON.stringify(aliasDocs, null, 2), "utf-8");
    console.log(`Wrote ${aliasDocs.length} alias docs to ${outputPath}`);
  });
}

module.exports = main;

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
