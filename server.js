// project: nodegamelobby
// author: Christopher Kurek


// Required framework modules:
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookie = require('cookie');

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

// Set up templating environment
app.set('views', './views');
app.set('view engine', 'jade');

// Server session variables
// (Will be moved to redis eventually)
var sessionIDs = [];

var activeGames = [];

var sessionNumber = 0;


// -- Begin express code --

app.get('/', function (req, res) {
	//sessionIDs.push('TestUser1');
	//sessionIDs.push('TestUser2');
	sessionIDs.push(idGen.genuuid(sessionNumber += 1));
	res.render('index', indexCon.getContent(sessionIDs));
});

app.get('/:id', function(req, res) {
	res.render('game', gameCon.getContent());
	var playerIds = req.params.id.split('+');
	activeGames.push({ hostPlayer: playerIds[0], enemyPlayer: playerIds[1] })
	console.log('testing: ' + activeGames)
});

// -- End express code --


// -- Begin socket.io code --

io.on('connection', function (socket) {
	if (!socket.username) {
		socket.username = sessionIDs[sessionIDs.length-1];
		console.log('New user has connected. Assigning ID...' + socket.username);
	} else {
		socket.username = sessionIDs[sessionIDs.length-1];
		console.log('User \'' + socket.username + '\' has connected. ' + socket.username);
	}

	socket.broadcast.emit('userJoined', socket.username);
	//console.log('User has connected. ' + socket.request.headers.cookie);

  	socket.emit('createSession', { sessionID: socket.username });

	socket.on('sessionDisconnect', function () {

		sessionIDs.splice(sessionIDs.indexOf(socket.username),1);
		socket.broadcast.emit('userLeft', sessionIDs);
		console.log('User \'' + socket.username + '\' has disconnected. ' + socket.username);
	});
});

// -- End socket.io code --
