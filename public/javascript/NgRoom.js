/**
 * @file NgRoom class for nlobby
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * @class NgRoom
 * @public
 */
function NgRoom (conn)
{
  'use strict';

	var myID;			/* ID of the current player */
	var gameID;		/* ID of current game session */
	var readyID;	/* ID of ready client */
  var socket = io(conn + '/gameRoom');   /* Socket.io connection object */



  // -- Event Listeners / Handlers -- //

  // Register client event handlers for socket.io disconnect
  window.addEventListener('beforeunload', function() { onUserDisconnect(socket); });
  //window.addEventListener('unload', onUserDisconnect);

  // SocketIO event handler for session creation
  socket.on('createGameSession', function (pid) {
    myID = pid.ID;
    gameID = pid.gameID;
  });

  // JS Event handler for user disconnecting from server
  function onUserDisconnect(socket) {
    socket.emit('disconnectGameSession');
  }

  // SocketIO event handler for receiving game data
	socket.on('serverToClient', function (data) {
		console.log('Client: Received data from server.');
		//Process incoming data
    dispatchEvent(new CustomEvent('dataToGame', { detail: data }));
	});


  /**
	 * @method dataToServer
	 * @memberof nglobby
	 * @param {Object} data - Data to send to the server
	 *
	 * @desc Sends data to the game server.
	 * @public
	 */
	this.dataToServer = function (data)
	{
		// Send data to SocketIO server
		socket.emit('clientToServer', data);
		console.log('dataToServer: Sending data from client to server.');
	};

  /**
	 * @method getMyID
	 * @memberof nglobby
   * @return user id
	 *
	 * @desc Returns the current user's id
	 * @public
	 */
	this.getMyID = function ()
	{
		return myID;
	};

}
