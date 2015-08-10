// Client-side script for the game.jade page

var gameRoom = document.getElementById('gameRoom').value;

var socket = io(gameRoom);		/* Initiate Socket IO Connection with server */

// Register client event handlers
window.addEventListener('beforeunload', onUserDisconnect);
window.addEventListener('unload', onUserDisconnect);

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	socket.emit('sessionDisconnect');
}

// SocketIO event handler for session creation
socket.on('createSession', function (sid) {

});
