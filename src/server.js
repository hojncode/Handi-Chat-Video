import http from "http";
// import WebSocket from "ws";
import express from "express";
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

//setup ======================================================= //
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//어떠한 url입력해도 /로 보냄.
app.get("*", (req, res) => res.redirect("/"));
// ======================================================= setup//

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
  mode: "development",
});

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", roomName);
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
});

//functions ====================================================

// ==================================================== functions //

//httpServer.listen
httpServer.listen(3000, handleListen);
