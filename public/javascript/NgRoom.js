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
function NgRoom (conn, gamecallback)
{
  'use strict';

	var myID;			/* ID of the current player */
	var gameID;		/* ID of current game session */
	var readyID;	/* ID of ready client */
  var socket = io(conn + '/gameRoom');   /* Socket.io connection object */
  var toastDiv;			/* Toast message div DOM object */
  toastDiv = document.getElementById("toast");


  // -- Event Listeners / Handlers -- //

  // Register client event handlers for socket.io disconnect
  window.addEventListener('beforeunload', function() { onUserDisconnect(socket); });
  //window.addEventListener('unload', onUserDisconnect);
	addEventListener('onToast', onToast, true);

  // SocketIO event handler for session creation
  socket.on('createGameSession', function (pid) {
    myID = pid.ID;
    gameID = pid.gameID;
    gamecallback();
  });

  // JS Event handler for user disconnecting from server
  function onUserDisconnect(socket) {
    socket.emit('disconnectGameSession');
  }

  // SocketIO event handler for receiving game data
	socket.on('serverToClient', function (data) {
		// Server message 'GameReady'
    if (data.GameReady) {
      console.log('Client: Received GameReady from server.');
      dispatchEvent(new CustomEvent('onGameStart', { detail: data.GameReady }));
    }
    // Server message 'StateUpdate'
    if (data.StateUpdate) {
      console.log('Client: Received StateUpdate from server.');
      dispatchEvent(new CustomEvent('onState', { detail: data.StateUpdate }));
    }
    // Server message 'Toast'
    if (data.Toast) {
      console.log('Client: Received Toast from server.');
      dispatchEvent(new CustomEvent('onToast', { detail: data.Toast }));
    }
    // Server message 'ResetAck'
    if (data.ResetAck) {
      console.log('Client: Received ResetAck from server.');
      dispatchEvent(new CustomEvent('onReset', { detail: data.ResetAck }));
    }
    // Server message 'GameOver'
    if (data.GameOver) {
      console.log('Client: Received GameOver from server.');
      dispatchEvent(new CustomEvent('onGameOver', { detail: data.GameOver }));
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

  /**
   * @method onToast
   * @memberof nglobby
   *
   * @desc Handler for 'Toast' server event
   */
  function onToast (e)
  {
    var toastData = e.detail;
    if (myID === toastData.pid || !toastData.pid) {
      // set innerhtml as toast message and make it visible
      toastDiv.firstChild.firstChild.innerHTML = toastData.msg;
      toastDiv.style.display = "block";
      toastDiv.style.visibility = "visible";
      // start timer
      setTimeout(function () {
        toastDiv.style.display = "none";
        toastDiv.style.visibility = "hidden";
      }, 2500);
      // make it hidden again after timer
    }
  }

}
