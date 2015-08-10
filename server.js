// project: nodegamelobby
// author: Christopher Kurek


// Required framework modules:
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var cookie = require('cookie');
var cookieParser = require('socket.io-cookie-parser');

// Required project modules:
var indexCon = require('./controllers/index.js');		/* Controller data for index page */
var idGen = require('./helpers/gensessionid.js');		/* Session ID generator */
var gameCon = require('./controllers/game.js');			/* Controller data for game page */


var host;	/* Hostname of the server */
var port;	/* Port that the server is listening on */

// Begin Express server
server.listen(3000, function() {
	host = server.address().address;
	port = server.address().port;
	console.log('HTTP server is listening on port ' + port);
});

// Make public files visible to express routing
app.use(express.static(__dirname + '/public'));
io.use(cookieParser());

// Set up templating environment
app.set('views', './views');
app.set('view engine', 'jade');

// Server session variables
// (Will be moved to redis eventually)
var sessionIDs = [];
var activeGames = [];
var sessionNumber = 0;

// -- Begin express code --

// Express routes
app.get('/', function (req, res) {
	sessionIDs.push(idGen.genuuid(sessionNumber += 1));
	res.cookie('sid', sessionIDs[sessionIDs.length-1]);
	res.render('index', indexCon.getContent(sessionIDs));
});

app.get('/snake', function(req, res) {
	res.render('game', gameCon.getContent());
	if (req.query.p2) {
		// Player has p2 parameter, so must be p1
		io.sockets.emit('playerFinder', req.query.p2);
	}

});

// -- End express code --


// -- Begin socket.io code --

// Socket.io default handler for new incoming connections
io.on('connection', function (socket) {

	if (!socket.username) {
		socket.username = socket.request.cookies.sid;
		if (socket.request.cookies.sid) {
			//activeGames.push({ PlayerOne: playerIds[0], PlayerTwo: playerIds[1] })
			console.log('Cookie present');
		}
		console.log('New user has connected. Assigning ID...' + socket.username);
	} else {
		socket.username = socket.request.cookies.sid;
		console.log('User \'' + socket.username + '\' has connected. ' + socket.username);
	}

	socket.broadcast.emit('userJoined', socket.username);

  socket.emit('createSession', { sessionID: socket.username });

	socket.on('sessionDisconnect', function () {

		sessionIDs.splice(sessionIDs.indexOf(socket.username),1);
		socket.broadcast.emit('userLeft', sessionIDs);
		console.log('User \'' + socket.username + '\' has disconnected. ' + socket.username);

	});

});

// Game Room namespace (all players currently playing games)
var grio = io.of('gameRoom');
grio.on('connection', function (socket) {
	socket.join('gameID');
	console.log('User connected to game room.');

	socket.emit('createSession', { sessionID: socket.username });

	socket.on('sessionDisconnect', function () {
		console.log('User has disconnected from game room.');
	});
});

//grio.to('gameID').emit('some event');

// -- End socket.io code --
