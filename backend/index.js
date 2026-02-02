
// Referenced: https://www.geeksforgeeks.org/reactjs/how-to-connect-mongodb-with-reactjs/

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

const app = express();

// MongoDB connection
mongoose.connect(process.env.mongo_url).then(() => {
    console.log('Connected to mongo database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

// Schema for users of the app
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Schema for classes
const ClassSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

// Schema for program reqs
const ProgSchema = new mongoose.Schema({
    university: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    core_coursework: {
        type: [ClassSchema],
        required: true
    },
    required_foundation: {
        type: [ClassSchema],
        required: true
    },
    elective_areas: {
        type: [String],
        required: true
    }
});

// Name of db collections (User => Emails | Classes => Major SetList)
const User = mongoose.model('a', UserSchema);
const Classes = mongoose.model('classes', ProgSchema);

// Express setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // React frontend URL
}));

// Sample route to check if the backend is working
app.get("/", (req, resp) => {
    resp.send("App is working");
});

// ---------- USER LOGIN PART ---------- 
// API to register a user
app.post("/register", async (req, resp) => {
    const { name, email } = req.body;
    const emailPresent = await User.findOne({email: email});
    if (emailPresent){
        return resp.status(400).json({message: "email in use"});
    }
    const user = new User({ name, email });
    let result = await user.save();
    if (result.password){
        delete result.password;
    }
    resp.status(201).send(result);
});

// API to grab user information
app.get("/register", async (req, res) => {
    const data = await User.find();
    res.json(data);
});

// ---------- CLASS INFO PART ----------
// API to register a class (TEMP)
app.post("/data", async (req, resp) => {
    try {
        const classInfo = new Classes(req.body);
        let result = await classInfo.save();
        if (result) {
            delete result.password;
            resp.status(201).send(result);
        } else {
            console.log("Class already registered");
            resp.status(400).send("Class already registered");
        }
    } catch (e) {
        resp.status(500).send({ message: "Something went wrong", error: e.message });
    }
});

// API to grab list of majors
app.get("/data", async (req, res) => {
    const data = await Classes.find();
    res.json(data);
});

// API to specific major's classes by major's id
app.get("/data/major/:id", async (req, res) => {
    const program = await Classes.findById(req.params.id);
    res.json(program);
});

// Start the server
app.listen(5000, () => {
    console.log("App is running on port 5000");
});