/**
 * @file node.js server for nlobby
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


// Required framework modules:
//var events = require('events');
//var eventEmitter = new events.EventEmitter();
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

	if (req.query.p1) {
		// Sterilize input to prevent XSS
		var p1Safe = req.query.p1.replace(/(<([^>]+)>)/ig,"");
		var p2Safe = req.query.p2.replace(/(<([^>]+)>)/ig,"");
		// Create new game session and add to list of active games
		activeGames.newGame('snakegame', p1Safe, p2Safe);
		// Player 1 broadcast invite to game lobby for Player 2
		glio.emit('playerFinder', p2Safe);

	}

	if (req.headers.cookie) {
		if (req.headers.cookie.search('sid') != -1) {
			res.render('game', gameCon.getContent());
		}
		else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}

});

// -- End express code --


// -- Begin socket.io code --

// Socket.io event handler for Game Lobby connection
glio.on('connection', function (socket) {

	if (!socket.username) {
		socket.username = socket.request.cookies.sid;
		console.log('New user has connected to game lobby. Assigning ID...' + socket.username);
	} else {
		socket.username = socket.request.cookies.sid;
		console.log('User \'' + socket.username + '\' has reconnected to game lobby. ');
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
		console.log('User \'' + socket.username + '\' has disconnected from game lobby. ');

	});

});

// Socket.io event handler for Game Room connection
grio.on('connection', function (socket) {

	// Check if user is currently in a game session
	if (!socket.currentGame) {
		// Perform game and player session setup if newly joined
		if (socket.request.cookies.sid) {
			socket.username = socket.request.cookies.sid;		/* Session username for player */
		}

		// Ensure player is registered to an active game and retrieve that game
		socket.currentGame = activeGames.findGame(socket.username);		/* Session game for player */

		if (socket.currentGame) {
			socket.currentGame.init();
			var gameID = socket.currentGame.GameID;		/* ID of the current game session */

			//socket.join(gameID);
			socket.join('gameID');
			console.log('User connected to game room ' + gameID + '. ' + activeGames.sessions.length + ' active games.');

			socket.emit('createGameSession', { ID: socket.username, gameID: gameID });
		}
	}

	socket.on('disconnectGameSession', function () {
		activeGames.removeGame(socket.currentGame);
		console.log('User has disconnected from game room. ' + activeGames.sessions.length + ' active games.');
	});

	// SocketIO event handler for session creation
	socket.on('dataFromClient', function (dataIn) {
		try {
			socket.currentGame.receiveData(dataIn);
		}

		catch(err) {
			console.log(err.message);
		}

		console.log('server: Received data from client.');
	});

	// Event handler for when game sends data to players
	socket.currentGame.eventEmitter.on('dataFromServer', function (dataOut) {
		// Broadcast data to players in the current game room

		socket.broadcast.to('gameID').emit('dataToClient', dataOut);
		console.log('server: Received data from game.');
	});

	// Send data to individual player
	//socket.emit('dataToClient', { clientData: 'test data' });

	// Broadcast to players in a given room
	//grio.sockets.in('gameID').emit('dataToClient', dataOut);

});

// -- End socket.io code --
