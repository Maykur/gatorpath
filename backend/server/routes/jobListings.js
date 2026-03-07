/* srcs:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
https://medium.com/@davidmedina0907/using-split-and-trim-for-data-cleaning-in-javascript-1167ceb1d4d6





*/
const { getProgWords } = require("../progWords");
const onetData = require("../datasets/oneNetData.json");
const majorToOnet = require("../datasets/oneNetMap");
const express = require("express");

const router = express.Router(); // specific section

// listing info from api

router.get("/", async (req, res) => {
    console.log("JOB ROUTE HIT");
    // const {major, minor, certifications, skills, state} = req.query; // get job listings based on this data
    // const locationFilter = (!state || state === "null") ? "Florida" : state;
    const {major, minor, certifications, skills, state} = req.query;

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

// Map majors → job role keywords
const majorKeywordMap = {
  "Computer Engineering": "software engineer",
  "Computer Science": "software engineer",
  "Data Science": "data scientist",
  "Cybersecurity": "security engineer"
};

const baseKeyword = majorKeywordMap[simplifiedMajor] || simplifiedMajor;


const programKeywords = [
  ...getProgWords(minor),
  ...getProgWords(certifications)
];

const searchRoles = [
  baseKeyword,          
  ...programKeywords,    
  
  ...onetKeywords
].filter(v => v && v !== "null" && v !== "undefined");

const listing = searchRoles.slice(0, 6).join(" ");

console.log("Adzuna search query:", listing);

    let allEntries = [];
    console.log("Search roles:", searchRoles);
    const uniqueRoles = [...new Set(searchRoles)];
    const comboRoles = uniqueRoles.slice(0, 6).join(" OR ");
    const whereParameters= locationFilter
  ? `&where=${encodeURIComponent(locationFilter)}`
  : "";
    for (let page = 1; page <= 1; page++) { // page 3 otherwise too long?
const response = await fetch(
`https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(comboRoles)}${whereParameters}`
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


    // const response = await fetch(`http://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(keywordsListing)}&where=${encodeURIComponent(state || "")}`);
    if (allEntries.length === 0) {
  console.log("Adzuna shows 0 jobs for this combination of keywords and location. Try a different one.");
    }

    console.log("Total jobs collected:", allEntries.length);
    // const data = await response.json();
    const jobTitles = new Map();





const specializationKeywords = programKeywords.map(k => k.toLowerCase());

if (specializationKeywords.length > 0) {

  const filteredJobs = allEntries.filter(job => {
    const text = (job.title + " " + job.description).toLowerCase();

    return specializationKeywords.some(keyword =>
      text.includes(keyword)
    );
  });

  if (filteredJobs.length > 0) {
    // needed to comment this out because otherwise includes jobs that don't pertain to undergraduates
    const excludeWords = [
  "fellow",
  "postdoctoral",
  "professor",

];

allEntries = allEntries.filter(job =>
  !excludeWords.some(w =>
    job.title.toLowerCase().includes(w)
  )
);
  }
}
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
            location : jobType.location.display_name
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
    found: job.count
}));

const recommendedCareers = relatedCareers.map(c => c.title);

res.json({
  location: state || "United States",
  recommendedCareers,
  jobs: jobArray
});
});


module.exports = router;


// In case we want to have a dropdown to select and update the state by having user select
