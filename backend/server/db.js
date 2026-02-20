const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        if (!process.env.mongo_url) {
            console.error("mongo_url missing. Check backend/.env");
            process.exit(1);
        }
        // MongoDB connection
        await mongoose.connect(process.env.mongo_url);
        console.log('Connected to mongo database');
    }
    // Exit Process if there is an error connecting to db
    catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;
