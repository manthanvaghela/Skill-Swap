import { asyncHandler } from "../utils/asyncHandler.util.js";
import UserModel from "../models/User.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const getUserChats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const chats = await Chat.aggregate([
        { $match: { users: userId } },

        // Populate userDetails
        {
            $lookup: {
                from: "users",
                let: { userIds: "$users", currentUserId: userId, isGroup: "$isGroupChat" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$userIds"] },
                                    {
                                        $cond: {
                                            if: "$$isGroup",
                                            then: true,
                                            else: { $ne: ["$_id", "$$currentUserId"] }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    { $project: { password: 0, refreshToken: 0 } }
                ],
                as: "userDetails"
            }
        },

        // Populate latestMessage
        {
            $lookup: {
                from: "messages",
                localField: "latestMessage",
                foreignField: "_id",
                as: "latestMessage"
            }
        },
        { $unwind: { path: "$latestMessage", preserveNullAndEmptyArrays: true } },

        // Populate sender of latestMessage
        {
            $lookup: {
                from: "users",
                localField: "latestMessage.senderId",
                foreignField: "_id",
                as: "latestMessage.sender"
            }
        },
        { $unwind: { path: "$latestMessage.sender", preserveNullAndEmptyArrays: true } },

        // Final projection
        {
            $project: {
                chatName: 1,
                isGroupChat: 1,
                userDetails: 1,
                latestMessage: {
                    _id: "$latestMessage._id",
                    text: "$latestMessage.text",
                    image: "$latestMessage.image",
                    createdAt: "$latestMessage.createdAt",
                    readBy: "$latestMessage.readBy",
                    sender: {
                        _id: "$latestMessage.sender._id",
                        fullName: "$latestMessage.sender.fullName",
                        profilePic: "$latestMessage.sender.profilePic"
                    }
                }
            }
        },

        { $sort: { updatedAt: -1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, chats, "Chats fetched successfully"));
});

