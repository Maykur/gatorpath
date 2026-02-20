const axios = require("axios");
const cheerio = require("cheerio");

const url_minors_and_certs = "https://catalog.ufl.edu/UGRD/programs/";

// Scrapes the UF course catalog for minors and certificates, then returns an array of objects with the program name and type (minor or certificate)
async function scrapeMinorsAndCerts() {
  const {data} = await axios.get(url_minors_and_certs);
  const $ = cheerio.load(data);
  const programs = [];

  $("li.item").each((idx, elem) => {
    const name = $(elem).find(".title").text().trim();
    const type = $(elem).find(".type").text().trim().toLowerCase();

    if (type === "minor" || type === "certificate") {
      programs.push({
        program_name: name,
        program_type: type.charAt(0).toUpperCase() + type.slice(1),
      });
    }
  });

  return programs;
}

module.exports = {scrapeMinorsAndCerts};
