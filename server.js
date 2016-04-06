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


// Required project modules / configs:
var routeContent = require('./helpers/routeContent');	/* Helper functions for the index and game routes */
var nlUsers = require('./controllers/ActiveUsers');		/* Active users object */
var activeGames = require('./controllers/ActiveGames');		/* Active games object */
var LobbySocket = require('./controllers/LobbySocket.js');
var RoomSocket = require('./controllers/RoomSocket.js');
var nlConfig = require('./helpers/nLobby');	/* nLobby config file */


var host;	/* Hostname of the server */
var port;	/* Port that the server is listening on */
var installedGamesArr = Object.keys(nlConfig.games);	/* Array of game titles that will be served */

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
for (var i of installedGamesArr) {
	var _game = nlConfig.games[i];
	app.use(express.static(__dirname + '/game_files/' + _game.clientDir));
	app.use(express.static(__dirname + '/game_files/' + _game.clientDir + '/textures'));
}
// Make bower components visible to express routing
app.use('/lib',  express.static(__dirname + '/bower_components'));
io.use(cookieParser());

// Set up templating environment
var viewsArr = ['./views'];
for (var i of installedGamesArr) {
	var _game = nlConfig.games[i];
	viewsArr.push('./game_files/' + _game.clientDir);
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
		if (createdGame !== null) {
			// Player 1 broadcast invite to game lobby for Player 2
			glio.emit('playerFinder', { pid: p2Safe, game: gameTitleSafe });
		} else {
			res.redirect('/');
		}
	}

	if (req.headers.cookie) {
		if (req.headers.cookie.search('sid') != -1) {
			// User has an id
			if (nlConfig.games[req.query.gameTitle]) {
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

// Regularly check redis for connected users and inform clients
setInterval(function () {
	// Refresh reported users in redis (so they don't expire)
	nlUsers.refreshUsers(function (err, status) {
		if (err) console.log(err);
	});
	// Send list of users in redis to clients
	nlUsers.listUsers(function (err, userList) {
		if (err) console.log(err);
		glio.emit('users', userList);
	});
	// TODO: Remove any users from games they may have been in
}, 1500);


// Socket.io event handler for Game Lobby connection
glio.on('connection', function (socket) {
	LobbySocket(socket, nlUsers);
});


// Socket.io event handler for Game Room connection
grio.on('connection', function (socket) {
	RoomSocket(socket, nlUsers, activeGames);
});

// -- End socket.io code --
