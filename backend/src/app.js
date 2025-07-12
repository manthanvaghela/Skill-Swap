
import express from "express";
import authRouter from "./routes/auth.Routes.js";
import cors from "cors"
import cookieParser from "cookie-parser";
// import { userRouter } from "./routes/users.route.js";
import { ApiError } from "./utils/ApiError.js";
import swapRouter from "./routes/swap.routes.js";
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(cookieParser())

app.use(express.json()) // now we can take json data
app.use(express.urlencoded({extended : true})) // to input data from url
app.use(express.static("public")) // to stor assets in public like img

// app.get("/",() => {
//     console.log("API is running")
// })

app.use("/api/auth", authRouter)
app.use("/api/swap", swapRouter)

// Catch-all 404 handler (use your ApiError)
app.use((req, res, next) => {
    next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
});


// ✅ Global error handler (must be last)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: err.data || null,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

export { app }