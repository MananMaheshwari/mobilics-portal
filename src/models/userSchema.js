import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    photo: {
        type: String
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [2, "Name must be larger than 2 characters"],
        maxLength: [50, "Name must not be larger than 50 characters"],
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is requred"]
    },
    about: {
        type: String
    },
    professionalDetails: {
        type: String,
    },
    skills: [
        {
            name: {
                type: String
            },
        }
    ],
    certifications: [
        {
            skill: {
                type: String
            },
            providedBy: {
                type: String,
                required: [true, "Must mention the organisation that provided the certification"]
            }
        },
    ],
    experiences: [
        {
            duration: {
                type: String
            },
            organisation: {
                type: String
            },
            type: {
                type: String
            },
            role: {
                type: String
            },
            start: {
                type: String
            },
            end: {
                type: String
            },
        },
    ],
    educations: [
        {
            institute: {
                type: String
            },
            start: {
                type: String
            },
            end: {
                type: String
            },
            degree: {
                type: String
            },
            description: {
                type: String
            },
        }
    ],
    connections: [
        {
            type: mongoose.Types.ObjectId
        }
    ]
})


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;