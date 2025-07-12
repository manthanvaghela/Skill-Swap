
import dotenv from "dotenv";
import connectDB from './lib/db.js';
import { server } from "./lib/socket.js";
dotenv.config({
    path : './.env'
})


connectDB()
.then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB Connection failed ", err)
})

