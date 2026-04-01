const fs = require("fs");
const path = require("path");

const STOPWORDS = new Set([
  "and", "the", "of", "in", "for", "to", "with", "or", "a", "an", "on",
  "studies", "study", "science", "sciences", "arts", "applications",
  "fundamentals", "management", "technology", "technologies"
]);

const ACRONYM_STOPWORDS = new Set([
  "and", "the", "of", "in", "for", "to", "with", "or", "a", "an", "on"
]);

const SHORT_KEEP_TOKENS = new Set(["ai", "ml", "ui", "ux", "vr", "ar"]);

function defineTrack({
  key,
  label,
  keywords = [],
  languages = [],
  platforms = [],
  resourceTags = [],
  resourceQueries = [],
  certificationQueries = [],
  priority = 5,
}) {
  return {
    key,
    label,
    keywords,
    triggers: keywords,
    languages,
    platforms,
    resourceTags,
    resourceQueries,
    certificationQueries,
    priority,
  };
}

const LEARNING_TRACKS = [
  defineTrack({
    key: "software_engineering",
    label: "Software Engineering",
    keywords: ["software", "programming", "developer", "application", "coding", "computer science"],
    languages: ["Python", "Java", "JavaScript / TypeScript", "C++", "SQL"],
    platforms: ["Git / GitHub", "VS Code", "Docker", "Postman", "CI/CD Tools"],
    resourceTags: ["foundations", "practice", "projects", "documentation", "tooling", "interview", "backend", "web", "cloud"],
    resourceQueries: ["software engineering learning path", "computer science professional certificate"],
    certificationQueries: ["software developer certification", "cloud practitioner certification"],
    priority: 10,
  }),
  defineTrack({
    key: "ai_ml",
    label: "AI / Machine Learning",
    keywords: ["artificial intelligence", "ai", "machine learning", "ml", "data science", "deep learning", "nlp"],
    languages: ["Python", "SQL"],
    platforms: ["Jupyter", "TensorFlow / PyTorch", "Hugging Face"],
    resourceTags: ["foundations", "ml", "nlp", "data", "projects", "practice", "documentation", "certification"],
    resourceQueries: ["machine learning learning path", "artificial intelligence professional certificate", "natural language processing learning path"],
    certificationQueries: ["artificial intelligence certification", "data analytics certification"],
    priority: 10,
  }),
  defineTrack({
    key: "data_analytics",
    label: "Data / Analytics",
    keywords: ["data", "analytics", "statistics", "econometrics", "bioinformatics", "big data", "business intelligence"],
    languages: ["Python", "SQL", "R"],
    platforms: ["Jupyter", "Tableau / Power BI", "Pandas / NumPy"],
    resourceTags: ["foundations", "data", "analytics", "sql", "visualization", "projects", "practice", "documentation", "certification"],
    resourceQueries: ["data analytics learning path", "data engineering certificate", "sql python analytics learning path"],
    certificationQueries: ["data analytics certification", "business intelligence certification"],
    priority: 9,
  }),
  defineTrack({
    key: "cybersecurity_networking",
    label: "Cybersecurity / Networking",
    keywords: ["security", "cyber", "cybersecurity", "network", "networking", "information assurance", "incident response"],
    languages: ["Python", "SQL", "Bash"],
    platforms: ["Wireshark", "Linux", "Splunk / SIEM"],
    resourceTags: ["foundations", "cybersecurity", "networking", "hands_on_labs", "practice", "tooling", "certification", "cloud"],
    resourceQueries: ["cybersecurity learning path", "network security fundamentals"],
    certificationQueries: ["security+ certification", "networking certification"],
    priority: 8,
  }),
  defineTrack({
    key: "hardware_embedded",
    label: "Hardware / Embedded Systems",
    keywords: ["electrical", "hardware", "embedded", "materials", "packaging engineering", "nuclear", "circuit", "microcontroller"],
    languages: ["C", "C++", "Python"],
    platforms: ["Arduino / Raspberry Pi", "MATLAB", "KiCad / CAD"],
    resourceTags: ["foundations", "hardware", "embedded", "projects", "tooling", "practice", "documentation", "certification"],
    resourceQueries: ["embedded systems learning path", "computer engineering curriculum"],
    certificationQueries: ["embedded systems certification", "hardware engineering certification"],
    priority: 8,
  }),
  defineTrack({
    key: "web_product",
    label: "Web / Product / UX",
    keywords: ["web", "product", "ux", "ui", "interface", "frontend", "full stack", "graphic", "advertising"],
    languages: ["JavaScript", "HTML/CSS", "SQL"],
    platforms: ["React", "Figma", "Git / GitHub"],
    resourceTags: ["foundations", "web", "frontend", "backend", "ui_ux", "projects", "documentation", "practice", "tooling", "portfolio"],
    resourceQueries: ["web development learning path", "ux ui design certificate"],
    certificationQueries: ["web development certification", "ux design certification"],
    priority: 8,
  }),
  defineTrack({
    key: "design_creative_media",
    label: "Design / Creative Media",
    keywords: ["design", "art", "media", "music", "theatre", "dance", "creative", "ceramics", "visual", "media production"],
    languages: ["Design Communication", "Adobe Workflow Literacy"],
    platforms: ["Adobe Creative Cloud", "Figma", "Blender / Creative Tools"],
    resourceTags: ["foundations", "design", "creative", "projects", "tooling", "portfolio", "documentation"],
    resourceQueries: ["creative media learning path", "graphic design professional certificate"],
    certificationQueries: ["graphic design certification", "creative media certification"],
    priority: 7,
  }),
  defineTrack({
    key: "game_interactive_media",
    label: "Game / Interactive Media",
    keywords: ["game", "digital arts", "interactive", "animation", "media production", "unreal", "unity"],
    languages: ["C#", "Python", "JavaScript"],
    platforms: ["Unity / Unreal", "Blender", "Git / GitHub"],
    resourceTags: ["foundations", "game_dev", "creative", "projects", "tooling", "practice", "portfolio"],
    resourceQueries: ["game development learning path", "interactive media certificate"],
    certificationQueries: ["unity certification", "game development certification"],
    priority: 7,
  }),
  defineTrack({
    key: "language_proficiency",
    label: "Language Proficiency",
    keywords: ["arabic", "spanish", "french", "german", "portuguese", "russian", "hebrew", "italian", "language", "linguistics", "sign language", "tesl", "translation"],
    languages: ["Target Language", "English Technical Writing"],
    platforms: ["Language Learning Platforms", "Translation / Dictionary Tools"],
    resourceTags: ["foundations", "language_learning", "practice", "writing", "communication", "certification"],
    resourceQueries: ["language learning path", "language proficiency preparation"],
    certificationQueries: ["language proficiency certification", "translation certification"],
    priority: 9,
  }),
  defineTrack({
    key: "translation_localization_nlp",
    label: "Translation / Localization / NLP",
    keywords: ["translation", "localization", "linguistics", "language", "public relations", "communication", "news media", "nlp"],
    languages: ["Python", "Target Language", "SQL"],
    platforms: ["Hugging Face", "Translation Tools", "Jupyter"],
    resourceTags: ["foundations", "translation", "language_learning", "nlp", "documentation", "projects", "writing", "communication"],
    resourceQueries: ["translation localization learning path", "natural language processing learning path"],
    certificationQueries: ["translation certification", "nlp certificate"],
    priority: 8,
  }),
  defineTrack({
    key: "business_entrepreneurship",
    label: "Business / Entrepreneurship",
    keywords: ["business", "entrepreneurship", "selling", "sales", "management", "real estate", "retailing", "accounting", "wealth", "hospitality"],
    languages: ["SQL", "Business Analytics"],
    platforms: ["Excel / Sheets", "CRM Tools", "Tableau / Power BI"],
    resourceTags: ["foundations", "translation", "language_learning", "nlp", "documentation", "projects", "writing", "communication"],
    resourceQueries: ["business analytics learning path", "entrepreneurship certificate"],
    certificationQueries: ["project management certification", "sales certification"],
    priority: 8,
  }),
  defineTrack({
    key: "communication_public_relations",
    label: "Communication / Public Relations",
    keywords: ["communication", "public relations", "media", "public affairs", "political communication", "mass communication", "advertising"],
    languages: ["Professional Writing", "Audience Analysis"],
    platforms: ["Canva / Creative Tools", "Analytics Platforms", "CMS / Publishing Tools"],
    resourceTags: ["foundations", "business", "analytics", "projects", "communication", "tooling", "certification", "leadership"],
    resourceQueries: ["public relations learning path", "communications certificate"],
    certificationQueries: ["communications certification", "public relations certificate"],
    priority: 7,
  }),
  defineTrack({
    key: "education_teaching",
    label: "Education / Teaching",
    keywords: ["education", "teaching", "ufteach", "teacher", "secondary", "curriculum", "early childhood", "educational technology"],
    languages: ["Instructional Design", "Assessment Literacy"],
    platforms: ["Learning Management Systems", "Educational Technology Tools"],
    resourceTags: ["foundations", "communication", "writing", "analytics", "projects", "portfolio", "documentation", "branding"],
    resourceQueries: ["teacher preparation learning path", "instructional design certificate"],
    certificationQueries: ["teaching certification", "instructional design certificate"],
    priority: 7,
  }),
  defineTrack({
    key: "health_public_health",
    label: "Health / Public Health",
    keywords: ["health", "medicine", "medical", "public health", "rehabilitation", "wellness", "healthcare", "disorders", "coaching"],
    languages: ["Health Data Literacy", "Professional Communication"],
    platforms: ["Public Health Data Tools", "Clinical / Research Tools"],
    resourceTags: ["foundations", "health", "data", "analytics", "research", "documentation", "certification"],
    resourceQueries: ["public health learning path", "healthcare analytics certificate"],
    certificationQueries: ["public health certificate", "healthcare certification"],
    priority: 8,
  }),
  defineTrack({
    key: "bio_life_sciences",
    label: "Biology / Life Sciences",
    keywords: ["bio", "biology", "botany", "zoology", "genetics", "pathogenesis", "entomology", "primatology", "plant", "chemistry"],
    languages: ["Python", "R"],
    platforms: ["Jupyter", "Bioinformatics Tools", "Lab Data Tools"],
    resourceTags: ["foundations", "bioinformatics", "research", "data", "projects", "documentation", "lab_tools"],
    resourceQueries: ["bioinformatics learning path", "life sciences data analysis"],
    certificationQueries: ["bioinformatics certificate", "life sciences certification"],
    priority: 7,
  }),
  defineTrack({
    key: "gis_geospatial",
    label: "GIS / Geospatial / Mapping",
    keywords: ["geospatial", "geomatics", "mapping", "geography", "geoai", "meteorology", "climatology", "uav", "aerial"],
    languages: ["Python", "SQL"],
    platforms: ["ArcGIS / QGIS", "Jupyter", "Remote Sensing Tools"],
    resourceTags: ["foundations", "gis", "data", "projects", "tooling", "documentation", "certification", "mapping"],
    resourceQueries: ["gis learning path", "geospatial analysis certificate"],
    certificationQueries: ["gis certification", "remote sensing certificate"],
    priority: 8,
  }),
  defineTrack({
    key: "environment_sustainability",
    label: "Environment / Sustainability",
    keywords: ["environment", "sustainability", "ecology", "forest", "climate", "resilient energy", "built environment", "policy", "conservation"],
    languages: ["Data Literacy", "Policy Communication"],
    platforms: ["GIS Tools", "Environmental Data Platforms", "Jupyter"],
    resourceTags: ["foundations", "gis", "data", "projects", "tooling", "documentation", "certification", "mapping"],
    resourceQueries: ["sustainability learning path", "environmental policy certificate"],
    certificationQueries: ["sustainability certification", "environmental management certification"],
    priority: 7,
  }),
  defineTrack({
    key: "policy_law_public_affairs",
    label: "Policy / Law / Public Affairs",
    keywords: ["law", "policy", "public affairs", "public service", "international relations", "campaigning", "legal", "ethics", "society"],
    languages: ["Policy Writing", "Data Literacy"],
    platforms: ["Policy Research Tools", "Civic Data Platforms"],
    resourceTags: ["foundations", "sustainability", "policy", "research", "data", "projects", "documentation"],
    resourceQueries: ["public policy learning path", "law and regulation certificate"],
    certificationQueries: ["policy certificate", "compliance certification"],
    priority: 7,
  }),
  defineTrack({
    key: "agriculture_natural_resources",
    label: "Agriculture / Natural Resources",
    keywords: ["agric", "horticulture", "soil", "water", "food", "beekeeping", "pest", "fisheries", "natural resource", "forestry", "agroecology"],
    languages: ["Data Literacy", "Field Research Communication"],
    platforms: ["GIS Tools", "Agricultural Data Platforms", "Remote Sensing Tools"],
    resourceTags: ["foundations", "policy", "research", "writing", "communication", "documentation", "certification", "compliance"],
    resourceQueries: ["precision agriculture learning path", "agriculture technology certificate"],
    certificationQueries: ["agriculture certification", "natural resources certification"],
    priority: 7,
  }),
  defineTrack({
    key: "arts_humanities_culture",
    label: "Arts / Humanities / Culture",
    keywords: ["history", "philosophy", "religion", "studies", "classical", "jewish", "holocaust", "anthropology", "sociology"],
    languages: ["Research Writing", "Critical Analysis"],
    platforms: ["Research Databases", "Writing / Citation Tools"],
    resourceTags: ["foundations", "agriculture", "gis", "data", "research", "projects", "documentation", "fieldwork"],
    resourceQueries: ["humanities research learning path", "digital humanities certificate"],
    certificationQueries: ["research certificate", "writing certificate"],
    priority: 6,
  }),
];

