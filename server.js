/**
 * @file node.js server for nlobby
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


// Required framework modules:
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('socket.io-cookie-parser');

// Required project modules:
var indexCon = require('./controllers/index');		/* Controller data for index page */
var idGen = require('./helpers/gensessionid');		/* Session ID generator */
var gameCon = require('./controllers/game');			/* Controller data for game page */
var activeGames = require('./helpers/ActiveGames');		/* Active games object */


var host;	/* Hostname of the server */
var port;	/* Port that the server is listening on */

// Begin Express server
server.listen(3000, function() {
	host = server.address().address;
	port = server.address().port;
	console.log('HTTP server is listening on port ' + port);
});

// Socket.io namespaces
var glio = io.of('/gameLobby');		/* Game Lobby namespace (all players currently in lobby) */
var grio = io.of('/gameRoom');		/* Game Room namespace (all players currently playing games) */

// Make public files visible to express routing
app.use(express.static(__dirname + '/public'));
io.use(cookieParser());

// Set up templating environment
app.set('views', './views');
app.set('view engine', 'jade');

// Server session variables
// (Will be moved to redis eventually)
var sessionIDs = [];
//var activeGames = [];
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
	if (req.query.p1) {
		// Create new game session and add to list of active games
		activeGames.newGame('snakegame', req.query.p1, req.query.p2);
		// Player 1 broadcast invite to game lobby for Player 2
		glio.emit('playerFinder', req.query.p2);
	}

});

// -- End express code --


// -- Begin socket.io code --

// Socket.io event handler for Game Lobby connection
glio.on('connection', function (socket) {

	if (!socket.username) {
		socket.username = socket.request.cookies.sid;
		console.log('New user has connected. Assigning ID...' + socket.username);
	} else {
		socket.username = socket.request.cookies.sid;
		console.log('User \'' + socket.username + '\' has connected. ' + socket.username);
	}

	// Broadcast to the lobby that user has connected
	socket.broadcast.emit('userJoined', socket.username);

  socket.emit('createSession', { sessionID: socket.username });

	// Socket.io handler for client browser 'unload' event
	socket.on('sessionDisconnect', function () {

		// Remove user's session ID from the list
		sessionIDs.splice(sessionIDs.indexOf(socket.username),1);

		// Broadcast to the lobby that user has disconnected
		socket.broadcast.emit('userLeft', sessionIDs);
		console.log('User \'' + socket.username + '\' has disconnected. ' + socket.username);

	});

});

// Socket.io event handler for Game Room connection
grio.on('connection', function (socket) {

	if (socket.request.cookies.sid) {
		socket.username = socket.request.cookies.sid;
		console.log('socket.username: ' + socket.username);
	}

	var gameID = activeGames.findGame(socket.username).GameID;
	socket.join(gameID);
	console.log('User connected to game room ' + gameID);

	socket.emit('createGameSession', { gameID: '1' });

	socket.on('disconnectGameSession', function () {
		console.log('User has disconnected from game room.');
	});

	// SocketIO event handler for session creation
	socket.on('dataToServer', function (dataIn) {


		console.log('Received data from client.');
	});

	// TODO: broadcast game data to game room, wrap in function
	//socket.emit('dataToClient', { clientData: 'test data' });

});

//grio.to('gameID').emit('some event');

// -- End socket.io code --
