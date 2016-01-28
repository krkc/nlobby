/**
 * @file node.js server for nlobby
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


// Required framework modules:
var fs = require('fs');
var events = require('events');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('socket.io-cookie-parser');


// Required project modules / configs:
var routeContent = require('./helpers/routeContent');	/* Helper functions for the index and game routes */
var nlUsers = require('./controllers/ActiveUsers');		/* Active users object */
var activeGames = require('./controllers/ActiveGames');		/* Active games object */
var nlConfig = require('./helpers/nLobby');	/* nLobby config file */


var host;	/* Hostname of the server */
var port;	/* Port that the server is listening on */
var gamesInstalledArr;	/* Array of game titles that will be served */

// Get list of installed games
gamesInstalledArr = fs.readdirSync('./game_files');

// Begin Express server
server.listen(nlConfig.connection.port, function() {
	host = server.address().address;
	port = server.address().port;
	console.log('HTTP server is listening on port ' + port);
});


// Socket.io namespaces
var glio = io.of('/gameLobby');		/* Game Lobby namespace (all players currently in lobby) */
var grio = io.of('/gameRoom');		/* Game Room namespace (all players currently playing games) */

// Make public files visible to express routing
app.use(express.static(__dirname + '/public'));
// Make clientside game files visible to express routing
for (var gameDir of gamesInstalledArr) {
	app.use(express.static(__dirname + '/game_files/' + gameDir + '/clientside'));
}
// Make bower components visible to express routing
app.use('/lib',  express.static(__dirname + '/bower_components'));
io.use(cookieParser());

// Set up templating environment
var viewsArr = ['./views'];
for (var gameDir of gamesInstalledArr) {
	viewsArr.push('./game_files/' + gameDir + '/clientside');
}
app.set('views', viewsArr);
app.set('view engine', 'jade');

var sessionNumber = 0;	/* current count of sessions started */

// -- Begin express code --

// Route: lobby
app.get('/', function (req, res) {
	res.render('lobby', routeContent.getIContent("Loading...", port));
});

// Route: game
app.get('/game', function(req, res) {
	if (req.query.p1) {
		// Sterilize input to prevent XSS
		var p1Safe = req.query.p1.replace(/(<([^>]+)>)/ig,"");
		var p2Safe = req.query.p2.replace(/(<([^>]+)>)/ig,"");
		var gameTitleSafe = req.query.gameTitle.replace(/(<([^>]+)>)/ig,"");
		// Create new game session and add to list of active games
		var createdGame = activeGames.newGame(gameTitleSafe, p1Safe, p2Safe);
		createdGame.eventEmitter = new events.EventEmitter();  /* Event emitter object */
		// Player 1 broadcast invite to game lobby for Player 2
		glio.emit('playerFinder', { pid: p2Safe, game: gameTitleSafe });
	}

	if (req.headers.cookie) {
		if (req.headers.cookie.search('sid') != -1) {
			// User has an id
			if (gamesInstalledArr.indexOf(req.query.gameTitle) != -1) {
				res.render(req.query.gameTitle, routeContent.getGContent(port));
			} else {
				res.redirect('/');
			}
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
	nlUsers.newUser(sessionNumber += 1, function (err, newUuid) {
		if (err) console.log(err);
		socket.username = newUuid;
		socket.emit('createSession', { sessionID: socket.username });
		// Broadcast to the lobby that user has connected
		socket.broadcast.emit('userJoined', socket.username);
	});
	// Retreive other users
	nlUsers.listUsers(function (err, userList) {
		if (err) console.log(err);
		// Broadcast to the lobby that user has disconnected
		glio.emit('userLeft', userList);
	});

	// Socket.io handler for client browser 'unload' event
	socket.on('sessionDisconnect', function () {
		// Remove the disconnecting user from the list and broadcast update
		nlUsers.removeUser(socket.username, function (err, status) {
			if (err) console.log(err);
			if (status) {
				nlUsers.listUsers(function (err, userList) {
					if (err) console.log(err);
					// Broadcast to the lobby that user has disconnected
					glio.emit('userLeft', userList);
				});
			}
		});
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
			var gameID = socket.currentGame.GameID;		/* ID of the current game session */
			socket.join(gameID);
			console.log('User connected to game room ' + gameID + '. ' + activeGames.sessions.length + ' active games.');
			socket.emit('createGameSession', { ID: socket.username, gameID: gameID });

			// Event handler for when game instance relays data via server to players
			socket.currentGame.eventEmitter.on('dataFromGame', function (dataOut) {
				// Broadcast data to players in the current game room

				socket.broadcast.to(gameID).emit('serverToClient', dataOut);
				//console.log('server: Received data from game.');
			});

			// Socket.io event handler for session destruction/removal
			socket.on('disconnectGameSession', function () {
				activeGames.removeGame(socket.currentGame);
				socket.currentGame = null;
				console.log('User has disconnected from game room. ' + activeGames.sessions.length + ' active games.');
			});

			// Socket.io event handler for session creation
			socket.on('clientToServer', function (dataIn) {
				console.log('server: Received data from client.');
				socket.currentGame.runData(dataIn);
			});
		}
	}

	// Broadcast to players in a given room
	//grio.sockets.in('gameID').emit('dataToClient', dataOut);

});

// -- End socket.io code --
