import mongoose, { mongo, Schema } from "mongoose";

const messageSchema = Schema(
    {
        senderId : {
            type : mongoose.Types.ObjectId,
            ref : "User",
            required : true
        },
        chat : {
            type : mongoose.Types.ObjectId,
            ref : "Chat",
            required : true
        },
        text : {
            type : String
        },
        image : {
            type : String
        },
        //optional for "seen" feature
        readBy : [
            {
                type : mongoose.Types.ObjectId,
                ref : "User"
            }
        ]
    },{
        timestamps : true
    }
)


export const Message = mongoose.model("Message", messageSchema)