const searchUsers = asyncHandler(async (req, res) => {
    const query = req.query.query || "";
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    if (!query.trim()) {
        return res
            .status(400)
            .json(new ApiResponse(400, [], "Search query is required"));
    }

    const chats = await Chat.aggregate([
        {
            $match: {
                isGroupChat: false,
                users: currentUserId
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userIds: "$users", currentUserId: currentUserId },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$userIds"] },
                                    { $ne: ["$_id", "$$currentUserId"] },
                                    {
                                        $or: [
                                            {
                                                $regexMatch: {
                                                    input: "$fullName",
                                                    regex: query,
                                                    options: "i"
                                                }
                                            },
                                            {
                                                $regexMatch: {
                                                    input: "$email",
                                                    regex: query,
                                                    options: "i"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            refreshToken: 0
                        }
                    }
                ],
                as: "userDetails"
            }

        },
        {
            $match: {
                userDetails: { $ne: [] }
            }
        },
        // Lookup groupAdmin info
        {
            $lookup: {
                from: "users",
                localField: "groupAdmin",
                foreignField: "_id",
                as: "groupAdmin"
            }
        },
        {
            $unwind: {
                path: "$groupAdmin",
                preserveNullAndEmptyArrays: true
            }
        },
        // Lookup latestMessage
        {
            $lookup: {
                from: "messages",
                localField: "latestMessage",
                foreignField: "_id",
                as: "latestMessage"
            }
        },
        {
            $unwind: {
                path: "$latestMessage",
                preserveNullAndEmptyArrays: true
            }
        },
        // Lookup sender of latestMessage
        {
            $lookup: {
                from: "users",
                localField: "latestMessage.senderId",
                foreignField: "_id",
                as: "latestMessage.sender"
            }
        },
        {
            $unwind: {
                path: "$latestMessage.sender",
                preserveNullAndEmptyArrays: true
            }
        },
        // Final projection
        {
            $project: {
                _id: 1,
                chatName: 1,
                isGroupChat: 1,
                userDetails: 1,
                groupAdmin: {
                    _id: "$groupAdmin._id",
                    fullName: "$groupAdmin.fullName",
                    profilePic: "$groupAdmin.profilePic"
                },
                latestMessage: {
                    _id: "$latestMessage._id",
                    text: "$latestMessage.text",
                    image: "$latestMessage.image",
                    createdAt: "$latestMessage.createdAt",
                    readBy: "$latestMessage.readBy",
                    sender: {
                        _id: "$latestMessage.sender._id",
                        fullName: "$latestMessage.sender.fullName",
                        profilePic: "$latestMessage.sender.profilePic"
                    }
                }
            }
        },
        {
            $sort: { updatedAt: -1 }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, chats, "Search results formatted")
    );
});

const getMessagesForChat = asyncHandler(async (req, res) => {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const Messages = await Message.aggregate([
        {
            $match: { chat: chatId }
        },
        {
            $sort: { createdAt: -1 } // Newest first 
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },

        // Populate senderId
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $unwind: "$sender"
        },

        // Final projection (no chat data)
        {
            $project: {
                _id: 1,
                text: 1,
                image: 1,
                createdAt: 1,
                readBy: 1,
                sender: {
                    _id: "$sender._id",
                    fullName: "$sender.fullName",
                    profilePic: "$sender.profilePic"
                }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, Messages));
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId
    const userId = req.user._id
    if (!ObjectId.isValid(chatId)) {
        throw new ApiError(200, "ChatId Invalid")
    }

    const objectChatId = new mongoose.Types.ObjectId(chatId)

    const result = await Message.updateMany(
        {
            chat: objectChatId,
            $read: { $ne: userId }
        },
        {
            $addToSet: { readBy: userId }
        },

    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                modifiedCount = result.modifiedCount,
                "Marked Messages as Read "
            )
        )
});


const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const providedId = req.params.chatId; // Could be a Chat ID or a User ID
    const userId = req.user._id;

    let chat;
    let recipientId;

    if (mongoose.Types.ObjectId.isValid(providedId)) {
        // STEP 1: Try treating it as a Chat ID first
        chat = await Chat.findOne({ _id: providedId });

        if (!chat) {
            // STEP 2: If not a Chat, treat as recipient's User ID (for 1-on-1)
            recipientId = new mongoose.Types.ObjectId(providedId);

            if (String(recipientId) === String(userId)) {
                return res.status(400).json(new ApiResponse(400, null, "Cannot create chat with yourself"));
            }

            const receiverUser = await UserModel.findById(recipientId).select("fullName");
            if (!receiverUser) {
                return res.status(404).json(new ApiResponse(404, null, "User not found"));
            }

            // STEP 3: Look for existing 1-on-1 chat
            chat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: [userId, recipientId], $size: 2 },
            });

            // STEP 4: Create if not found
            if (!chat) {
                chat = await Chat.create({
                    isGroupChat: false,
                    users: [userId, recipientId],
                });
            }
        }
    } else {
        return res.status(400).json(new ApiResponse(400, null, "Invalid ID"));
    }

    const chatId = chat._id;
    
    let imageUrl;
    if (
        req.files &&
        Array.isArray(req.files.image) &&
        req.files.image.length > 0
    ) {
        const imagePath = req.files.image[0].path
        console.log("imagePath :", imagePath)
        
        
        try {
            const cloudinaryResult = await uploadOnCloudinary(imagePath);
            // console.log("cloudinaryResult :", cloudinaryResult)
            
            if (cloudinaryResult?.url) {
                imageUrl = cloudinaryResult.url;
            } else {
                throw new ApiError(500, "Cloudinary upload failed");
            }
        } catch (error) {
            console.log("error in sendMessage image upload :", error)
            throw new ApiError(500, "image upload failed ");
        }
    }
    
    const newMessage = new Message({
        senderId: userId,
        chat: chatId,
        text,
        image: imageUrl || "",
        readBy: [userId]
    });

    // console.log("newMessage in backend :", newMessage)
    
    await newMessage.save();
    
    // Update latest message in chat
    chat.latestMessage = newMessage._id;
    await chat.save();
    
    // Populate full message
    const result = await Message.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(newMessage._id) }
        },
        
        // Populate senderId
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $unwind: "$sender"
        },
        
        // Final projection: match getMessagesForChat structure
        {
            $project: {
                _id: 1,
                text: 1,
                image: 1,
                createdAt: 1,
                readBy: 1,
                sender: {
                    _id: "$sender._id",
                    fullName: "$sender.fullName",
                    profilePic: "$sender.profilePic"
                }
            }
        }
    ]);
    
    recipientId = ( chat.users[0].toString() === userId.toString() ) ? chat.users[1] : chat.users[0];
    console.log("chat :", chat)
    console.log("userId :", userId)
    console.log("providedId :", providedId)
    console.log("recipientId :", recipientId)
    console.log("chatId :", chatId)
    
    
    // TODO: REAL TIME MESSAGE WITH SOCKET
    const receiverSocketId = getReceiverSocketId(recipientId)
    console.log("receiverSocketId :", receiverSocketId)
    if( receiverSocketId ) {
        io.to( receiverSocketId ).emit("newMessage", result[0])
    }


    console.log("sendMessage.data :", result)

    return res.status(200).json(
        new ApiResponse(200, result[0], "Message sent")
    );
});



export { getUserChats, searchUsers, getMessagesForChat, markMessagesAsRead, sendMessage }