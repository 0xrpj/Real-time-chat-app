const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area")
var audio = new Audio("ting.mp3");
let sendBtn = document.querySelector(".send-button")


do {
    name = "Unknown"
    name = prompt("Please enter your name");

    socket.emit("user-joined", {
        nameOfUser: name
    });

} while (!name);

textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
})

sendBtn.addEventListener("click", (e) => {
    sendMessage(textarea.value);
})


function sendMessage(message) {
    if (message.trim() === "") {
        textarea.value = '';

    } else {
        let msg = {
            user: name,
            message: message.trim()
        }
        appendMessage(msg, "outgoing");
        textarea.value = '';
        scrollToBottom();

        //Send to server
        socket.emit("message", msg);
    }

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

//Receive message
socket.on("message", (msg) => {
    // console.log(msg)
    appendMessage(msg, "incoming");
    audio.play();
    scrollToBottom()
    // socket.broadcast.emit("message", msg);
})

//New user joined
socket.on("user-joined", (name) => {
    let connectedDiv = document.createElement("div");
    connectedDiv.classList.add("connected");

    let markup = `
    <p>${name} joined</p>
    `
    connectedDiv.innerHTML = markup;
    messageArea.appendChild(connectedDiv);

    audio.play();
    scrollToBottom()
    // socket.broadcast.emit("message", msg);
})

socket.on("user-disconnected", (name) => {
    let connectedDiv = document.createElement("div");
    connectedDiv.classList.add("connected");

    let markup = `
    <p>${name} disconnected</p>
    `
    connectedDiv.innerHTML = markup;
    messageArea.appendChild(connectedDiv);

    scrollToBottom()
    // socket.broadcast.emit("message", msg);
})


//Who is active?
socket.on("get-ready", () => {
    document.querySelector(".online-peeps").innerHTML = "";
})

//Who is active?
socket.on("active-status", (name) => {
    document.querySelector(".online-peeps").innerHTML += name + "<br/>";
})


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

