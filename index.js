const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message_send", (message) => {
    console.log("Received message:", message);
    io.emit("message_received", message);
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
