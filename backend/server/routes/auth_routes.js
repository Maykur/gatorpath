// Referenced: https://www.youtube.com/watch?v=_M4gZfIFGZw (Cloudinary Setup)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../datasets/UserInfo');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// ProfileIcon Storage
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_avatars',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

// Register route
router.post('/register', upload.single("profileIcon"), async (req, res) => {
    const {name, email, password, major, year} = req.body;

    const emailPresent = await User.findOne({email: email});
    if (emailPresent) {
        return res.status(400).json({message: 'Email already in use'});
    }

    const profileIcon = req.file.path;
    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashPass, major, year, profileIcon});

    const token = jwt.sign({userId: user._id}, process.env.JWT_Key, {expiresIn: '1h'});

    res.status(201).json({
        message: "Registration successful",
        token,
        user: {id: user._id, name: user.name, email: user.email, major: user.major, year: user.year, profileIcon}
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

        const token = jwt.sign({userId: user._id}, process.env.JWT_Key, {expiresIn: '1h'});

        res.json({
            message: "Login successful",
            token,
            user: {id: user._id, name: user.name, email: user.email, profileIcon: user.profileIcon}
        });
    }
    catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({message: 'Server error'});
    }
});

// Profile route (protected)
router.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
});

module.exports = router;
