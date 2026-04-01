// Referenced: https://www.youtube.com/watch?v=_M4gZfIFGZw (Cloudinary Setup)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../datasets/UserInfo');
const multer = require('multer');
//const cloudinary = require('cloudinary').v2;
const upload = multer({ storage: multer.memoryStorage() });
//const {CloudinaryStorage} = require('multer-storage-cloudinary');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/*
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'profile_avatars', allowed_formats: ['jpg', 'png'] },
});

const upload = multer({ storage });
*/

// Helper to parse array fields from FormData (comes as comma-separated string or array)
function parseArrayField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(v => v.trim());
  return val.split(',').map(v => v.trim()).filter(Boolean);
}

// Register route
router.post('/register', (req, res, next) => {
  upload.single("profileIcon")(req, res, (err) => {
    if (err) {
      console.log("MULTER/UPLOAD ERROR:", err.message, err.code, JSON.stringify(err));
      return res.status(500).json({ message: err.message || "Upload failed" });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { name, email, password, major, year } = req.body;
    const minor = parseArrayField(req.body.minor);
    const certificate = parseArrayField(req.body.certificate);

    const emailPresent = await User.findOne({ email });
    if (emailPresent) return res.status(400).json({ message: 'Email already in use' });

    //const profileIcon = req.file.path;
    const profileIcon = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPass, major, minor, certificate, year, profileIcon });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_Key, { expiresIn: '1h' });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, major: user.major, minor: user.minor, certificate: user.certificate, year: user.year, profileIcon }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message, err.stack);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const matchPass = await bcrypt.compare(password, user.password);
          if (!matchPass) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_Key, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, major: user.major, minor: user.minor || [], certificate: user.certificate || [], year: user.year, profileIcon: user.profileIcon }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get profile route (protected)
router.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
});

// Update profile route (protected)
router.put("/profile", authenticateToken, upload.single("profileIcon"), async (req, res) => {
    try {
        const { name, email, major, year, password } = req.body;
        const minor = parseArrayField(req.body.minor);
        const certificate = parseArrayField(req.body.certificate);

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (major) user.major = major;
        if (year) user.year = year;
        if (password) user.password = await bcrypt.hash(password, 10);
        // if (req.file) user.profileIcon = req.file.path;
        if (req.file) user.profileIcon = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        user.minor = minor;
        user.certificate = certificate;

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_Key, { expiresIn: '1h' });

        res.json({
            message: "Profile updated successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, major: user.major, minor: user.minor, certificate: user.certificate, year: user.year, profileIcon: user.profileIcon }
        });
    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err.message, err.stack);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;