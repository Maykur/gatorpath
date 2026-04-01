const ProgramAlias = require("../datasets/ProgramAlias");
const ProgramTrackMap = require("../datasets/ProgramTrackMap");
const LearningTrack = require("../datasets/LearningTrack");
const UnmatchedSearchSignal = require("../datasets/UnmatchedSearchSignal");
const {getProgWords} = require("../progWords");
const onetData = require("../datasets/oneNetData.json");
const majorToOnet = require("../datasets/oneNetMap");
const {RESOURCE_CATALOG} = require("./resource_catalog");

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\|/g, " ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(arr = []) {
  return [...new Set(arr.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

// Helper function to simplify major names by removing parenthetical and hyphenated details
function simplifyMajor(major = "") {
  return major ? major.split("(")[0].split("-")[0].trim() : "";
}

// Build a list of career-related seed terms based on the user's academic background
function buildCareerSeeds(search) {
  const major = search?.academic?.majorLabel || "";
  const minor = search?.academic?.minor || "";
  const certificate = search?.academic?.certificate || "";

  // Simplify the major name and find related careers using the O*NET mapping
  const simplifiedMajor = simplifyMajor(major);
  const onetCodes = majorToOnet[simplifiedMajor] || [];
  const relatedCareers = onetData.filter((job) => onetCodes.includes(job.soc));
  const careerTitles = relatedCareers.map((career) => career.title);

  // Extract keywords from the minor and certificate fields to use as additional seed terms
  const programKeywords = [...getProgWords(minor), ...getProgWords(certificate)];

  // Combine the simplified major, related career titles, and program keywords into a unique list of seed terms
  return unique([simplifiedMajor, ...careerTitles, ...programKeywords]);
}

function uniqueByUrl(items = []) {
  const seen = new Set();
  const results = [];

  for (const item of items) {
    if (!item?.url || seen.has(item.url)) continue;
    seen.add(item.url);
    results.push(item);
  }

  return results;
}

// Helper function to deduplicate items using a custom key
function uniqueByKey(items = [], getKey) {
  const seen = new Set();
  const results = [];

  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    results.push(item);
  }

  return results;
}

// Helper function to count how many values overlap with a target set
function countMatches(values = [], targetSet = new Set()) {
  let count = 0;

  for (const value of values) {
    if (targetSet.has(value)) count += 1;
  }

  return count;
}

function scoreAliasMatch(input, aliasDoc) {
  const normalizedInput = normalizeText(input);
  if (!normalizedInput) return 0;

  const aliasValues = [
    aliasDoc.canonicalName,
    ...(aliasDoc.aliases || []),
    aliasDoc.slug ? aliasDoc.slug.replace(/-/g, " ") : "",
  ].map(normalizeText);

  if (aliasValues.includes(normalizedInput)) return 100;

  const inputTokens = normalizedInput.split(" ").filter(Boolean);
  const tokenSet = new Set((aliasDoc.tokens || []).map((token) => normalizeText(token)));
  let overlap = 0;

  for (const token of inputTokens) {
    if (tokenSet.has(token)) overlap += 1;
  }

  if (!inputTokens.length) return 0;
  return Math.round((overlap / inputTokens.length) * 80);
}

async function resolveProgram(inputValue, expectedType) {
  const rawValue = String(inputValue || "").trim();
  if (!rawValue) return null;

  const normalizedValue = normalizeText(rawValue);
  if (!normalizedValue) return null;

  const aliasDocs = await ProgramAlias.find({
    active: true,
    programType: expectedType,
  }).lean();

  let best = null;
  let bestScore = 0;

  for (const aliasDoc of aliasDocs) {
    const score = scoreAliasMatch(rawValue, aliasDoc);
    if (score > bestScore) {
      best = aliasDoc;
      bestScore = score;
    }
  }

  if (!best || bestScore < 50) {
    return {
      matched: false,
      rawValue,
      normalizedValue,
      inputType: expectedType,
      confidence: Math.max(bestScore / 100, 0),
    };
  }

  return {
    matched: true,
    rawValue,
    normalizedValue,
    inputType: expectedType,
    canonicalName: best.canonicalName,
    programType: best.programType,
    confidence: bestScore / 100,
  };
}

async function recordUnmatchedSignal(resolution, searchId) {
  if (!resolution || resolution.matched) return;

  await UnmatchedSearchSignal.findOneAndUpdate(
    {
      rawValue: resolution.rawValue,
      inputType: resolution.inputType,
    },
    {
      $set: {
        normalizedValue: resolution.normalizedValue,
        lastSeenAt: new Date(),
        confidence: resolution.confidence,
      },
      $setOnInsert: {
        firstSeenAt: new Date(),
        needsReview: true,
      },
      $inc: {seenCount: 1},
      ...(searchId ? {$addToSet: {exampleSearchIds: searchId}} : {}),
    },
    {
      upsert: true,
      new: true,
    }
  );
}

async function getTrackWeightsForResolvedProgram(resolution) {
  if (!resolution?.matched) return [];

  const mapping = await ProgramTrackMap.findOne({
    canonicalName: resolution.canonicalName,
    programType: resolution.programType,
  }).lean();

  return Array.isArray(mapping?.linkedTracks) ? mapping.linkedTracks : [];
}

function buildSearchInputs(search) {
  return [
    {value: search?.academic?.majorLabel, type: "Major"},
    {value: search?.academic?.minor, type: "Minor"},
    {value: search?.academic?.certificate, type: "Certificate"},
  ].filter((entry) => String(entry.value || "").trim());
}

// Helper function to normalize labels before deduplicating display values
function normalizeDisplayValue(value = "") {
  const normalized = String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\s+/g, " ")
    .trim();

  const canonicalMap = {
    "javascript": "javascript / typescript",
    "javascript / typescript": "javascript / typescript",
    "git / github": "git / github",
    "github": "git / github",
    "blender": "blender / creative tools",
    "blender / creative tools": "blender / creative tools",
  };

  return canonicalMap[normalized] || normalized;
}

