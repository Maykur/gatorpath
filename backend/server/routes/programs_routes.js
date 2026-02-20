const express = require('express');
const Program = require('../datasets/Program');

const router = express.Router();

// GET endpoint to fetch all programs, with optional filtering by program type (minor or certificate)
router.get('/programs', async (req, res) => {
    try {
        // Get the program type from query parameters
        const {type} = req.query;
        // If type is provided, filter by it; otherwise, get all programs
        const query = type ? {program_type: type} : {};
        // Sort programs alphabetically by name
        const programs = await Program.find(query).sort({program_name: 1});
        res.json(programs);
    }
    catch (err) {
        console.error("GET PROGRAMS ERROR: ", err);
        res.status(500).json({message: "Server error fetching programs"});
    }
});

module.exports = router;
