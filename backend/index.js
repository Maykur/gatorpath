
/* Referenced: https://www.geeksforgeeks.org/reactjs/how-to-connect-mongodb-with-reactjs/
https://www.youtube.com/watch?v=H8Sh9_n1MPA
https://medium.com/@sergio13prez/connecting-to-mongodb-atlas-d1381f184369
https://www.w3schools.com/tags/tag_li.asp
https://cheerio.js.org/
*/

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const axios = require('axios');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken')
const url_minors_and_certs = 'https://catalog.ufl.edu/UGRD/programs/';
const bcrypt = require('bcryptjs');

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
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const ProgSchema = new mongoose.Schema({ // new schema to identify certificates and minors ONLY
    program_name: { // don't need to specify the classes only major or minor
        type: String,
        required: true
    },
    program_type:{
        type: String,
        required: true,
        enum: ["Minor", "Certificate"] // only 2 possibilites 
    }
    },
    {timestamps: true}); // track time and date creation

const CourseSchema = new mongoose.Schema({ // schema still in place for classes individually
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const majorClassSchema = new mongoose.Schema({ // schema still in place for majors listing
  university: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  core_coursework: {
    type: [CourseSchema],
    required: true
  },
  required_foundation: {
    type: [CourseSchema],
    required: true
  },
  elective_areas: {
    type: [String],
    required: true
  }
});

    
const Classes = mongoose.model('Classes', majorClassSchema);
const Program = mongoose.model('Program', ProgSchema); // create the
// Name of db collections (User => Emails | Program => Major SetList)
const User = mongoose.model('UserInfo', UserSchema);

async function scrapeMinorsAndCerts() {
    const {data} = await axios.get(url_minors_and_certs);
    const $ = cheerio.load(data); // get query-able data from html
    const programs = [];

    $('li.item').each((idx, elem) => { // for each element in list . item get title and type
        const name = $(elem).find('.title').text().trim();
        const type = $(elem).find('.type').text().trim().toLowerCase();

        if (type === 'minor' || type === 'certificate') {
            programs.push({ program_name: name, program_type: type.charAt(0).toUpperCase() + type.slice(1)});
        } // make the 1st letter capital so we can use in mongodb

    });
    return programs;

}


// Express setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // React frontend URL
}));

// Sample route to check if the backend is working
app.get("/", (req, resp) => {
    resp.send("App is working");
});

// ---------- USER LOGIN/SIGN-IN PART ---------- 
// API to register a user
app.post("/register", async (req, resp) => {
    const { name, email, password } = req.body;
    const emailPresent = await User.findOne({email: email});
    if (emailPresent){
        return resp.status(400).json({message: "email in use"});
    }
    const hashPass = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashPass
    });
    let result = await user.save();
    resp.status(201).json({message: "All Good!"});
});

// API to grab user information
app.get("/register", async (req, res) => {
    const data = await User.find();
    res.json(data);
});

// API to Login User
app.post("/login", async (req, resp) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return resp.status(400).json({message: "invalid"});
    }
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
        return resp.status(400).json({message: "invalid"});
    }
    const token = jwt.sign(
        {userID: user._id},
        process.env.JWT_Key,
        { expiresIn: "1h"}
    );
    resp.json({
        message: "Login Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
    } catch(err){
        console.error("LOGIN ERROR: ", err);
    }

});

function authenticateToken(req, resp, next){
    const authenticationHead = req.headers.authorization;
    if(!authenticationHead){
        return resp.status(401).json({message: "No Token."});
    }
    const token = authenticationHead.split(" ")[1];
    try{
        const decodeVerif = jwt.verify(token, process.env.JWT_Key);
        req.user = decodeVerif;
        next();
    }catch(err){
        return resp.status(401).json({message: "Invalid Token."});
    }
}

app.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userID);
    res.json(user);
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

app.get("/api/scrape", async (req, res) => {
    try {
        // data in gatorpath database, programs collection
        // has already been scraped and stored in database, ret data!
        const programs = await scrapeMinorsAndCerts();
        await Program.deleteMany({});
        await Program.insertMany(programs);
        res.json(programs);

    } catch (error) {
        res.status(500).json({ error: "Failed to scrape data" });

    }
});

// Start the server
app.listen(5000, () => {
    console.log("App is running on port 5000");
});