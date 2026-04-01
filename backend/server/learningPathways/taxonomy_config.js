const { STOPWORDS, ACRONYM_STOPWORDS, SHORT_KEEP_TOKENS } = require("./utilities/constants");
const { defineTrack, LEARNING_TRACKS } = require("./utilities/learningTracks_defining");
const { MAJOR_FAMILIES } = require("./utilities/majorFamilies");
const { track, PROGRAM_RULES } = require("./utilities/programRules");
const {
  normalizeText,
  tokenize,
  titleCase,
  unique,
  buildHeuristicAliases,
  inferTracksForProgram,
  buildProgramRecord,
  readPrograms,
} = require("./utilities/utils");
/*
  Central configuration for learning pathway taxonomy, including major families, learning tracks, and utility functions
  For processing program data and inferring track associations
*/
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
