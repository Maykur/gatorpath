const {getProgWords} = require("./progWords");
const onetData = require("./datasets/oneNetData.json");
const majorToOnet = require("./datasets/oneNetMap");

// Helper function to simplify major names by removing parenthetical and hyphenated details
function simplifyMajor(major = "") {
  return major ? major.split("(")[0].split("-")[0].trim() : "";
}

// Helper function to ensure uniqueness and filter out falsy values from an array
function unique(arr = []) {
  return [...new Set(arr.filter(Boolean))];
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

// Placeholder function to simulate fetching learning resources from YouTube based on seed terms (Maybe?)
async function fetchLearningResourcesFromYouTube(seedTerms = []) {
  // Placeholder structure for live fetch logic and later this becomes actual YouTube API calls
  return seedTerms.slice(0, 4).map((term) => ({
    title: `${term} tutorial`,
    provider: "YouTube Search",
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term + " tutorial")}`,
  }));
}

// Main function to build learning pathways based on the user's search criteria
async function buildLearningPathways(search) {
  const seedTerms = buildCareerSeeds(search);
  const resources = await fetchLearningResourcesFromYouTube(seedTerms);

  return {resources, languages: [], platforms: [], certifications: [], seedTerms};
}

module.exports = {buildLearningPathways};
