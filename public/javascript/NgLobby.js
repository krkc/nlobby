/**
 * @file nglobby class for nlobby
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * @class nglobby
 * @public
 */
function NgLobby (conn)
{
  'use strict';

	var myID;			/* ID of the current player */
	var gameID;		/* ID of current game session */
	var readyID;	/* ID of ready client */
  var socket;


	socket = io(conn + '/gameLobby');		/* Initiate Socket IO Connection with server */


  // Register client event handlers for socket.io disconnect
  window.addEventListener('beforeunload', onUserDisconnect);
  //window.addEventListener('unload', onUserDisconnect);


  // -- Event Handlers -- //

  // JS Event handler for user disconnecting from server
  function onUserDisconnect() {
  	// Alert server that client is leaving
  	socket.emit('sessionDisconnect');
  }

  // Acquire a SID for this page
  socket.on('createSession', function (sid) {
  	myID = sid.sessionID;
    var myLabel = document.getElementById('userLabel');
    myLabel.innerHTML = myID;
  });

  // A new user has joined the socket.io lobby
  socket.on('userJoined', function (newUserID) {
  	var usersDiv = document.getElementById('divUsers');
  	console.log('New User message received');
  	// Add new user link
  	usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + newUserID + "' data-content=\"<a href='snake?p1=" + myID + "&p2=" + newUserID + "'>Play Snake!</a>\" >" + newUserID +  "</a>";
  	// Register the new popover element in JQuery
      $('[data-toggle="popover"]').popover({ html: true });
  });

  // A user has left the socket.io lobby
  socket.on('userLeft', function (userIDs) {
    console.log("[TEST]");
    console.log(userIDs);
  	var usersDiv = document.getElementById('divUsers');
  	// Clear out div contents
  	usersDiv.innerHTML = "";
  	// Add updated users to div
  	for (var i=0; i<userIDs.length; i++) {
  		if (userIDs[i] != myID) {
  			usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + userIDs[i] + "' data-content=\"<a href='snake?p1=" + myID + "&p2=" + userIDs[i] + "'>Play Snake!</a>\" >" + userIDs[i] +  "</a>";
  		}
  	}
  	// Update JQuery popover element list
      $('[data-toggle="popover"]').popover({ html: true });
    });

    // Another player initiates a game invite
    socket.on('playerFinder', function(playerToFind) {
    	if (myID == playerToFind) {
    		var r = confirm("A player wants to play a game, do you accept?");
    		if (r === true) {
    			window.location = 'snake';
    		}
    	}
    });

    // When page loads, register all popover elements in JQuery
    $(document).ready(function(){
        $('[data-toggle="popover"]').popover({ html: true });
    });
}

/**
 * @property socket
 * @memberof nglobby
 * @public
 */
Object.defineProperty(NgLobby, 'Socket', {
  get: function() { return socket; },
  enumerable: true,
  configurable: true
});
