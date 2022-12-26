import http from "http";
import WebSocket from "ws";
import express from "express";

//setup-------------------------//
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//어떠한 url입력해도 /로 보냄.
app.get("*", (req, res) => res.redirect("/"));
//-------------------------setup//

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("(socket.js)Conneted to Browser 🔄");
  socket.on("close", () =>
    console.log("(socket.js)Disconnected from the Browser 📵")
  );
  socket.on("message", (message) => {
    console.log("(socket.js)", message.toString("utf-8"));
  });
  socket.send("(socket.js) hello~~~~~~");
});

server.listen(3000, handleListen);
