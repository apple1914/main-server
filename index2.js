const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message_sent_from_client", (message) => {
    console.log("Received message:", message);
    io.emit("message_send_to_clients", message);
  });
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(cors());

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
