const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("(app.js)Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log("(app.js)New Message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("(app.js)Disconnected from Sever ❌");
});

socket.addEventListener("error", () => {
  console.log("(app.js)error!!!!!!!!!!!!");
});
setTimeout(() => {
  socket.send("(app.js)This message from the browser! - after 1sec");
}, 1000);
