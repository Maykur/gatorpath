const mongoose = require('mongoose');

const SearchSubmissionSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true},

        // Nickname of search submission
        searchName: {
            type: String, default: ''
        },

        // Forward Search: academics -> career
        direction: {
            type: String,
            enum: ["forward"],
            default: "forward"
        },

        // Search Section A
        academic: {
            majorId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },

            // Maybe Label for avoiding re-joins
            majorLabel: {
                type: String,
                required: true
            },

            minor: {
                type: String,
                default: ''
            },

            certificate: {
                type: String,
                default: ''
            },

            coursesTaken: [
                {
                    code: {
                        type: String,
                        required: true
                    },
                    title: {
                        type: String,
                        default: ''
                    },
                },
            ],
        },

        // Search Section B
        additional: {
            // ex: "Fall 2026"
            expectedGraduationTerm: {
                type: String,
                default: ''
            },

            // ex: "Project Oriented"
            coursePreference: {
                type: String,
                default: ''
            },
        },

        // // Past (Starred) Searches
        // starred: {
        //     type: Boolean,
        //     default: false
        // },
    },
    {timestamps: true}
);

SearchSubmissionSchema.index({userId: 1, searchName: 1, updatedAt: -1});

module.exports = mongoose.model('SearchSubmission', SearchSubmissionSchema);
