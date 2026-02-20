const express = require("express");
const Program = require("../datasets/Program");
const {scrapeMinorsAndCerts} = require("../crawler/scraper");

const router = express.Router();

// Route to trigger the scraping of minors and certificates, then store the results in the database
router.get("/scrape", async (req, res) => {
  try {
    const programs = await scrapeMinorsAndCerts();
    await Program.deleteMany({});
    await Program.insertMany(programs);
    res.json(programs);
  }
  catch (error) {
    console.error("SCRAPE ERROR:", error);
    res.status(500).json({error: "Failed to scrape data"});
  }
});

module.exports = router;
