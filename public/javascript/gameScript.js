// Client-side script for the game.jade page

var socket = io();		/* Initiate Socket IO Connection with server */

window.addEventListener('beforeunload', onUserDisconnect);
window.addEventListener('unload', onUserDisconnect);

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	
	socket.emit('sessionDisconnect');
}

// SocketIO event handler for session creation
socket.on('createSession', function (sid) {
	
});