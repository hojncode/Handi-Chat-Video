const socket = new WebSocket(`ws://${window.location.host}`);

//function---------------------------------------------------------------------------
function handleOpen() {
  console.log("(app.js)Connected to Server");
}

function handleMessage(message) {
  console.log("(app.js)New Message: ", message.data);
}

function handleClose() {
  console.log("(app.js)Disconnected from Sever ❌");
}
function handleError() {
  console.log("(app.js)error!!!!!!!!!!!!");
}
//---------------------------------------------------------------------------function

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", handleMessage);
socket.addEventListener("close", handleClose);

setTimeout(() => {
  socket.send("(app.js)This message from the browser! - after 1sec");
}, 1000);
