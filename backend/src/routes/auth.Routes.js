import express from "express"
import { checkAuth, userLogin, userSignup } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.route("/register").post(userSignup)

authRouter.route("/login").post(userLogin)

authRouter.route("/checkAuth").post(checkAuth)

export default authRouter