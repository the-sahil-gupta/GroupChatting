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
const { log } = require('console');
const io = socketIO(server);

const users = [];

io.on('connection', (socket) => {
	socket.on('nameInput', function (user) {
		users.push(user);
		socket.emit('nameInput', users);
	});

	// socket.on('typing', function (data) {
	// 	if (users.indexOf(data) === -1) socket.emit('result', false);
	// 	else socket.emit('result', true);
	// });
});

app.get('/', function (req, res) {
	res.render('index');
});

server.listen(3000, () => {
	console.log('Connected to server');
});
