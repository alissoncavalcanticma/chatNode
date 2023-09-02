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

//Listener do socket no server, iniciando a conexão
io.on('connection', (socket) => {
    console.log('Conexão iniciada!');
});