// Helper function to deduplicate display lists more cleanly
function uniqueDisplayList(items = []) {
  const seen = new Set();
  const results = [];

  for (const item of items) {
    const raw = String(item || "").trim();
    if (!raw) continue;

    const normalized = normalizeDisplayValue(raw);
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    results.push(raw);
  }

  return results;
}

// Helper function to split ranked tracks into primary and secondary groups
function splitTrackBuckets(rankedTrackKeys = [], trackWeightMap = new Map(), tracksByKey = new Map()) {
  const rankedTracksWithWeights = rankedTrackKeys
    .map((trackKey) => ({
      track: tracksByKey.get(trackKey),
      weight: Number(trackWeightMap.get(trackKey) || 0),
    }))
    .filter((entry) => entry.track);

  if (!rankedTracksWithWeights.length) {
    return {
      primaryTracks: [],
      secondaryTracks: [],
      rankedTracksWithWeights: [],
    };
  }

  const topWeight = rankedTracksWithWeights[0].weight;

  // Primary tracks = the strongest one or two tracks only
  const primaryTracks = rankedTracksWithWeights
    .filter((entry, index) => index === 0 || entry.weight >= topWeight * 0.70)
    .slice(0, 2)
    .map((entry) => entry.track);

  const primaryTrackKeys = new Set(primaryTracks.map((track) => track.key));

  // Secondary tracks = only tracks that are still reasonably close, but not already primary
  const secondaryTracks = rankedTracksWithWeights
    .filter((entry) => !primaryTrackKeys.has(entry.track.key))
    .filter((entry) => entry.weight >= topWeight * 0.65)
    .slice(0, 2)
    .map((entry) => entry.track);

  return {
    primaryTracks,
    secondaryTracks,
    rankedTracksWithWeights,
  };
}

