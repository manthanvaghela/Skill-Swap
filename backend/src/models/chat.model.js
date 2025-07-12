import mongoose, { Schema } from "mongoose";

const chatSchema = Schema(
    {
        isGroupChat : {
            type : Boolean,
            default : false
        },
        chatName : {
            type : String,
            required : function() {  // if group chat then chatName needed
                return this.isGroupChat
            }
        },
        users : [
            {
                type : mongoose.Types.ObjectId,
                ref : "User"
            }
        ],
        groupAdmin : {
            type : mongoose.Types.ObjectId,
            ref : "User",
            required : function() {  // if group chat then chatName needed
                return this.isGroupChat
            }
        },
        latestMessage : {
            type : mongoose.Types.ObjectId,
            ref : "Message"
        }
    },{
        timestamps : true
    }
)

export const Chat = mongoose.model("Chat", chatSchema)