/*
  Keep only a very small override layer for majors that need stronger
  intentional weighting than generic keyword matching provides.
*/
const MAJOR_FAMILIES = [
  {
    canonicalName: "Computer Science (CSE) - College of Engineering",
    programType: "Major",
    aliasMode: "strict",
    aliases: [
      "Computer Science (CSE) - College of Engineering",
      "Computer Science Engineering",
      "CSE Computer Science Engineering",
      "Computer Science COE"
    ],
    linkedTracks: [
      { trackKey: "software_engineering", weight: 10 },
      { trackKey: "hardware_embedded", weight: 6 },
      { trackKey: "ai_ml", weight: 7 },
      { trackKey: "data_analytics", weight: 6 },
      { trackKey: "cybersecurity_networking", weight: 5 }
    ]
  },
  {
    canonicalName: "Computer Science (CSC) - College of Liberal Arts & Sciences",
    programType: "Major",
    aliasMode: "strict",
    aliases: [
      "Computer Science (CSC) - College of Liberal Arts & Sciences",
      "Computer Science CLAS",
      "CSC Computer Science CLAS",
      "Computer Science Liberal Arts and Sciences"
    ],
    linkedTracks: [
      { trackKey: "software_engineering", weight: 9 },
      { trackKey: "ai_ml", weight: 8 },
      { trackKey: "data_analytics", weight: 8 },
      { trackKey: "web_product", weight: 6 },
      { trackKey: "cybersecurity_networking", weight: 5 }
    ]
  },
  {
    canonicalName: "Computer Engineering",
    programType: "Major",
    aliases: [
      "Computer Engineering",
      "Computer Engineering (CPE) - BSCoE",
      "CPE Computer Engineering"
    ],
    linkedTracks: [
      { trackKey: "hardware_embedded", weight: 10 },
      { trackKey: "software_engineering", weight: 7 },
      { trackKey: "cybersecurity_networking", weight: 6 },
      { trackKey: "ai_ml", weight: 4 }
    ]
  },
  {
    canonicalName: "Digital Arts and Sciences",
    programType: "Major",
    aliases: [
      "Digital Arts and Sciences",
      "Digital Arts and Sciences (DAS)",
      "DAS"
    ],
    linkedTracks: [
      { trackKey: "design_creative_media", weight: 10 },
      { trackKey: "game_interactive_media", weight: 10 },
      { trackKey: "web_product", weight: 6 },
      { trackKey: "software_engineering", weight: 4 }
    ]
  }
];

