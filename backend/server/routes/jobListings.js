/* srcs:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
https://medium.com/@davidmedina0907/using-split-and-trim-for-data-cleaning-in-javascript-1167ceb1d4d6





*/
// const { getProgWords } = require("../progWords");
const onetData = require("../datasets/oneNetData.json");
const majorToOnet = require("../datasets/oneNetMap");
const express = require("express");
// Descriptions, names, prog types
const progInfo = require("../program_info");
const router = express.Router(); // specific section

// listing info from api

router.get("/", async (req, res) => {
    console.log("JOB ROUTE HIT");
    // const {major, minor, certifications, skills, state} = req.query; // get job listings based on this data
    // const locationFilter = (!state || state === "null") ? "Florida" : state;
    const {major, minor, certificate, courses, state} = req.query;

// if "United States" is selected, remove the location filter
let locationFilter = "";

if (state && state !== "United States" && state !== "null") {
  locationFilter = state;
}
    // const locationFilter = state || "Florida"; 
        
// Simplify major name (remove degree suffix)
const simplifiedMajor = major
  ? major.split("(")[0].split("-")[0].trim()
  : "";
  const onetCodes = majorToOnet[simplifiedMajor] || [];
  const relatedCareers = onetData.filter(job =>
  onetCodes.includes(job.soc)
);
const onetKeywords = relatedCareers.map(c =>
  c.title.toLowerCase()
);

// MongoDB lookup for major minors certs
const [majorProgs, minorProgs, certProgs] = await Promise.all([
    // Get POJOs from mongo based on type, replace with null or major name if not found
    simplifiedMajor ? progInfo.findOne({ program_name: simplifiedMajor, program_type: "Major" }).lean() : simplifiedMajor,
    minor ? progInfo.findOne({ program_name: minor, program_type: "Minor" }).lean() : null,
    certificate ? progInfo.findOne({ program_name: certificate, program_type: "Certificate" }).lean() : null,
  ]); 


// Get just descriptions from mongo POJOs
const majorDescription = majorProgs?.description || "";
const minorDescription = minorProgs?.description || "";
const certDescription = certProgs?.description || "";

// Map majors → job role keywords
// const majorKeywordMap = {
//   "Computer Engineering": "software engineer",
//   "Computer Science": "software engineer",
//   "Data Science": "data scientist",
//   "Cybersecurity": "security engineer"
// };

//const baseKeyword = majorKeywordMap[simplifiedMajor] || simplifiedMajor;
const baseKeyword = simplifiedMajor;

// Remove since ml model is working
const programKeywords = [];
// console.log("Minor received:", minor);
// console.log("Minor keywords:", getProgWords(minor));

// Call Flask ML service for career recommendations
let ML_recs = [];
try {
    // Get ML recs from reccomend end point
    const ML_results = await fetch(`http://localhost:5001/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            major: simplifiedMajor,
            minor: minor || "",
            certificate: certificate || "",
            majorDescription,
            minorDescription,
            certDescription,
            courses: courses ? courses.split(",").map(s => s.trim()) : []
        })
    });

  // ML is rage baiting me so heres some error guarding 
  if (!ML_results.ok) {
    const text = await ML_results.text();
    console.error("ML service returned error:", text);
    throw new Error("ML service failed");
  }
  
    const ML_data = await ML_results.json();
    ML_recs = ML_data.recommendations || [];
    console.log(ML_recs)
} catch (err) {
  // Continue without ML recs if flask isnt working
    console.error("ML service error:", err);
}

// Let ML model do most of the rec
const ML_career_recs = ML_recs.map(r => r.title.toLowerCase());

// Use ML recs, fallback on key words
const searchRoles = ML_career_recs.length > 0 ? ML_career_recs : [
  baseKeyword,          
  ...programKeywords,    
  
  ...onetKeywords
].filter(v => v && v !== "null" && v !== "undefined");

const listing = searchRoles.slice(0, 3).join(" ");

console.log("Adzuna search query:", listing);

    let allEntries = [];
    console.log("Search roles:", searchRoles);
    const uniqueRoles = [...new Set(searchRoles)];
    const comboRoles = uniqueRoles.slice(0, 3).join(" ");
    const whereParameters= locationFilter
  ? `&where=${encodeURIComponent(locationFilter)}`
  : "";
  for (const role of uniqueRoles.slice(0, 6)) {

    for (let page = 1; page <= 1; page++) { // page 3 otherwise too long?
const response = await fetch(
`https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(role)}${whereParameters}`
);

  // const data = await response.json();
  if (!response.ok) {
    const text = await response.text(); // expecting text input instead bc of the files
    console.error("Adzuna API error:", text);
    continue; // skip this request
}

const data = await response.json();
    if (!data.results){
        console.log("Adzuna's API Error:", data);
        return res.status(500).json({error: "Couldn't fetch job listings from Adzuna API"});
    }
  allEntries = allEntries.concat(data.results || []);
}
  }

    // const response = await fetch(`http://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(keywordsListing)}&where=${encodeURIComponent(state || "")}`);
    if (allEntries.length === 0) {
  console.log("Adzuna shows 0 jobs for this combination of keywords and location. Try a different one.");
    }

    console.log("Total jobs collected:", allEntries.length);
    // const data = await response.json();
    const jobTitles = new Map();

const specializationKeywords = programKeywords.map(k => k.toLowerCase());

if (specializationKeywords.length > 0) {

  allEntries = allEntries.filter(job => {
    // const text = (job.title + " " + job.description).toLowerCase();
    const text = ((job.title || "") + " " + (job.description || "")).toLowerCase();

    return specializationKeywords.some(keyword =>
      text.includes(keyword)
    );
  });

  if (allEntries.length > 0) {
    // needed to comment this out because otherwise includes jobs that don't pertain to undergraduates
    const excludeWords = ["fellow", "postdoctoral", "professor"];

  allEntries = allEntries.filter(job =>
  !excludeWords.some(w =>
    job.title.toLowerCase().includes(w)));
  }}
    const mlMatchScores = {};
    ML_recs.forEach(r => {
        mlMatchScores[r.title.toLowerCase()] = r.score;
    });

    allEntries.forEach(jobType => {
        if (!jobType.salary_min || !jobType.salary_max || jobType.salary_min == 0 || jobType.salary_max == 0) {
            jobType.salary_min = null;
            jobType.salary_max = null;
        }

        const salaryAvg = (jobType.salary_min + jobType.salary_max) / 2; 

        if (!jobTitles.has(jobType.title)) { //dupe check
            jobTitles.set(jobType.title, {
            title: jobType.title,
            count: 1,
            minSalary: jobType.salary_min,
            maxSalary: jobType.salary_max,
            description: jobType.description,
            // location : jobType.location.display_name
            location : jobType.location?.display_name || "Unknown"
        });
    }
    else{
        const existingJob = jobTitles.get(jobType.title); // does it exist currently then increase count
        existingJob.count ++;

        existingJob.minSalary = Math.min(existingJob.minSalary, jobType.salary_min);
        existingJob.maxSalary = Math.max(existingJob.maxSalary, jobType.salary_max);}
    }
);

// dropdown or option to select state


const jobArray = Array.from(jobTitles.values()).map(job => ({
    title: job.title,
    salary: job.minSalary != null && job.maxSalary != null ? `$${Math.round((job.minSalary / 1000))}k - $${Math.round((job.maxSalary / 1000))}k` : 'N/A', // average salary
    found: job.count,
    matchScore: mlMatchScores[job.title.toLowerCase()] ?? null
}));

const recommendedCareers = relatedCareers.map(c => c.title);
// Sort by match score descending so best matches appear first
jobArray.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

res.json({
  location: state || "United States",
  recommendedCareers: ML_recs,
  jobs: jobArray,
});
});


module.exports = router;


// In case we want to have a dropdown to select and update the state by having user select
