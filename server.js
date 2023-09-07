const express = require('express');
const path = require('path');
const http = require('http');
//Instanciando a lib socket.io
const socketIO = require('socket.io');

const app = express();

const server = http.createServer(app);
//instanciando variável io e passando a definição do server
const io = socketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));


let connectedUsers = [];
//Listener do socket no server, iniciando a conexão
io.on('connection', (socket) => {
    console.log('Conexão iniciada!');

    socket.on('join-request', (userName) => {
        socket.userName = userName;

        connectedUsers.push(userName);

        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);

        socket.broadcast.emit('list-update', {
            joined: userName,
            list: connectedUsers
        })
    });

    //Disconect users

    socket.on('disconnect', () => {

        connectedUsers = connectedUsers.filter(u => u != socket.userName);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.userName,
            list: connectedUsers
        });
    });

    //send msg to all

    socket.on('send-msg', (txt) => {
        let obj = {
            userName: socket.userName,
            message: txt
        };

        //socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);
    });
});