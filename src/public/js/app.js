const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName; //전역 변수 선언.
//form 의 addEventListener실행 -> handleRoomSubmit() 실행 -> emit ->  roomName = input.value; ->  BACKEND: showRoom함수 실행 -> app.js 실행

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNickNameSubmit(event) {
  event.preventDefault();
  const input = enterForm.querySelector("#nickName");
  console.log("12312321eewfasdfas", `asdfasdfasdf${input.value}`);
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
  //   const nameForm = form.querySelector("#name");
  //   nameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = enterForm.querySelector("#roomName");
  const nickNameInput = enterForm.querySelector("#nickName");
  //socket.emit 에는 원하는만큼의 arguments 가 들어 갈 수 있다. 1)이름, 2) 보내고 싶은 payload (js object 가능) ,3) 서버에서 호출하는 함수 * 마지막 argument는 함수가 들어가야한다-규칙.
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  //   const changeNameInput = room.querySelector("#changeName input");
  //   changeNameInput.value = nickNameInput.value;
}

function handleChangeNickName(event) {
  event.preventDefault();
  const changeNameInput = room.querySelector("#changeName input");
  socket.emit("changeNickName", changeNameInput.value);
}

enterForm.addEventListener("submit", handleRoomSubmit);
room.addEventListener("submit", handleChangeNickName);

//백엔드의 "welcome"을 받아옴.
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
  console.log(newCount);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
}); // === msg => console.log(msg)

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
