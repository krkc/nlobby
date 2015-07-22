// project: nodegamelobby
// author: Christopher Kurek


// Required modules:
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var cookie = require('cookie');
var cookieParser = require('socket.io-cookie-parser');


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
io.use(cookieParser());


app.set('views', './views');
app.set('view engine', 'jade');


var sessionIDs = [];

var activeGames = [];

var sessionNumber = 0;


// -- Begin express code --

app.get('/', function (req, res) {
	//sessionIDs.push('TestUser1');
	//sessionIDs.push('TestUser2');
	sessionIDs.push(idGen.genuuid(sessionNumber += 1));
	res.cookie('sid', sessionIDs[sessionIDs.length-1]);
	res.render('index', indexCon.getContent(sessionIDs));
});

app.get('/snake', function(req, res) {
	res.render('game', gameCon.getContent());
});

// -- End express code --


// -- Begin socket.io code --

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

// -- End socket.io code --