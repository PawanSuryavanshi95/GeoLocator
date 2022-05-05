const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require("http");

const routes = require('./routes');

var path = require('path');
global.__appRoot = path.resolve(__dirname);

const app = express();
const server = http.createServer(app);
const io = require("./socket").listen(server);

mongoose.connect('mongodb://localhost:27017/geolocator', {useNewUrlParser : true, useUnifiedTopology: true }, ()=>{
    console.log('Mongodb Connected');
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);
app.get('/', (req,res)=>{
    res.send(`Server is up and running`);
})

const port = process.env.PORT||5000;
server.listen(port, ()=>{
    console.log('server started at ' + port);
})

/*
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

io.on("connection", socket => {
  console.log("a user connected :D");
  socket.on("chat message", msg => {
    console.log(msg);
    io.emit("chat message", msg);
  });
});

server.listen(port, () => console.log("server running on port:" + port));
*/