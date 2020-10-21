const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { emit } = require('process');

const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('message', generateMessage('Welcome!'));

    // socket.broadcast.emit will emit message to all other clients except self
    socket.broadcast.emit('message', generateMessage('A new user joined chat room'));

    socket.on('sendMessage', (message, callback) => {
        console.log(message);
        io.emit('message',generateMessage(message));
        callback(':Delivered');
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has disconnected'));
    });

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.lat},${location.long}`));
        callback(':Location shared successfully');
    })
})

server.listen(port, () => {
    console.log('Node app started at port:', port);
})