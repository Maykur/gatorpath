const express = require("express");
const mongoose = require("mongoose");

const authenticateToken = require("../middleware/auth");
const SearchSubmission = require("../datasets/SearchSubmission");
const Classes = require("../datasets/Classes");

// 24 hours in milliseconds
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const computeExpiry = () => new Date(Date.now() + TWENTY_FOUR_HOURS_MS);

const router = express.Router();

// Post /searches to create new search submission
router.post("/", authenticateToken, async (req, res) => {
    console.log("REQ HEADERS content-type:", req.headers["content-type"]);
    console.log("REQ BODY:", req.body);
    try {
        // Must match auth payload
        const userId = req.user.userId;

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
                coursePreference: (additional?.coursePreference || "").trim(),
            },
            starred: false,
            expiresAt: computeExpiry(),
        });
        res.status(201).json(created);
    }
    catch (err) {
        console.error("CREATE SEARCH ERROR", err);
        res.status(500).json({message: "Server error"});
    }
});

// Get /searches/saved to get starred searches for the user
router.get("/saved", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const searches = await SearchSubmission.find({userId, starred: true}).sort({updatedAt: -1});
    res.json(searches);
});

// Patch /searches/:id/star to star a search submission
router.patch("/:id/star", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {id} = req.params;

    // Set starred to true and reset expiration
    const updated = await SearchSubmission.findOneAndUpdate(
        {_id: id, userId},
        {$set: {starred: true, expiresAt: null}},
        {new: true}
    );

    // If no search found, return error
    if (!updated) {
        return res.status(404).json({message: "Search not found"});
    }
    res.json(updated);
});

// Patch /searches/:id/unstar to unstar a search submission
router.patch("/:id/unstar", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {id} = req.params;

    // Set starred to false and set expiration to 24 hours from now
    const updated = await SearchSubmission.findOneAndUpdate(
        {_id: id, userId},
        {$set: {starred: false, expiresAt: computeExpiry()}},
        {new: true}
    );

    // If no search found, return error
    if (!updated) {
        return res.status(404).json({message: "Search not found"});
    }
    res.json(updated);
});

// Get /searches/latest to get the latest search submission for the user
router.get("/latest", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    // Find the most recent search submission for the user, regardless of it being starred or not
    const latest = await SearchSubmission.findOne({userId}).sort({createdAt: -1});
    res.json(latest);
});

module.exports = router;
