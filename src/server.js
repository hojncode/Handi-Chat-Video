import http from "http";
import WebSocket from "ws";
import express from "express";

//setup-------------------------------------------------------------------------------------//
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//어떠한 url입력해도 /로 보냄.
app.get("*", (req, res) => res.redirect("/"));
//-------------------------------------------------------------------------------------setup//

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = []; // 빈 배열에 메세지 입력값들을 넣는다.

// functions------------------------------------------------------------------------------------
function onSocketClose() {
  console.log("(socket.js)Disconnected from the Browser 📵");
}

//FIXME: //!여기서 함수를 선언하면 , 아래 wss에서 parameter로 들어온 socket이 적용되지 않기에 아래 wss에서 함수를 작성한다.
// function onSocketMessage(msg) {
//   const msgUtf8 = msg.toString("utf-8");
//   const message = JSON.parse(msgUtf8);
//   // console.log("(socket.js)", parsed);
//   switch (message.type) {
//     case "Message":
//       sockets.forEach((aSocket) => aSocket.send(message.payload));
//     case "NickName":
//       socket["NickName"] = message.payload;
//   }
//   // if VS switch
//   // if (message.type === "Message") {
//   //   sockets.forEach((aSocket) => aSocket.send(message.payload));
//   // } else if (message.type === "NickName") {
//   //   console.log(message.payload);
//   // }
// }

//------------------------------------------------------------------------------------functions//

wss.on("connection", (socket) => {
  sockets.push(socket); // sockets 배열에 메세지 입력값들을 넣는다.
  socket["NickName"] = "익명의 채팅자";
  console.log("(socket.js)Conneted to Browser 🔄");
  socket.on("close", onSocketClose);
  //message
  socket.on("message", (msg) => {
    const msgUtf8 = msg.toString("utf-8");
    const message = JSON.parse(msgUtf8);
    // console.log("(socket.js)", parsed);
    switch (message.type) {
      case "Message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.NickName}:${message.payload}`)
        );
        break; //! switch 문에서는 case 사이에 break로 끊어줘야 코드가 새로 실행 되지 않는다.
      case "NickName":
        socket["NickName"] = message.payload;
    }
  });
  socket.send("(socket.js/socket.send) connecting");
  console.log(sockets);
});

server.listen(3000, handleListen);
