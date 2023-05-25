const express=require("express");
var mongoose = require('mongoose');
var Message = require("./models/message");
var url = "mongodb://localhost:27017/chatapp";

mongoose.connect(url).then((ans) => {
  console.log("connected successful & folder created")
}).catch((err) => {
  console.log("Error in connection")
})

const path = require("path");

const app = express();
const server = require("http").createServer(app);
const port=process.env.PORT || 3000;
  
app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

/* Socket.io Setup */

const io=require('socket.io')(server);
var users={};

io.on("connection",(socket)=>{
  socket.on("new-user-joined",(username)=>{
    users[socket.id]=username;
    socket.broadcast.emit('user-connected',username);
    io.emit("user-list",users);
  });

 socket.on("disconnect",()=>{
  socket.broadcast.emit('user-disconnected',user=users[socket.id]);
  delete users[socket.id];
  io.emit("user-list",users);
 });

 socket.on('message',(data)=>{
   socket.broadcast.emit("message",{user: data.user,msg: data.msg});
   app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })
  app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      res.sendStatus(200);
    })
  })
 });
});

/* Socket.io Setup Ends */

server.listen(port,()=>{
    console.log("server started at"+port);
});
