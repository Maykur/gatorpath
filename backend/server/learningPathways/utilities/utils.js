/*
CITATIONS:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
  - Used for regex-based phrase matching and normalization helpers.

  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  - Used for string cleanup and normalization with replace().

  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  - Used for deduplication and token/alias uniqueness handling.
*/

const fs = require("fs");
const path = require("path");

const {STOPWORDS, ACRONYM_STOPWORDS, SHORT_KEEP_TOKENS} = require("./constants");
const {LEARNING_TRACKS} = require("./learningTracks_defining");
const {MAJOR_FAMILIES} = require("./majorFamilies");
const {PROGRAM_RULES} = require("./programRules");

// Helper function to escape regex special characters so phrases can be matched safely
function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper function to check whether a full phrase exists in the normalized program text
function containsPhrase(programText = "", phrase = "") {
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return false;

  const pattern = new RegExp(`(^|\\s)${escapeRegex(normalizedPhrase)}(\\s|$)`);
  return pattern.test(programText);
}

// Helper function to add weighted track values into a score map
function addTrackWeights(scoreMap, linkedTracks = []) {
  for (const item of linkedTracks) {
    if (!item?.trackKey) continue;
    scoreMap.set(item.trackKey, (scoreMap.get(item.trackKey) || 0) + Number(item.weight || 0));
  }
}

// Helper function to find any rule-based program matches and return weighted track results
function findProgramRuleTracks(programName = "") {
  const normalizedProgram = normalizeText(programName);
  const scoreMap = new Map();

  for (const rule of PROGRAM_RULES) {
    const phrases = rule.matchAny || [];
    const matched = phrases.some((phrase) => containsPhrase(normalizedProgram, phrase));
    if (matched) {
      addTrackWeights(scoreMap, rule.linkedTracks || []);
    }
  }

  return [...scoreMap.entries()]
    .map(([trackKey, weight]) => ({trackKey, weight}))
    .sort((a, b) => b.weight - a.weight);
}

// Helper function to normalize text for easier comparisons and matching
function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\|/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to break a string into meaningful tokens while removing stopwords
function tokenize(value = "") {
  return normalizeText(value)
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => (t.length > 2 || SHORT_KEEP_TOKENS.has(t)) && !STOPWORDS.has(t));
}

