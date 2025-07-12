import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { asyncHandler } from '../utils/asyncHandler.util.js'
import { ApiError } from '../utils/ApiError.js'

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token

  // Check Authorization header (Bearer token) or cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded?.id) {
      throw new ApiError(403, 'Unauthorized: Invalid token')
    }

    const user = await User.findById(decoded.id).select('-password -refreshToken')
    if (!user) {
      throw new ApiError(401, 'Unauthorized: User not found')
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError'
    throw new ApiError(403, isExpired ? 'Token expired' : 'Invalid token')
  }
})
