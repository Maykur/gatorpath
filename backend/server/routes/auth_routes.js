const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../datasets/UserInfo');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const {name, email, password, major, year} = req.body;

    const emailPresent = await User.findOne({email: email});
    if (emailPresent) {
        return res.status(400).json({message: 'Email already in use'});
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashPass, major, year});

    const token = jwt.sign({userID: user._id}, process.env.JWT_Key, {expiresIn: '1h'});

    res.status(201).json({
        message: "Registration successful",
        token,
        user: {id: user._id, name: user.name, email: user.email, major: user.major, year: user.year}
    });
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign({userID: user._id}, process.env.JWT_Key, {expiresIn: '1h'});

        res.json({
            message: "Login successful",
            token,
            user: {id: user._id, name: user.name, email: user.email}
        });
    }
    catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({message: 'Server error'});
    }
});

// Profile route (protected)
router.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userID).select("-password");
    res.json(user);
});

module.exports = router;
