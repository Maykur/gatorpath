const fs = require("fs");
const path = require("path");
const {
  MAJOR_FAMILIES,
  buildProgramRecord,
  normalizeText,
} = require("./taxonomy_config");
const { withProgramsFromDb } = require("./load_programs_from_db");

const outputPath = path.resolve(
  __dirname,
  "../../learningPathSeeds/program_aliases_seed.json"
);

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
  await withProgramsFromDb(async (programs) => {
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
