const PORT = 3333;

const express = require('express');
const http = require('http');
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socket(server, { cors: { origin: "*" } });

let connectedUsers = []
let disconnectedUsers = []

io.on("connection", (socket) => {
    let email = socket.handshake.query.email
    let user = connectedUsers.findIndex(el => el.email === email)
    if (user === -1) {
        user = disconnectedUsers.findIndex(el => el.email === email)
        if (user === -1) {
            let { firstname, lastname, email } = socket.handshake.query
            let newUser = { firstname, lastname, email, connectedAt: new Date().toUTCString() }
            connectedUsers.push(newUser)
        }
        else {
            let newUser = { ...disconnectedUsers.splice(user, 1)[0], connectedAt: new Date().toUTCString() }
            connectedUsers.push(newUser)
        }
        console.log("Someone Connected")
        console.log("Connected Users", connectedUsers)
        console.log("Disconnected Users", disconnectedUsers)
        io.emit("users", { connectedUsers, disconnectedUsers })
    }

  socket.on('disconnect', () => {
    let email = socket.handshake.query.email
      let user = connectedUsers.findIndex(el => el.email === email)
      disconnectedUsers.push({ ...connectedUsers.splice(user, 1)[0], disconnectedAt: new Date().toUTCString() })
    console.log("Someone Disconnected")
    console.log("Connected Users", connectedUsers)
    console.log("Disconnected Users", disconnectedUsers)
    io.emit("users", {connectedUsers, disconnectedUsers})
  })

});

server.listen(PORT, () => console.log("Listening"));