function track(trackKey, weight) {
  return { trackKey, weight };
}

const PROGRAM_RULES = [
  {
    matchAny: ["mathematics", "actuarial science", "statistics", "economics", "econometric", "data analytics"],
    linkedTracks: [
      track("data_analytics", 10),
      track("ai_ml", 4),
    ],
  },
  {
    matchAny: ["physics", "astronomy"],
    linkedTracks: [
      track("data_analytics", 7),
      track("hardware_embedded", 5),
    ],
  },
  {
    matchAny: ["geology", "geological sciences"],
    linkedTracks: [
      track("gis_geospatial", 8),
      track("environment_sustainability", 5),
      track("data_analytics", 4),
    ],
  },
  {
    matchAny: ["urban and regional planning", "architecture", "landscape architecture", "construction management"],
    linkedTracks: [
      track("environment_sustainability", 10),
      track("gis_geospatial", 7),
      track("design_creative_media", 5),
    ],
  },
  {
    matchAny: ["deaf and hearing sciences", "communication sciences and disorders"],
    linkedTracks: [
      track("health_public_health", 8),
      track("language_proficiency", 6),
      track("translation_localization_nlp", 4),
    ],
  },
  {
    matchAny: ["english", "great books and ideas"],
    linkedTracks: [
      track("arts_humanities_culture", 9),
      track("communication_public_relations", 5),
    ],
  },
  {
    matchAny: [
      "leadership",
      "community engagement",
      "nonprofit organizational leadership",
      "public service",
      "military science and leadership",
      "senior fire officer",
      "emergency management"
    ],
    linkedTracks: [
      track("policy_law_public_affairs", 9),
      track("communication_public_relations", 5),
      track("business_entrepreneurship", 4),
    ],
  },
  {
    matchAny: [
      "innovation",
      "engineering innovation",
      "engineering leadership",
      "engineering project management"
    ],
    linkedTracks: [
      track("business_entrepreneurship", 8),
      track("software_engineering", 5),
      track("hardware_embedded", 4),
    ],
  },
  {
    matchAny: [
      "information systems",
      "business administration",
      "accounting",
      "real estate",
      "wealth management",
      "professional selling",
      "retailing",
      "sales engineering"
    ],
    linkedTracks: [
      track("business_entrepreneurship", 9),
      track("data_analytics", 6),
      track("software_engineering", 4),
    ],
  },
  {
    matchAny: [
      "nutritional sciences",
      "health professions",
      "health administration",
      "health promotion",
      "public health",
      "rehabilitation",
      "health and wellness coaching",
      "medical geography"
    ],
    linkedTracks: [
      track("health_public_health", 10),
      track("bio_life_sciences", 5),
      track("data_analytics", 4),
    ],
  },
  {
    matchAny: [
      "horticultural science",
      "horticultural therapy",
      "environmental horticulture",
      "food science",
      "plant science",
      "organic and sustainable crop production"
    ],
    linkedTracks: [
      track("agriculture_natural_resources", 9),
      track("bio_life_sciences", 7),
      track("environment_sustainability", 5),
    ],
  },
  {
    matchAny: [
      "packaging science",
      "packaging engineering",
      "electrical engineering",
      "materials science and engineering",
      "nuclear and radiological engineering",
      "aerospace leadership"
    ],
    linkedTracks: [
      track("hardware_embedded", 9),
      track("software_engineering", 4),
    ],
  },
  {
    matchAny: [
      "early childhood studies",
      "education studies",
      "extension education",
      "florida teaching",
      "teaching english as a second language",
      "ufteach"
    ],
    linkedTracks: [
      track("education_teaching", 10),
      track("communication_public_relations", 4),
      track("language_proficiency", 4),
    ],
  },
  {
    matchAny: [
      "graphic design",
      "creative advertising",
      "media production, management, and technology",
      "digital arts and sciences",
      "theatre production",
      "visual arts in medicine"
    ],
    linkedTracks: [
      track("design_creative_media", 9),
      track("game_interactive_media", 7),
      track("web_product", 5),
    ],
  },
  {
    matchAny: ["biosecurity and biological invasions"],
    linkedTracks: [
      track("bio_life_sciences", 8),
      track("cybersecurity_networking", 5),
      track("environment_sustainability", 4),
    ],
  },
  {
    matchAny: [
      "geospatial information analysis",
      "geomatics",
      "mapping with small unmanned aerial systems",
      "geographic artificial intelligence and big data",
      "geoai and geographic analysis"
    ],
    linkedTracks: [
      track("gis_geospatial", 10),
      track("ai_ml", 6),
      track("data_analytics", 6),
    ],
  },
  {
    matchAny: ["cals honors scholar"],
    linkedTracks: [
      track("agriculture_natural_resources", 6),
      track("environment_sustainability", 5),
    ],
  },
  {
    matchAny: ["theories and politics of sexuality", "violence against women", "disabilities in society"],
    linkedTracks: [
      track("policy_law_public_affairs", 8),
      track("arts_humanities_culture", 5),
    ],
  },
];

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsPhrase(programText = "", phrase = "") {
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return false;

  const pattern = new RegExp(`(^|\\s)${escapeRegex(normalizedPhrase)}(\\s|$)`);
  return pattern.test(programText);
}

