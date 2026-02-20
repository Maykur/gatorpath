const mongoose = require('mongoose');

// Schema still in place for classes individually
const CourseSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
);

// Schema still in place for majors listing
const majorClassSchema = new mongoose.Schema(
    {
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
    }
);

module.exports = mongoose.model("MajorClass", majorClassSchema, "classes");
