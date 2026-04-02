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
console.log("Looking up program:", progName);
console.log("Available keys:", Object.keys(progKeyOverrides));

console.log("Looking up program:", progName);
const match = Object.keys(progKeyOverrides)
  .find(keyInput => keyInput.toLowerCase() === key);

if (match) {
  return progKeyOverrides[match];
}

  // otherwise auto extract
  return extractKeywords(progName);
}

module.exports = { getProgWords }; // return out function
