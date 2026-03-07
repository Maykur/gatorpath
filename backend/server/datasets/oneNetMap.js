const majorToOnet = {
  "Computer Science": [
    "15-1252.00", // Swe dev
    "15-1253.00", // qa eng
    "15-2051.00"  // data sci
  ],

  "Computer Engineering": [
    // pc hardware eng
    "15-1252.00", // softawre dev
    "17-2061.00"  // computer hardware eng
  ],

  "Digital Arts and Sciences": [
    "15-1252.00", //software dev
    "15-1254.00", //web dev
    "15-1255.01", //game dev"
    "17-2141.00", // mechanical eng
  ]
};


// options for different majors then add the certs and minors for query stuff more options 
const majorJobClusters = {
  "Computer Science": [
    "software engineer",
    "data scientist",
    "cybersecurity analyst",
    "cloud engineer",
    "machine learning engineer",
    "it specialist",
    "database administrator",
    "network administrator",
    "devops engineer",
    "qa engineer",
  ],

  "Computer Engineering": [
    "software engineer",
    "embedded systems engineer",
    "hardware engineer",
    "robotics engineer",
    "firmware engineer",
    "network engineer",
    "systems engineer",
    "cybersecurity analyst",
  ],
  "Digital Arts and Sciences": [
    "UX designer",
    "UI designer",
    "graphic designer",
    "multimedia artist",
    "game designer",
    "3d modeler",
    "animator",
    "artist"]
};

module.exports = majorToOnet;