const express = require("express");
const path = require("path");
const cors = require("cors");
const {v4: uuidv4} = require("uuid");
const expressSanitizer = require('express-sanitizer');

const app = express();
const server = require("http").createServer(app);
const iostream = require("socket.io")(server)


app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(expressSanitizer())

let pins = []
let rooms = {}
let chatLogs = {}
let numUsers = 0


app.get("/", (req, res) => {
  	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/rooms/new', function (req, res, next) {
	const roomId = uuidv4()
	const room = {
		id: roomId,
		name: "My Room"
	};
	pins.push({
		chatRoomId: roomId,
		coordinates: {
			lat: req.sanitize(req.query.lat),
			lng: req.sanitize(req.query.lng)
		},
	})
	rooms[roomId] = room;
	chatLogs[roomId] = [];		
	res.json(roomId);
});

app.get('/api/rooms', function (req, res, next) {
	const response = [...pins];
	res.json(response);
});

app.get('/api/rooms/:roomId', function (req, res, next) {
	const roomId = req.sanitize(req.params.roomId);
	let response ={}
	if (rooms[roomId]){
		response = {
			...(rooms[roomId]),
			chats: chatLogs[roomId]
		}
	}
	res.json(response);
});

iostream.on('connection', socket => {
	numUsers +=1
	
	socket.on('disconnect', function(){
		numUsers -=1
		
		if (numUsers === 0){
			pins = []
			rooms = {}
			chatLogs = {}
		}
	});
	
	socket.on('event://send-message', msg => {	
		const payload = JSON.parse(msg);
		chatLogs[payload["roomId"]].push(payload.data);		
		socket.broadcast.emit('event://get-message', msg);
	})
	
	socket.on('event://send-room-name', msg => {	
		const payload = JSON.parse(msg);
		rooms[payload.roomId].name = payload.roomName
		socket.broadcast.emit('event://get-room-name', msg);
	})
	
	socket.on('event://send-new-pin', msg => {	
		socket.broadcast.emit('event://receive-new-pin', msg);
	})
	
	
});

server.listen(8080, function(){
	console.log("Server started");
})