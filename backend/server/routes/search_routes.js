const express = require("express");
const mongoose = require("mongoose");

const authenticateToken = require("../middleware/auth");
const SearchSubmission = require("../datasets/SearchSubmission");
const Classes = require("../datasets/Classes");

const router = express.Router();

// Post /searches to create new search submission
router.post("/", authenticateToken, async (req, res) => {
    console.log("REQ HEADERS content-type:", req.headers["content-type"]);
    console.log("REQ BODY:", req.body);
    try {
        // Must match auth payload
        const userId = req.user.userID;

        const {searchName, academic, additional} = req.body;

        // Major validation
        if (!academic?.majorId) {
            return res.status(400).json({message: "Major ID is required"});
        }
        if (!mongoose.Types.ObjectId.isValid(academic.majorId)) {
            return res.status(400).json({message: "Invalid Major ID"});
        }

        // Pull major label so dashboard doesnt rejoin later
        const majorDoc = await Classes.findById(academic.majorId, {major: 1});
        if (!majorDoc) {
            return res.status(404).json({message: "Major not found"});
        }

        const created = await SearchSubmission.create({
            userId,
            searchName: (searchName || "").trim(),
            direction: "forward",
            academic: {
                majorId: academic.majorId,
                majorLabel: majorDoc.major,
                minor: (academic.minor || "").trim(),
                certificate: (academic.certificate || "").trim(),
                coursesTaken: Array.isArray(academic.coursesTaken) ? academic.coursesTaken : [],
            },
            additional: {
                expectedGraduationDate: (additional?.expectedGraduationDate || "").trim(),
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