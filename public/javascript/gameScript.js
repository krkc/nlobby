// -- Client-side script for the game page --


/**
 * @file Client-side script for the game page
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


var socket = io('localhost:3000/gameRoom');		/* Initiate Socket IO Connection with server */

// Register client event handlers for socket.io disconnect
window.addEventListener('beforeunload', onUserDisconnect);
window.addEventListener('unload', onUserDisconnect);

var gameID;		/* ID of current game session */

// SocketIO event handler for session creation
socket.on('createGameSession', function (gid) {
	gameID = gid.gameID;
});

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	socket.emit('disconnectGameSession');
}

/**
 * @function dataToServer
 * @param {Object} data - Data to send to the server
 * @desc Sends data to the game server.
 */
function dataToServer(data) {
	// Send data to SocketIO server
	socket.emit('dataToServer', data);
}

// SocketIO event handler for receiving game data
socket.on('dataToClient', function (data) {
	console.log('Received data from server.');
});
