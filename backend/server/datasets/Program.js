const mongoose = require('mongoose');

// Schema to identify certificates and minors ONLY
const ProgSchema = new mongoose.Schema(
    {
        // Don't need to specify the classes only major or minor
        program_name: {
            type: String,
            required: true
        },

        program_type:{
            type: String,
            required: true,
            // Only 2 possibilites
            enum: ["Minor", "Certificate"] 
        },
    },
    // Track time and date creation
    {timestamps: true}
);

module.exports = mongoose.model("Program", ProgSchema);
