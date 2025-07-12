
import { Server } from "socket.io";
import http from "http";
import { app } from "../app.js";
import { deepEqual } from "assert";

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    },
})

// to store online userss
const useSocketMap = {}; // {userId : socketId}

io.on('connection', (socket) => {
    console.log("Connected to Socket :", socket.id)

    const userId = socket.handshake.query.userId

    if (userId) useSocketMap[userId] = socket.id

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(useSocketMap))
    console.log(useSocketMap)

    // Example: Listen for 'someEvent' from the client
    socket.on('someEvent', (data) => {
        console.log('Received data from client:', data);
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from Socket :", socket.id)
        delete useSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(useSocketMap))
        console.log(useSocketMap)

        setTimeout(() => {
            // Check if the user has reconnected with a new socket
            const stillDisconnected = !Object.keys(useSocketMap).includes(userId);
            if (stillDisconnected && userId) {
                delete useSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(useSocketMap));
                console.log("User removed after delay:", userId);
            }
        }, process.env.PORT || 5000); // 3 seconds delay
    })
})


const getReceiverSocketId = (userId) => {
    return useSocketMap[userId]
}


export { io, app, server  , getReceiverSocketId }