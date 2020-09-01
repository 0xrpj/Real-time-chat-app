const express = require("express");
const app = express();
const http = require("http").createServer(app);

const port = process.env.PORT || 3000;
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

http.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
})

//Socket

const io = require("socket.io")(http);
const users = {};

io.on("connection", (socket) => {

    var address = socket.handshake.address;
    // console.log('New connection from ' + address.address + ':' + address.port);
    console.log("========")
    // console.log(socket);
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;

    console.log(clientIp);

    socket.on("user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name.nameOfUser);

        socket.broadcast.emit("get-ready");

        Object.entries(users).forEach(
            ([key, value]) => {
                // console.log(value.nameOfUser)
                io.emit("active-status", value.nameOfUser);
            }
        );

    })

    socket.on("message", (msg) => {
        socket.broadcast.emit("message", msg);
    })

    socket.on("disconnect", () => {
        if (typeof (users[socket.id]) === 'undefined') {
            socket.broadcast.emit("user-disconnected", "Somebody");
        } else {
            socket.broadcast.emit("user-disconnected", users[socket.id].nameOfUser);
            delete users[socket.id];
            socket.broadcast.emit("get-ready");
            Object.entries(users).forEach(
                ([key, value]) => {
                    io.emit("active-status", value.nameOfUser);
                }
            );
        }
    })
})