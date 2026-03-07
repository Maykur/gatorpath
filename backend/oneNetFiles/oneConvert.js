/*srcs:
https://nodejs.org/api/stream.html#readable-streams
*/ 


const fs = require("fs");
const csv = require("csv-parser");

const results = [];

fs.createReadStream("./Occupation Data.txt")
  .pipe(csv({ separator: "\t" })) // important: tab separator
  .on("data", (row) => {

    res.push({
      soc: row["O*NET-SOC Code"],
      title: row["Title"],
      description: row["Description"]
    });

  })
  .on("end", () => {

    fs.writeFileSync(
      "../server/datasets/oneNetData.json",
      JSON.stringify(res, null, 2)
    );

    console.log("file created successfully O* NET JSON data, in datasets/onenetData.json");
  });