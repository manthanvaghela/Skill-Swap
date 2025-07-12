import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

import { config } from "dotenv"
config()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })

        // file is uploaded 
        console.log("Cloudinary Response :  ", response)
        
        // now unlink the file from local
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log("CloudinaryError :", error)

        fs.unlinkSync(localFilePath) // removes the locally saved temp file as the upload operation got failed
    }
}


export { uploadOnCloudinary }