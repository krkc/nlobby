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
    document.cookie = "sid=" + myID;
    var myLabel = document.getElementById('userLabel');
    myLabel.innerHTML = myID;
  });

  // A new user has joined the socket.io lobby
  socket.on('userJoined', function (newUserID) {
  	var usersDiv = document.getElementById('divUsers');
  	console.log('New User message received');
  	// Add new user link
    var snakeLink = "<a href='snake?gameTitle=snake&p1=" + myID + "&p2=" + newUserID + "'>Play Snake!</a>";
    var dngnLink = "<a href='snake?gameTitle=dngn&p1=" + myID + "&p2=" + newUserID + "'>Play Dngn!</a>";
  	usersDiv.innerHTML += "<button href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' title='user: " + newUserID + "' data-content=\"" + snakeLink + "<br />" + dngnLink + "\" >" + newUserID +  "</button>&nbsp;";
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
        var snakeLink = "<a href='game?gameTitle=snake&p1=" + myID + "&p2=" + userIDs[i] + "'>Play Snake!</a>";
        var dngnLink = "<a href='game?gameTitle=dngn&p1=" + myID + "&p2=" + userIDs[i] + "'>Play Dngn!</a>";
  			usersDiv.innerHTML += "<button href='#' data-toggle='popover' class='btn btn-success btn-sm' title='user: " + userIDs[i] + "' data-content=\"" + snakeLink + "<br />" + dngnLink + "\" >" + userIDs[i] +  "</button>&nbsp;";
  		}
  	}
  	// Update JQuery popover element list
      $('[data-toggle="popover"]').popover({ html: true });
    });

    // Another player initiates a game invite
    socket.on('playerFinder', function(d) {
      var playerToFind = d.pid;
      var gameToPlay = d.game;
    	if (myID == playerToFind) {
    		var r = confirm("A player wants to play a game, do you accept?");
    		if (r === true) {
    			window.location = `game?gameTitle=${gameToPlay}`;
    		}
    	}
    });

    // When page loads, register all popover elements in JQuery
    $(document).ready(function(){
        $('[data-toggle="popover"]').popover({ html: true });

        $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
         });
        });
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
