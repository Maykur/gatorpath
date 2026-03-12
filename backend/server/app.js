require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth_routes");
const majorsRoutes = require("./routes/majors_routes");
const programsRoutes = require("./routes/programs_routes");
const scrapeRoutes = require("./routes/scrape_routes");
const searchRoutes = require("./routes/search_routes");
const dashboardRoutes = require("./routes/dashboard_routes");
const jobResults = require("./routes/jobListings");

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:3000"}));
app.use(express.json());


app.get("/", (req, res) => res.send("App is working"));

app.use((err, req, res, next) => {
  console.error("EXPRESS ERROR:", err);
  res.status(500).json({ message: err.message });
});

// /register /login /profile
app.use("/", authRoutes);
// /majors endpoints
app.use("/majors", majorsRoutes);
// /programs endpoints
app.use("/programs", programsRoutes);
// /scrape endpoint
app.use("/scrape", scrapeRoutes);
// /searches endpoints
app.use("/searches", searchRoutes);
// /dashboard endpoints
app.use("/dashboard", dashboardRoutes);
// /joblisting endpoint
app.use("/jobListings", jobResults)

module.exports = app;
