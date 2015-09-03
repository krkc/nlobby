// -- Client-side script for the game page --


/**
 * @file Client-side script for the nlobby game page
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


//var socket = io('localhost:3000/gameRoom');		/* Initiate Socket IO Connection with server */
var socket = io('192.168.1.7:3000/gameRoom');		/* Initiate Socket IO Connection with server */


// Register client event handlers for socket.io disconnect
window.addEventListener('beforeunload', onUserDisconnect);
//window.addEventListener('unload', onUserDisconnect);

var myID;			/* ID of the current player */
var gameID;		/* ID of current game session */

// SocketIO event handler for session creation
socket.on('createGameSession', function (pid) {
	myID = pid.ID;
	gameID = pid.gameID;
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
	socket.emit('dataFromClient', data);
	console.log('dataToServer: Sending data from client to server.');
}

// SocketIO event handler for receiving game data
socket.on('dataToClient', function (data) {
	console.log('Client: Received data from server.');
	try {
		dataToClient(data);
	}
	catch (e) {
		console.log('gameScript: dataToClient() failed. ' + e.Message);
	}
});
