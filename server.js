// project: nodegamelobby
// author: Christopher Kurek


// Required modules:
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookie = require('cookie');


var indexCon = require('./controllers/index.js');		/* Controller data for index page */
var idGen = require('./helpers/gensessionid.js');		/* Session ID generator */
var gameCon = require('./controllers/game.js');			/* Controller data for game page */



var host;
var port;

server.listen(3000, function() {
	host = server.address().address;
	port = server.address().port;
	console.log('HTTP server is listening on port ' + port);
});

app.use(express.static(__dirname + '/public'));


app.set('views', './views');
app.set('view engine', 'jade');


var sessionIDs = [];

var activeGames = [];

var sessionNumber = 0;


// -- Begin express code --

app.get('/', function (req, res) {
	sessionIDs.push('TestUser1');
	sessionIDs.push('TestUser2');
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
	if (!io.username) {
		io.username = sessionIDs[sessionIDs.length-1];
		console.log('New user has connected. Assigning ID...');
	} else {
		io.username = sessionIDs[sessionIDs.length-1];
		console.log('User \'' + io.username + '\' has connected. ');
	}

	//console.log('User has connected. ' + socket.request.headers.cookie);

  	socket.emit('createSession', { sessionID: sessionIDs[sessionIDs.length - 1] });

	socket.on('sessionDisconnect', function () {

		sessionIDs.splice(sessionIDs.indexOf(io.username),1);
		console.log('User \'' + io.username + '\' has disconnected. ');
	});
});

// -- End socket.io code --