// Helper function to score catalog resources using matched track tags and track keys
function scoreCatalogResource(resource = {}, tagSet = new Set(), trackKeySet = new Set()) {
  const resourceTrackKeys = Array.isArray(resource.trackKeys) ? resource.trackKeys : [];
  const excludedTrackKeys = new Set(resource.excludedTrackKeys || []);
  const forbiddenTags = new Set(resource.forbiddenTags || []);

  for (const selectedTrackKey of trackKeySet) {
    if (excludedTrackKeys.has(selectedTrackKey)) {
      return {
        score: 0,
        matchedTrackKeys: 0,
        matchedTags: 0,
      };
    }
  }

  for (const tag of resource.tags || []) {
    if (forbiddenTags.has(tag) && tagSet.has(tag)) {
      return {
        score: 0,
        matchedTrackKeys: 0,
        matchedTags: 0,
      };
    }
  }

  const matchedTrackKeys = countMatches(resourceTrackKeys, trackKeySet);
  const matchedTags = countMatches(resource.tags || [], tagSet);

  // If the resource declares track keys, treat them as a hard scope filter.
  if (resourceTrackKeys.length && matchedTrackKeys === 0) {
    return {
      score: 0,
      matchedTrackKeys,
      matchedTags,
    };
  }

  // For broad resources without trackKeys, require stronger tag evidence.
  if (!resourceTrackKeys.length && matchedTags < 3) {
    return {
      score: 0,
      matchedTrackKeys,
      matchedTags,
    };
  }

  let score = 0;

  // Direct track matches matter much more than broad tag overlap.
  score += matchedTrackKeys * 12;
  score += matchedTags * 2;
  score += Number(resource.weight || 0);

  // Small bonus for structured evergreen resources.
  if (resource.resourceType === "documentation" || resource.resourceType === "roadmap") {
    score += 1;
  }

  // Favor resources that are intentionally scoped instead of globally broad.
  if (resourceTrackKeys.length > 0 && resourceTrackKeys.length <= 2) {
    score += 2;
  }

  return {
    score,
    matchedTrackKeys,
    matchedTags,
  };
}

// Build the primary recommended resource list using the resource catalog and matched tracks
function buildCatalogResourceLinks(trackDocs = []) {
  const tagSet = new Set(
    trackDocs.flatMap((track) => track.resourceTags || []).filter(Boolean)
  );

  const trackKeySet = new Set(
    trackDocs.map((track) => track.key).filter(Boolean)
  );

  const scoredResources = RESOURCE_CATALOG
    .map((resource) => {
      const { score, matchedTrackKeys, matchedTags } = scoreCatalogResource(resource, tagSet, trackKeySet);

      return {
        ...resource,
        score,
        matchedTrackKeys,
        matchedTags,
      };
    })
    .filter((resource) => resource.score > 0)
    .sort((a, b) => {
      if (b.matchedTrackKeys !== a.matchedTrackKeys) {
        return b.matchedTrackKeys - a.matchedTrackKeys;
      }

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return Number(b.weight || 0) - Number(a.weight || 0);
    });

  const typeCounts = new Map();
  const providerTypeCounts = new Map();
  const links = [];

  for (const resource of scoredResources) {
    const typeKey = resource.resourceType || "general";
    const providerTypeKey = resource.providerType || "general";
    const currentTypeCount = typeCounts.get(typeKey) || 0;
    const currentProviderTypeCount = providerTypeCounts.get(providerTypeKey) || 0;

    // Prevent the list from being dominated by one kind of resource.
    if (currentTypeCount >= 2) continue;

    // Also keep variety across docs, courses, and practice platforms.
    if (currentProviderTypeCount >= 2) continue;

    typeCounts.set(typeKey, currentTypeCount + 1);
    providerTypeCounts.set(providerTypeKey, currentProviderTypeCount + 1);

    links.push({
      title: resource.title,
      provider: resource.provider,
      url: resource.url,
    });

    if (links.length >= 6) break;
  }

  return uniqueByKey(links, (item) => item.url);
}