function addTrackWeights(scoreMap, linkedTracks = []) {
  for (const item of linkedTracks) {
    if (!item?.trackKey) continue;
    scoreMap.set(item.trackKey, (scoreMap.get(item.trackKey) || 0) + Number(item.weight || 0));
  }
}

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
    .map(([trackKey, weight]) => ({ trackKey, weight }))
    .sort((a, b) => b.weight - a.weight);
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\|/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value = "") {
  return normalizeText(value)
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => (t.length > 2 || SHORT_KEEP_TOKENS.has(t)) && !STOPWORDS.has(t));
}

function titleCase(value = "") {
  return String(value)
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function unique(arr = []) {
  return [...new Set(arr.filter(Boolean))];
}

function extractBaseProgramName(programName = "") {
  return String(programName)
    .replace(/\s*-\s*.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function removeParentheticalContent(value = "") {
  return String(value)
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractParenCode(value = "") {
  const match = String(value).match(/\(([A-Z]{2,8})\)/);
  return match ? match[1].trim() : "";
}

function generateAcronym(value = "") {
  const words = normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .filter((word) => !ACRONYM_STOPWORDS.has(word));

  if (words.length < 2) return "";

  const acronym = words.map((word) => word[0]).join("").toUpperCase();
  return acronym.length >= 3 && acronym.length <= 8 ? acronym : "";
}

function buildHeuristicAliases(programName = "", programType = "") {
  const original = String(programName).trim();
  if (!original) return [];

  const strictFamily = MAJOR_FAMILIES.find((family) => {
    return (
      String(family.programType || "").toLowerCase() === String(programType || "").toLowerCase() &&
      normalizeText(family.canonicalName) === normalizeText(original) &&
      family.aliasMode === "strict"
    );
  });

  // For strict programs, ONLY use the explicit aliases you define manually.
  // This prevents both CS majors from collapsing into a shared "Computer Science" alias.
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

  aliases.add(original);
  aliases.add(titleCase(normalizeText(original)));
  aliases.add(baseName);
  aliases.add(noParenOriginal);
  aliases.add(noParenBase);

  if (original.includes("|")) {
    aliases.add(original.replace(/\|/g, "/").replace(/\s+/g, " ").trim());
    aliases.add(original.replace(/\|/g, " ").replace(/\s+/g, " ").trim());
  }

  const generatedAcronyms = unique([
    generateAcronym(original),
    generateAcronym(baseName),
    generateAcronym(noParenBase),
    parenCode,
  ]);

  for (const acronym of generatedAcronyms) {
    if (!acronym) continue;
    aliases.add(acronym);

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

function findMajorOverride(programName = "", programType = "") {
  const normalizedProgram = normalizeText(programName);
  const normalizedType = String(programType || "").toLowerCase();

  for (const family of MAJOR_FAMILIES) {
    if (String(family.programType || "").toLowerCase() !== normalizedType) continue;

    const familyNames = [
      family.canonicalName,
      ...(family.aliases || []),
    ].map(normalizeText);

    if (familyNames.includes(normalizedProgram)) {
      return family;
    }
  }

  return null;
}

function scoreKeywordMatch(programText, tokenSet, keyword = "") {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return 0;

  const keywordTokens = tokenize(normalizedKeyword);
  if (!keywordTokens.length) return 0;

  let score = 0;

  if (containsPhrase(programText, normalizedKeyword)) {
    score += keywordTokens.length > 1 ? 5 : 3;
  }

  for (const token of keywordTokens) {
    if (tokenSet.has(token)) score += 1;
  }

  return score;
}

function inferTracksForProgram(programName = "", programType = "") {
  const override = findMajorOverride(programName, programType);
  if (override?.linkedTracks?.length) {
    return override.linkedTracks;
  }

  const normalizedProgram = normalizeText(programName);
  const tokenSet = new Set(tokenize(programName));
  const scoreMap = new Map();

  // First apply the higher-confidence rule layer
  addTrackWeights(scoreMap, findProgramRuleTracks(programName));

  // Then let generic keyword scoring add nuance
  for (const track of LEARNING_TRACKS) {
    const keywords = track.keywords || track.triggers || [];
    let weight = 0;

    for (const keyword of keywords) {
      weight += scoreKeywordMatch(normalizedProgram, tokenSet, keyword);
    }

    if (weight > 0) {
      scoreMap.set(track.key, (scoreMap.get(track.key) || 0) + weight);
    }
  }

  const priorityMap = new Map(
    LEARNING_TRACKS.map((track) => [track.key, track.priority || 0])
  );

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

  if (!scoredTracks.length) {
    return [{ trackKey: "arts_humanities_culture", weight: 2 }];
  }

  const topWeight = scoredTracks[0].weight;

  return scoredTracks
    .filter((entry, index) => index === 0 || entry.weight >= Math.max(3, topWeight * 0.45))
    .slice(0, 4)
    .map(({ trackKey, weight }) => ({ trackKey, weight }));
}

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

function readPrograms(inputPath) {
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  if (!Array.isArray(raw)) {
    throw new Error("Expected programs.json to be an array");
  }
  return raw;
}

module.exports = {
  STOPWORDS,
  MAJOR_FAMILIES,
  LEARNING_TRACKS,
  normalizeText,
  tokenize,
  titleCase,
  unique,
  buildHeuristicAliases,
  inferTracksForProgram,
  buildProgramRecord,
  readPrograms,
};
