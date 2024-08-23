const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

const usernames = [];
const userids = [];

io.on('connection', (socket) => {
	socket.on('username', function (username) {
		usernames.push(username);
		userids.push(socket.id);
		io.emit('users', usernames);
	});

	socket.on('message', (message) => {
		let index = userids.indexOf(socket.id);

		io.emit('message', {
			message,
			username: usernames[index],
			userid: socket.id,
		});
	});
	socket.on('typing', () => {
		const username = usernames[userids.indexOf(socket.id)];

		socket.broadcast.emit('typing', username);
	});
	socket.on('disconnect', function () {
		let index = userids.indexOf(socket.id);
		userids.splice(index, 1);
		usernames.splice(index, 1);
		io.emit('users', usernames);
	});
});

app.get('/', function (req, res) {
	res.render('index');
});

server.listen(3000, () => {
	console.log('Connected to server');
});
