// keyword overrides for special programs
/* srcs:https://stackoverflow.com/questions/33430914/extract-keywords-from-string-javascript
https://www.w3schools.com/jsref/jsref_replace.asp

*/
const progKeyOverrides = {
  "Digital Arts and Sciences": [
    "game developer",
    "graphics programmer",
    "3d artist",
    "animation engineer"
  ],
    "Statistics": [
    "data science",
    "machine learning",
    "data analytics"
  ],

  "Graphic Design": [
    "ui designer",
    "ux designer",
    "product designer"
  ],

  "Biology": [
    "bioinformatics",
    "computational biology",
    "biotech"
  ],

  "Computer Science (CSE) - College of Engineering": [
  "software engineer",
  "software developer",
  "data scientist",
  "machine learning engineer",
  "systems engineer"
],

"Computer Science (CSC) - College of Liberal Arts & Sciences": [
  "software engineer",
  "software developer",
  "data analsis",
  "web developer",
  "it consultant"
],

"Artificial Intelligence Fundamentals and Applications": [
  "ai engineer",
  "machine learning engineer",
  "data scientist",
  "data engineer"
],

"Data Analytics": [
  "data analyst",
  "data scientist",
  "data engineer"
]

};


// automatic keyword extraction
function extractKeywords(progName) {
  if (!progName) return [];

  return progName
    .toLowerCase()
    .replace(/and/g, "")
    .replace(/&/g, "")
    .split(" ")
    .map(word => word.trim())
    .filter(word => word.length > 3);
}


// main function used by the routes
function getProgWords(progName) {

  if (!progName) return []; // empty array bc we need prog for it

// check to see if we need to convert from upper to lowercase
const key = progName.toLowerCase().trim();

const match = Object.keys(progKeyOverrides)
  .find(keyInput => keyInput.toLowerCase() === key);

if (match) {
  return progKeyOverrides[match];
}

  // otherwise auto extract
  return extractKeywords(progName);
}

module.exports = { getProgWords }; // return out function