// Build a smaller list of YouTube search links based on track resource queries and seed terms
function buildYoutubeLinks(trackDocs = [], seedTerms = []) {
  const links = [];

  for (const track of trackDocs) {
    for (const query of track.resourceQueries || []) {
      links.push({
        title: query,
        provider: "YouTube Search",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      });
    }
  }

  const dedupedTrackLinks = uniqueByKey(links, (item) => item.url);
  if (dedupedTrackLinks.length >= 4) {
    return dedupedTrackLinks.slice(0, 4);
  }

  for (const term of seedTerms.slice(0, 4)) {
    dedupedTrackLinks.push({
      title: `${term} tutorial`,
      provider: "YouTube Search",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term + " tutorial")}`,
    });
  }

  return uniqueByKey(dedupedTrackLinks, (item) => item.url).slice(0, 4);
}

function buildCertificationList(trackDocs = []) {
  return uniqueDisplayList(
    trackDocs.flatMap((track) => track.certificationQueries || [])
  ).slice(0, 6);
}

// Main function to build learning pathways based on the user's search criteria
async function buildLearningPathways(search) {
  const inputs = buildSearchInputs(search);

  if (!inputs.length) {
    return {
      resources: [],
      youtubeResources: [],
      languages: [],
      platforms: [],
      certifications: [],
      seedTerms: [],
      resolvedPrograms: [],
      unmatchedPrograms: [],
      trackMatches: [],
    };
  }

  const resolutions = await Promise.all(
    inputs.map(({value, type}) => resolveProgram(value, type))
  );

  const matchedPrograms = resolutions.filter((result) => result?.matched);
  const unmatchedPrograms = resolutions.filter((result) => result && !result.matched);

  await Promise.all(
    unmatchedPrograms.map((result) => recordUnmatchedSignal(result, search?._id))
  );

  const trackWeightMap = new Map();

  for (const program of matchedPrograms) {
    const linkedTracks = await getTrackWeightsForResolvedProgram(program);

    for (const linkedTrack of linkedTracks) {
      const currentWeight = trackWeightMap.get(linkedTrack.trackKey) || 0;
      trackWeightMap.set(linkedTrack.trackKey, currentWeight + Number(linkedTrack.weight || 0));
    }
  }

  const rankedTrackKeys = [...trackWeightMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([trackKey]) => trackKey);

  const trackDocs = await LearningTrack.find({
    active: true,
    key: {$in: rankedTrackKeys},
  }).lean();

  const tracksByKey = new Map(trackDocs.map((track) => [track.key, track]));
  const rankedTracks = rankedTrackKeys
    .map((trackKey) => tracksByKey.get(trackKey))
    .filter(Boolean);

  // Split matched tracks into primary and secondary groups so weaker tracks
  // do not overly influence the final recommendations
  const {
    primaryTracks,
    secondaryTracks,
    rankedTracksWithWeights,
  } = splitTrackBuckets(rankedTrackKeys, trackWeightMap, tracksByKey);

  // Use primary + secondary tracks for broader support lists like languages and platforms
  const supportTracks = [...primaryTracks, ...secondaryTracks];

  // Build seed terms for supplemental YouTube search links
  const seedTerms = buildCareerSeeds(search);

  // Build the main resource recommendations from the strongest tracks only
  const resources = buildCatalogResourceLinks(primaryTracks.length ? primaryTracks : rankedTracks);

  // Build a smaller secondary list of YouTube search recommendations
  const youtubeResources = buildYoutubeLinks(supportTracks.length ? supportTracks : rankedTracks, seedTerms);

  return {
    resources,
    youtubeResources,
    languages: uniqueDisplayList(
      (supportTracks.length ? supportTracks : rankedTracks).flatMap((track) => track.languages || [])
    ).slice(0, 8),
    platforms: uniqueDisplayList(
      (supportTracks.length ? supportTracks : rankedTracks).flatMap((track) => track.platforms || [])
    ).slice(0, 8),
    certifications: buildCertificationList(primaryTracks.length ? primaryTracks : rankedTracks),
    seedTerms,
    resolvedPrograms: matchedPrograms.map((program) => ({
      rawValue: program.rawValue,
      canonicalName: program.canonicalName,
      programType: program.programType,
      confidence: program.confidence,
    })),
    unmatchedPrograms: unmatchedPrograms.map((program) => ({
      rawValue: program.rawValue,
      inputType: program.inputType,
      confidence: program.confidence,
    })),
    trackMatches: rankedTrackKeys.map((trackKey) => ({
      trackKey,
      weight: trackWeightMap.get(trackKey),
      label: tracksByKey.get(trackKey)?.label || trackKey,
    })),
  };
}

module.exports = {buildLearningPathways};
