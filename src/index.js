const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { emit } = require('process');

const {
	generateMessage,
	generateLocationMessage,
} = require('./utils/messages');

const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({
			id: socket.id,
			username: username,
			room: room,
		});

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit('message', generateMessage('Admin', 'Welcome!'));

		// socket.broadcast.emit will emit message to all other clients except self
		// socket.broadcast.to.emit will emit message to only connected chatroom
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				generateMessage('Admin', `${user.username} has joined.`)
			);

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit(
			'message',
			generateMessage(user.username, message)
		);
		callback(':Delivered');
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				generateMessage(
					'Admin',
					`${user.username} left the conversation`
				)
			);

			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});

	socket.on('sendLocation', (location, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit(
			'locationMessage',
			generateLocationMessage(
				user.username,
				`https://google.com/maps?q=${location.lat},${location.long}`
			)
		);
		callback(':Location shared successfully');
	});
});

server.listen(port, () => {
	console.log('Node app started at port:', port);
});