// Helper function to convert a string into title case
function titleCase(value = "") {
  return String(value)
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

// Helper function to remove duplicate values from an array
function unique(arr = []) {
  return [...new Set(arr.filter(Boolean))];
}

// Helper function to simplify a program name by removing hyphen-separated trailing details
function extractBaseProgramName(programName = "") {
  return String(programName)
    .replace(/\s*-\s*.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to remove parenthetical content from a string
function removeParentheticalContent(value = "") {
  return String(value)
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to extract an acronym/code from parentheses like (CSE) or (DAS)
function extractParenCode(value = "") {
  const match = String(value).match(/\(([A-Z]{2,8})\)/);
  return match ? match[1].trim() : "";
}

// Helper function to generate an acronym from a phrase while skipping acronym stopwords
function generateAcronym(value = "") {
  const words = normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .filter((word) => !ACRONYM_STOPWORDS.has(word));

  if (words.length < 2) return "";

  const acronym = words.map((word) => word[0]).join("").toUpperCase();
  return acronym.length >= 3 && acronym.length <= 8 ? acronym : "";
}

// Helper function to build possible aliases for a program name using heuristics
function buildHeuristicAliases(programName = "", programType = "") {
  const original = String(programName).trim();
  if (!original) return [];

  // Check for a strict family match
  const strictFamily = MAJOR_FAMILIES.find((family) => {
    return (
      String(family.programType || "").toLowerCase() === String(programType || "").toLowerCase() &&
      normalizeText(family.canonicalName) === normalizeText(original) &&
      family.aliasMode === "strict"
    );
  });

  // For strict programs, only use manually defined aliases to avoid overlapping major names
  if (strictFamily) {
    return unique([
      strictFamily.canonicalName,
      ...(strictFamily.aliases || []),
    ]);
  }

  const aliases = new Set();

  const baseName = extractBaseProgramName(original);
  const noParenOriginal = removeParentheticalContent(original);
  const noParenBase = removeParentheticalContent(baseName);
  const parenCode = extractParenCode(original);

  // Add common direct variations of the program name
  aliases.add(original);
  aliases.add(titleCase(normalizeText(original)));
  aliases.add(baseName);
  aliases.add(noParenOriginal);
  aliases.add(noParenBase);

  // Add alternate versions for names that contain pipe symbols
  if (original.includes("|")) {
    aliases.add(original.replace(/\|/g, "/").replace(/\s+/g, " ").trim());
    aliases.add(original.replace(/\|/g, " ").replace(/\s+/g, " ").trim());
  }

  // Build acronym-based aliases when possible
  const generatedAcronyms = unique([
    generateAcronym(original),
    generateAcronym(baseName),
    generateAcronym(noParenBase),
    parenCode,
  ]);

  // Combine acronyms with the base name to create additional aliases
  for (const acronym of generatedAcronyms) {
    if (!acronym) continue;
    aliases.add(acronym);

    // Add combinations of the acronym with the base name, helps match formats like "CSE 2023" or "2023 CSE"
    if (noParenBase) {
      aliases.add(`${acronym} ${noParenBase}`.trim());
      aliases.add(`${noParenBase} ${acronym}`.trim());
    }
  }

  return unique(
    [...aliases]
      .map((alias) => String(alias || "").trim())
      .filter(Boolean)
  );
}

// Helper function to check if a program matches a manually defined major family override
function findMajorOverride(programName = "", programType = "") {
  const normalizedProgram = normalizeText(programName);
  const normalizedType = String(programType || "").toLowerCase();

  // Only apply overrides for families that match the program type and have the program name as a canonical or alias match
  for (const family of MAJOR_FAMILIES) {
    if (String(family.programType || "").toLowerCase() !== normalizedType) continue;

    // Normalized program name matches the family's canonical name or any of its aliases
    const familyNames = [
      family.canonicalName,
      ...(family.aliases || []),
    ].map(normalizeText);

    // If the program name matches any of the family's names, return this family as an override
    if (familyNames.includes(normalizedProgram)) {
      return family;
    }
  }

  return null;
}

// Helper function to score how well a keyword matches a program name
function scoreKeywordMatch(programText, tokenSet, keyword = "") {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return 0;

  const keywordTokens = tokenize(normalizedKeyword);

  if (!keywordTokens.length) return 0;

  let score = 0;

  // Give stronger score if full keyword phrase appears directly
  if (containsPhrase(programText, normalizedKeyword)) {
    score += keywordTokens.length > 1 ? 5 : 3;
  }

  // Add extra score for overlapping tokens
  for (const token of keywordTokens) {
    if (tokenSet.has(token)) score += 1;
  }

  return score;
}

// Helper function to infer which learning tracks best match a program
function inferTracksForProgram(programName = "", programType = "") {
  const override = findMajorOverride(programName, programType);
  // If override for this program exists, use the linked tracks from the major family configuration instead of scoring
  if (override?.linkedTracks?.length) {
    return override.linkedTracks;
  }

  const normalizedProgram = normalizeText(programName);
  const tokenSet = new Set(tokenize(programName));
  const scoreMap = new Map();

  // First apply higher-confidence rule-based matches
  addTrackWeights(scoreMap, findProgramRuleTracks(programName));

  // Then apply generic keyword scoring from the configured learning tracks
  for (const track of LEARNING_TRACKS) {
    const keywords = track.keywords || track.triggers || [];
    let weight = 0;

    // Score each track based on keywords matching
    for (const keyword of keywords) {
      weight += scoreKeywordMatch(normalizedProgram, tokenSet, keyword);
    }

    // Append to scoreMap
    if (weight > 0) {
      scoreMap.set(track.key, (scoreMap.get(track.key) || 0) + weight);
    }
  }

  // Use track priority as a tiebreaker when weights are similar
  const priorityMap = new Map(
    LEARNING_TRACKS.map((track) => [track.key, track.priority || 0])
  );

  // Sort tracks by weight and then by priority, and filter to keep only those that are close to the top score
  const scoredTracks = [...scoreMap.entries()]
    .map(([trackKey, weight]) => ({
      trackKey,
      weight,
      priority: priorityMap.get(trackKey) || 0,
    }))
    .filter((track) => track.weight > 0)
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.priority - a.priority;
    });

  // If nothing matches, default to nothing as this is problematic
  if (!scoredTracks.length) {
    return [];
  }

  const topWeight = scoredTracks[0].weight;

  // Keep the strongest track and other tracks that are still reasonably close in score
  return scoredTracks
    .filter((entry, index) => index === 0 || entry.weight >= Math.max(3, topWeight * 0.45))
    .slice(0, 4)
    .map(({trackKey, weight}) => ({trackKey, weight}));
}

// Helper function to build a normalized program record used for alias seeding
function buildProgramRecord(programName, programType) {
  const aliases = buildHeuristicAliases(programName, programType);

  return {
    canonicalName: programName,
    programType,
    normalizedKey: `${normalizeText(programName)}::${String(programType || "").toLowerCase()}`,
    aliases,
    tokens: unique(tokenize(programName)),
  };
}

// Helper function to read a local programs.json file when needed for seed generation
function readPrograms(inputPath) {
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  if (!Array.isArray(raw)) {
    throw new Error("Expected programs.json to be an array");
  }
  return raw;
}

module.exports = {
  normalizeText,
  tokenize,
  titleCase,
  unique,
  buildHeuristicAliases,
  inferTracksForProgram,
  buildProgramRecord,
  readPrograms,
};
