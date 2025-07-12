import express from 'express'
import bcrypt from 'bcryptjs'
import { asyncHandler } from '../utils/asyncHandler.util.js'
import User from '../models/User.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// Generate Access and Refresh Tokens
const generateAccessRefreshToken = async (userId) => {
  const user = await User.findById(userId)

  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()

  user.accessToken = accessToken
  user.refreshToken = refreshToken

  await user.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }
}

// Enhanced Signup
const userSignup = asyncHandler(async (req, res) => {
  console.log("req.body in userSignup :", req.body)

  const { email, username, fullName, password , location} = req.body

  if (!email || !username || !fullName || !password) {
    throw new ApiError(400, 'All fields are required')
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long')
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] })
  if (existingUser) {
    throw new ApiError(400, 'User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    email,
    username,
    fullName,
    password: hashedPassword,
    location,
    isVerified: true // no email verification, mark as verified
  })

  const createdUser = await User.findById(newUser._id).select('-password -refreshToken')
  return res.status(201).json(new ApiResponse(201, createdUser, 'User created successfully'))
})

// Enhanced Login
const userLogin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  if (!(email || username) || !password) {
    console.log('Email or username and password are required')
    throw new ApiError(400, 'Email or username and password are required')
  }

  const user = await User.findOne({ $or: [{ email }, { username }] })
  if (!user) {
    console.log('Invalid credentials')
    throw new ApiError(400, 'Invalid credentials')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    console.log('Wrong password')
    throw new ApiError(400, 'Wrong password')
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, 'Login successful'))
})

const checkAuth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.user
      )
    )
})

export {
  userSignup,
  userLogin,
  checkAuth
}