const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin and my frontend port = 3001
        methods: ["GET", "POST"], // Allow these HTTP methods
    },
});

io.on("connection", (socket) => {
    console.log("User connected ", socket.id); // Log the socket ID of the connected user

    socket.on("join_room", (data) => {
        const {room} = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room
    });

    // Listen for "send_message" events from the connected client
    socket.on("send_message", (data) => {
        // Emit the received message data to all connected clients
        const {chatInput, room} = data;
        socket.to(room).emit("receive_message", chatInput);
    });
});

module.exports = server;
