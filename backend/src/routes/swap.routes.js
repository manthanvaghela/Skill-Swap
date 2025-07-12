import express from 'express'
import { authMiddleware } from '../middlewares/auth.middlewares.js'
import { createSwap, deleteSwap, getSwapsForUser, updateSwapStatus } from '../controllers/swap.controller.js'

const swapRouter = express.Router()

swapRouter.post('/', authMiddleware, createSwap)
swapRouter.get('/', authMiddleware, getSwapsForUser)
swapRouter.put('/:id', authMiddleware, updateSwapStatus)
swapRouter.put('/:id', authMiddleware, deleteSwap)

export default swapRouter
