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
		//Process incoming data
    if (data.GameReady) {
      console.log('Client: Received GameReady from server.');
      dispatchEvent(new CustomEvent('onGameStart', { detail: data.GameReady }));
    }
    if (data.StateUpdate) {
      console.log('Client: Received StateUpdate from server.');
      dispatchEvent(new CustomEvent('onState', { detail: data.StateUpdate }));
    }
    if (data.Toast) {
      console.log('Client: Received Toast from server.');
      dispatchEvent(new CustomEvent('onToast', { detail: data.Toast }));
    }
    if (data.ResetAck) {
      console.log('Client: Received ResetAck from server.');
      dispatchEvent(new CustomEvent('onReset', { detail: data.ResetAck }));
    }
    if (data.GameOver) {
      console.log('Client: Received GameOver from server.');
      // TODO: Stop client-side snake movement / gamerunning is false
    }
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
		//console.log('dataToServer: Sending data from client to server.');
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
