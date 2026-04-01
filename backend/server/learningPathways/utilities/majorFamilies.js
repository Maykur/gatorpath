// Defines the major families with their canonical names, aliases, and linked learning tracks with weights for relevance.
// Used to map user input about their major to relevant learning pathways.
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
      {trackKey: "software_engineering", weight: 10},
      {trackKey: "hardware_embedded", weight: 6},
      {trackKey: "ai_ml", weight: 7},
      {trackKey: "data_analytics", weight: 6},
      {trackKey: "cybersecurity_networking", weight: 5}
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
      {trackKey: "software_engineering", weight: 9},
      {trackKey: "ai_ml", weight: 8},
      {trackKey: "data_analytics", weight: 8},
      {trackKey: "web_product", weight: 6},
      {trackKey: "cybersecurity_networking", weight: 5}
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
      {trackKey: "hardware_embedded", weight: 10},
      {trackKey: "software_engineering", weight: 7},
      {trackKey: "cybersecurity_networking", weight: 6},
      {trackKey: "ai_ml", weight: 4}
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
      {trackKey: "design_creative_media", weight: 10},
      {trackKey: "game_interactive_media", weight: 10},
      {trackKey: "web_product", weight: 6},
      {trackKey: "software_engineering", weight: 4}
    ]
  }
];

module.exports = {
  MAJOR_FAMILIES,
};