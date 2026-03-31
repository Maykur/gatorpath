const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const SearchSubmission = require("../datasets/SearchSubmission");
const {buildLearningPathways} = require("../learningPathways_service");

// GET latest search for logged-in user, used to populate dashboard on page load
router.get("/latest", authenticateToken, async (req, res) => {
    try {
        const search = await SearchSubmission.findOne({userId: req.user.userId}).sort({createdAt: -1});

        // If no search found, return empty object
        if (!search) {
            return res.status(404).json({message: "No searches found"});
        }
        return res.json({search});
    }
    // If error occurs, log it and return 500
    catch (err) {
        console.error("Error fetching latest dashboard search: ", err);
        return res.status(500).json({message: "Failed to load dashboard."})
    }
});

// GET learning pathways for specific search, used to populate dashboard when clicking on a starred search or loading latest search
router.get("/learning-pathways/:id", authenticateToken, async (req, res) => {
    try {
        // Find the search by ID and ensure it belongs to the logged-in user
        const search = await SearchSubmission.findOne({_id: req.params.id, userId: req.user.userId});

        // If no search found, return error
        if (!search) {
            return res.status(404).json({message: "Search not found"});
        }

        // Build learning pathways based on the search criteria and return the data
        const learningData = await buildLearningPathways(search);
        return res.json(learningData);
    }
    // If error occurs, log it and return 500
    catch (err) {
        console.error("Error fetching learning pathways: ", err);
        return res.status(500).json({message: "Failed to load learning pathways."});
    }
});

// GET specific search for logged-in user, used to populate dashboard when clicking on a starred search
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const search = await SearchSubmission.findOne({_id: req.params.id, userId: req.user.userId});

        // If no search found, return error
        if (!search) {
            return res.status(404).json({message: "Search not found"});
        }
        return res.json({search});
    }
    // If error occurs, log it and return 500
    catch (err) {
        console.error("Error fetching specific dashboard search by id: ", err);
        return res.status(500).json({message: "Failed to load dashboard."})
    }
});

module.exports = router;
