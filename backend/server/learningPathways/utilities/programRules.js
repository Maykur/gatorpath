// Helper function to create track objects with a consistent structure
function track(trackKey, weight) {
  return {trackKey, weight};
}

// Program-to-track mapping rules based on specific program name matches
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

module.exports = {
  track,
  PROGRAM_RULES,
};