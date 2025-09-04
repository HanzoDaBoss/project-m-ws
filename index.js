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
        origin: "http://localhost:5173", // Allow requests from this origin and my frontend port = 5173
        methods: ["GET", "POST"], // Allow these HTTP methods
    },
});

io.on("connection", (socket) => {
    console.log("User connected ", socket.id); // Log the socket ID of the connected user

    // Listen for "send_message" events from the connected client
    socket.on("send_message", (data) => {
        // Emit the received message data to all connected clients
        io.emit("receive_message", data);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});
