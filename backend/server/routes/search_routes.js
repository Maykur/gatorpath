const express = require("express");
const mongoose = require("mongoose");

const authenticateToken = require("../middleware/auth");
const SearchSubmission = require("../datasets/SearchSubmission");
const Classes = require("../datasets/Classes");

const router = express.Router();

// Post /searches to create new search submission
router.post("/", authenticateToken, async (req, res) => {
    try {
        // Must match auth payload
        const userID = req.user.userID;

        const {searchName, academic, additional} = req.body;

        // Major validation
        if (!academic?.majorID) {
            return res.status(400).json({message: "Major ID is required"});
        }
        if (!mongoose.Types.ObjectId.isValid(academic.majorID)) {
            return res.status(400).json({message: "Invalid Major ID"});
        }

        // Pull major label so dashboard doesnt rejoin later
        const majorDoc = await Classes.findOne({majorID: academic.majorID});
        if (!majorDoc) {
            return res.status(404).json({message: "Major not found"});
        }

        const created = await SearchSubmission.create({
            userID,
            searchName: (searchName || "").trim(),
            direction: "forward",
            academic: {
                majorID: academic.majorID,
                majorLabel: majorDoc.major,
                minor: (academic.minor || "").trim(),
                certificate: (academic.certificate || "").trim(),
                coursesTaken: Array.isArray(academic.coursesTaken) ? academic.coursesTaken : [],
            },
            additional: {
                expectedGraduationTerm: (additional?.expectedGraduationTerm || "").trim(),
                coursePreferences: (additional?.coursePreferences || "").trim(),
            },
        });
        res.status(201).json(created);
    }
    catch (err) {
        console.error("CREATE SEARCH ERROR", err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;