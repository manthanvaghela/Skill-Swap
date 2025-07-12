import express from "express"
import { userLogin, userSignup } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.route("/signup").post(userSignup)

authRouter.route("/login").post(userLogin)

export default authRouter