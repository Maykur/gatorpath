const express = require("express");
const Classes = require("../datasets/Classes");

const router = express.Router();

// Routes for the search page -> Grabs all the majors and universities in the database to be filtered through on the frontend
router.get("/", async (req, res) => {
    const data = await Classes.find({}, {major: 1, university: 1});
    res.json(data);
});

// Route for the major page -> Grabs the specific major's info (classes, etc.) by the major's id
router.get("/:id", async (req, res) => {
    const program = await Classes.findById(req.params.id);
    res.json(program);
});

module.exports = router;
