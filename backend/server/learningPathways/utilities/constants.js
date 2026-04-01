// Constants for text processing in learning pathway taxonomy
const STOPWORDS = new Set([
  "and", "the", "of", "in", "for", "to", "with", "or", "a", "an", "on",
  "studies", "study", "science", "sciences", "arts", "applications",
  "fundamentals", "management", "technology", "technologies"
]);

const ACRONYM_STOPWORDS = new Set([
  "and", "the", "of", "in", "for", "to", "with", "or", "a", "an", "on"
]);

const SHORT_KEEP_TOKENS = new Set([
    "ai", "ml", "ui", "ux", "vr", "ar"
]);

module.exports = {
  STOPWORDS,
  ACRONYM_STOPWORDS,
  SHORT_KEEP_TOKENS,
};