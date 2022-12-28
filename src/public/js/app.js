const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.emit 에는 3개의 arguments 가 들어 갈 수 있다. 1)이름, 2) 보내고 싶은 payload (js object 가능) ,3) 함수
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

//! Legacy : webSocket
// const socket = new WebSocket(`ws://${window.location.host}`);
// const messageList = document.querySelector("ul");
// const nicknameForm = document.querySelector("#nickname");
// const messageForm = document.querySelector("#message");
// //function---------------------------------------------------------------------------
// //makeMessage : input 창에 입력된 텍스트를 JSON로 받아서 stringify로 출력. (파라미터 두개 : type, payload)
// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// function handleOpen() {
//   console.log("(app.js)Connected to Server");
// }

// function handleMessage(message) {
//   console.log("(app.js)New Message: ", message.data);
//   const li = document.createElement("li");
//   li.innerText = message.data;
//   messageList.append(li);
// }

// function handleClose() {
//   console.log("(app.js)Disconnected from Sever ❌");
// }
// function handleError() {
//   console.log("(app.js)error!!!!!!!!!!!!");
// }

// function handleMessageSubmit(event) {
//   event.preventDefault();
//   const input = messageForm.querySelector("input");
//   socket.send(makeMessage("Message", input.value));
//   input.value = ""; // input 창 초기화
// }

// function handleNicknameSubmit(event) {
//   event.preventDefault();
//   const input = nicknameForm.querySelector("input");
//   socket.send(makeMessage("NickName", input.value));
//   input.value = ""; // input 창 초기화
// }

// //---------------------------------------------------------------------------function

// socket.addEventListener("open", handleOpen);
// socket.addEventListener("message", handleMessage);
// socket.addEventListener("close", handleClose);

// messageForm.addEventListener("submit", handleMessageSubmit);
// nicknameForm.addEventListener("submit", handleNicknameSubmit);

// // setTimeout(() => {
// //   socket.send("(app.js)This message from the browser! - after 1sec");
// // }, 1000);
