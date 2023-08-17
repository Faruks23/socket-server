const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001; // Use the provided PORT environment variable or default to 5001

// Allow requests from any origin
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const onlineUsers = {}; // To store online status for each user

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userConnect", ({ userId }) => {
    console.log("User connected:", userId);
    onlineUsers[userId] = true;
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("userDisconnect", ({ userId }) => {
    console.log("User disconnected:", userId);
    onlineUsers[userId] = false;
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Handle cleanup and updating online status if needed
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
