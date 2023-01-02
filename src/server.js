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

//functions ====================================================
//countRoom()
function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

//publicRooms()
function publicRooms() {
  //구조분해할당으로 표현하기===
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  //===구조분해할당으로 표현하기.
  // 구조분해할당 적용전 ===
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  // ===구조분해할당 적용전.
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// ==================================================== functions //

//wsServer ====================================================
wsServer.on("connection", (socket) => {
  //default nickname
  socket["nickname"] = "ANON";

  // socket.onAny
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  // enter_room
  socket.on("enter_room", (roomName, nickName, done) => {
    console.log(roomName);
    socket["nickname"] = nickName;
    socket.join(roomName);
    done(); //프론트(app.js)의 showRoom()을 실행시킴.
    //"welcome"event를 roomName에 있는 모든 사람에게 emit 한다.
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // -> roomName에만 메세지를 보냄.
    // nicks.push(socket.nickname);
    wsServer.sockets.emit("room_change", publicRooms()); // 모든 sockets에 보냄.
  });
  // ====================================================wsServer

  //disconnecting
  socket.on("disconnecting", () => {
    console.log(socket.rooms); // Set { ... }
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });

  // disconnect
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  // new_message
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}:${msg}`);
    done(); // !done은 백엔드에서 실행되는게 아니다!! 프론트에서 실행된다.
  });

  //change nickname
  socket.on("changeNickName", (name) => {
    socket["nickname"] = name;
    console.log(name);
    socket.to(name).emit("welcome", socket.nickname);
  });
});

//httpServer.listen
httpServer.listen(3000, handleListen);

// functions------------------------------------------------------------------------------------
// function onSocketClose() {
//   console.log("(socket.js)Disconnected from the Browser 📵");
// }

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

// wss.on ---------------------------------------------------------------------------------
// const sockets = []; // 빈 배열에 메세지 입력값들을 넣는다.
// wss.on("connection", (socket) => {
//   sockets.push(socket); // sockets 배열에 메세지 입력값들을 넣는다.
//   socket["NickName"] = "익명의 채팅자";
//   console.log("(socket.js)Conneted to Browser 🔄");
//   socket.on("close", onSocketClose);
//   //message
//   socket.on("message", (msg) => {
//     const msgUtf8 = msg.toString("utf-8");
//     const message = JSON.parse(msgUtf8);
//     // console.log("(socket.js)", parsed);
//     switch (message.type) {
//       case "Message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.NickName}:${message.payload}`)
//         );
//         break; //! switch 문에서는 case 사이에 break로 끊어줘야 코드가 새로 실행 되지 않는다.
//       case "NickName":
//         socket["NickName"] = message.payload;
//     }
//   });
//   socket.send("(socket.js/socket.send) connecting");
//   console.log(sockets);
// });
//--------------------------------------------------------------------wss.on
