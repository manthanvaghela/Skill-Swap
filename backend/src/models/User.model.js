// models/User.js
import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 3
    }
}, { _id: false }) // disable _id on subdocs if not needed

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    skillsOffered: {
        type: [skillSchema],
        default: []
    },
    skillsWanted: {
        type: [skillSchema],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
