import express, { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middleware.js";
import { getUserChats, getMessagesForChat, markMessagesAsRead, searchUsers, sendMessage } from "../controllers/users.controller.js"

const userRouter = Router()


userRouter.route("/").get(authMiddleware, getUserChats)

// GET /api/users/:chatId?page=1&limit=20
userRouter.route("/:chatId").post(authMiddleware, getMessagesForChat)

// PUT /api/users/664ef9dd79f40c2b9b355f3e/read
userRouter.route("/:chatId/read").post(authMiddleware, markMessagesAsRead)

userRouter.route("/:chatId/send").post(authMiddleware,
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]), sendMessage
)

// GET /api/users/search?query=...
userRouter.get("/search", authMiddleware, searchUsers);

export { userRouter }