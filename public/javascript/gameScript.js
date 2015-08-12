// -- Client-side script for the game page --

//var gameRoom = document.getElementById("gameRoom").innerHTML;

var socket = io('localhost:3000/gameRoom');		/* Initiate Socket IO Connection with server */

// Register client event handlers
window.addEventListener('beforeunload', onUserDisconnect);
window.addEventListener('unload', onUserDisconnect);

var gameID;

// SocketIO event handler for session creation
socket.on('createGameSession', function (gid) {
	gameID = gid.gameID;
});

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	socket.emit('disconnectGameSession');
}

// Send data to SocketIO server
//socket.emit('dataToServer');

// SocketIO event handler for receiving game data
socket.on('dataToClient', function (gid) {
	console.log('Received data from server.');
});
