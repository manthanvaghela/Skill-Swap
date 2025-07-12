// models/User.js
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'


const skillSchema = new mongoose.Schema({
    skillName: {
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
    fullName: {
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
    location :{
        type: String,
        required: false
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

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY
        }
    )
}

export default mongoose.model('User', userSchema)
