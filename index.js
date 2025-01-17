const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors:{
        origin:"*",
        methods:["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is running.');
})

io.on('connection', (socket) => {
    socket.emit("me", socket.id);//This sends the connected client's socket ID back to them using the event name "me".

    socket.on('disconnect', () =>{ // .on is used to listen for events on the server or client.
        socket.broadcast.emit("callended");// callback function broadcasts says call ended.
    })

    socket.on('calluser', ({userToCall, signalData, from, name}) => { 
        io.to(userToCall).emit("calluser", {signal:signalData, from, name}); //io.to is used to send messages or events to a specific client or room, rather than broadcasting to all connected clients.
    });
    // userCall:  The ID of the user that the calling client wants to connect with. 
    //signalData : The WebRTC signaling data required to establish the peer-to-peer connection between the two clients. This data is necessary for setting up the video/audio call.
    //from : The ID of the calling client.
    //name: The name of the caller.

    socket.on('answercall', (data) =>{ // This event is emitted by a client when they want to answer an incoming call.
    // When the server receives an event with this name {answercall}, the associated callback function is executed.
    //data is the object that contains information sent by the client who is answering the call.
        io.to(data.to).emit("callaccepted", data.signal);
    });
    //data.to : it is the ID of the user who initiated the call {socket.id of the caller}.
    //data.signal : The WebRTC signaling data generated by the answering client. This data is necessary for completing the peer-to-peer connection between the two clients.
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));