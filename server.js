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
var indexCon = require('./helpers/index');		/* Helper functions for index page */
var nlUsers = require('./controllers/ActiveUsers');		/* Active users object */
var gameCon = require('./helpers/game');			/* Helper functions for game page */
var activeGames = require('./controllers/ActiveGames');		/* Active games object */

var host;	/* Hostname of the server */
var port;	/* Port that the server is listening on */

// Begin Express server
server.listen(8080, function() {
	host = server.address().address;
	port = server.address().port;
	console.log('HTTP server is listening on port ' + port);
});


// Socket.io namespaces
var glio = io.of('/gameLobby');		/* Game Lobby namespace (all players currently in lobby) */
var grio = io.of('/gameRoom');		/* Game Room namespace (all players currently playing games) */

// Make public files visible to express routing
app.use(express.static(__dirname + '/public'));
app.use('/bower',  express.static(__dirname + '/bower_components'));
io.use(cookieParser());

// Set up templating environment
app.set('views', './views');
app.set('view engine', 'jade');

var sessionNumber = 0;	/* current count of sessions started */

// -- Begin express code --

// Express routes
app.get('/', function (req, res) {
	res.render('index', indexCon.getContent("Loading..."));
});

app.get('/snake', function(req, res) {
	if (req.query.p1) {
		// Sterilize input to prevent XSS
		var p1Safe = req.query.p1.replace(/(<([^>]+)>)/ig,"");
		var p2Safe = req.query.p2.replace(/(<([^>]+)>)/ig,"");
		// Create new game session and add to list of active games
		var createdGame = activeGames.newGame('snakegame', p1Safe, p2Safe);
		console.log('PlayerOne.ID from the returned newGame() object: ' + createdGame.PlayerOne.ID);
		// Player 1 broadcast invite to game lobby for Player 2
		glio.emit('playerFinder', p2Safe);
	}

	if (req.headers.cookie) {
		if (req.headers.cookie.search('sid') != -1) {
			// User has an id
			res.render('game', gameCon.getContent());
		}
		else {
			// User needs an id, redirect to root
			res.redirect('/');
		}
	} else {
		// User has no cookies, redirect to root
		res.redirect('/');
	}

});

// -- End express code --


// -- Begin socket.io code --

// Socket.io event handler for Game Lobby connection
glio.on('connection', function (socket) {
	// Add user
	nlUsers.newUser(sessionNumber += 1, socket);
	// Retreive other users
	nlUsers.listUsers(glio);

	// Socket.io handler for client browser 'unload' event
	socket.on('sessionDisconnect', function () {
		// Remove the disconnecting user from the list and broadcast update
		nlUsers.removeUser(socket.username, glio);
	});
});

// Socket.io event handler for Game Room connection
grio.on('connection', function (socket) {
	console.log("[TEST] " + socket.username);
	// Check if user is currently in a game session
	if (!socket.currentGame) {
		// Perform game and player session setup if newly joined
		if (socket.request.cookies.sid) {
			socket.username = socket.request.cookies.sid;		/* Session username for player */
		}
		// Ensure player is registered to an active game and retrieve that game
		socket.currentGame = activeGames.findGame(socket.username);		/* Session game for player */

		if (socket.currentGame) {
			var gameID = socket.currentGame.GameID;		/* ID of the current game session */

			socket.join(gameID);
			console.log('User connected to game room ' + gameID + '. ' + activeGames.sessions.length + ' active games.');

			socket.emit('createGameSession', { ID: socket.username, gameID: gameID });

			// Event handler for when game instance relays data via server to players
			socket.currentGame.eventEmitter.on('dataFromGame', function (dataOut) {
				// Broadcast data to players in the current game room

				socket.broadcast.to(gameID).emit('dataToClient', dataOut);
				//console.log('server: Received data from game.');
			});

			// Socket.io event handler for session destruction/removal
			socket.on('disconnectGameSession', function () {
				activeGames.removeGame(socket.currentGame);
				socket.currentGame = null;
				console.log('User has disconnected from game room. ' + activeGames.sessions.length + ' active games.');
			});

			// Socket.io event handler for session creation
			socket.on('dataFromClient', function (dataIn) {
				socket.currentGame.receiveData(dataIn);
				console.log('server: Received data from client.');
			});
		}
	}

	// Broadcast to players in a given room
	//grio.sockets.in('gameID').emit('dataToClient', dataOut);

});

// -- End socket.io code --
