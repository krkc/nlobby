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

  var _self = this;
	var myID;			/* ID of the current player */
	var gameID;		/* ID of current game session */
	var readyID;	/* ID of ready client */
  var socket;
  var disconnected = false;  /* Flag if client has disconnected (some browsers send two unload events) */
  var _usersDiv = document.getElementById('divUsers');
  var _chatTextDiv = document.getElementById('chatText');
  var _uOnlineSpan = document.getElementById('usersOnlineSpan');
  var _mainloop = null;
  var _lastUsers = [];


	socket = io(conn + '/gameLobby');		/* Initiate Socket IO Connection with server */

  // Register client event handlers for socket.io disconnect
  window.addEventListener('beforeunload', onUserDisconnect);
  window.addEventListener('unload', onUserDisconnect);


  // -- Event Handlers -- //

  // JS Event handler for user disconnecting from server
  function onUserDisconnect() {
    if (!disconnected) {
      disconnected = true;
    	// Alert server that client is leaving
    	socket.emit('sessionDisconnect');
    }
  }

  // Acquire a SID for this page
  socket.on('createSession', function (sid) {
  	myID = sid.sessionID;
    document.cookie = "sid=" + myID;
    var myLabel = document.getElementById('userLabel');
    myLabel.innerHTML = myID;
  });


  // TODO:
  // Going to have 3 events: userJoined, userLeft, and users
  // userJoined and userLeft will be initiated by other client's events
  // users will be initiated by server on an interval and will contain an
  //  expensive operation, but only used when a user disconnects in an improper way.
  // Now there are 3 events performing operations on the same data,
  //  so may need a queueing system for _lastUsers and _usersDiv.
  // A new user has joined the socket.io lobby
  socket.on('userJoined', function (newUserID) {
    // Show message in chat box
  	_chatTextDiv.innerHTML += 'User ' + newUserID + ' has joined.<br />';
    updateUsers('add', [newUserID]);
  });

  socket.on('userLeft', function (userLeft) {
    // Show message in chat box
    _chatTextDiv.innerHTML += 'User ' + userLeft + ' has left.<br />';
    updateUsers('remove', [userLeft]);
  });

  function updateUsers (action, usersToUpdate) {
    for (var userToUpdate of usersToUpdate) {
      if (action === "add") {
        if (_lastUsers.length === 1) {
          // Remove users online default text
          _uOnlineSpan.style.visibility = "hidden";
        }
        // Add new user link
        _lastUsers.push(userToUpdate);
        var attribs = "";
        var snakeLink = "<a href='game?gameTitle=snake&p1=" + myID + "&p2=" + userToUpdate + "'>Play Snake!</a>";
        var dngnLink = "<a href='game?gameTitle=dngn&p1=" + myID + "&p2=" + userToUpdate + "'>Play Dngn!</a>";
        if (myID === userToUpdate) {
            attribs = "style='visibility: hidden; display: none;'";
        }
        _usersDiv.innerHTML += "<a href='#' " + attribs + " class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + userToUpdate + "' data-content=\"" + snakeLink + "<br /><br />" + dngnLink + "\" >" + userToUpdate +  "</a>&nbsp;";
      } else if (action === "remove") {
        // Remove user link
        var ulindex = _lastUsers.indexOf(userToUpdate);
        _lastUsers.splice(ulindex, 1);
        // Remove user button from div
        _usersDiv.removeChild(_usersDiv.children[ulindex]);
        if (_lastUsers.length === 1) {
          // Set users online default text
          _uOnlineSpan.style.visibility = "visible";
        }
      }
    }
    // Update JQuery popover element list
    $('[data-toggle="popover"]').popover({ html: true });
  }

  // A list of users was sent at an interval from the server
  var doubleCheck = false;  /* indicates we should check again for mismatch */
  socket.on('users', function (userIDs) {
    if (_lastUsers.length === 0) {
      // Populate the user list
      updateUsers('add', userIDs);
    } else if (userIDs.length < _lastUsers.length) {
      if (!doubleCheck) {
        // Give time to allow the 'userLeft' event to arrive by ignoring this
        //  event, and acting on the next.
        doubleCheck = true;
      } else {
        // There is a difference in data, likely caused by a client disconnecting
        //  in an improper way. Need to resync with server.
        var needRemoved = [];
        var indexToStart = (-1);
        // Skip to the point where the data differs to cut down on operations
        for (var i=0; i < _lastUsers.length && indexToStart === (-1); i++) {
          if (userIDs[i] === undefined) {
            indexToStart = i;
          } else if (userIDs[i] !== _lastUsers[i]) {
            indexToStart = i;
          }
        }

        if (indexToStart !== (-1)) {
          if (userIDs[indexToStart] === undefined) {
            // Reached end of userIDs, so remove any _lastUsers elements past this index
            for (var l = indexToStart; l < _lastUsers.length; l++) {
              needRemoved.push(_lastUsers[l]);
            }
          } else {
            // The expensive part- the extra elements need found in _lastUsers
            for (var j = indexToStart; j < _lastUsers.length; j++) {
              var match = false;
              for (var k = indexToStart; k < userIDs.length; k++) {
                if (_lastUsers[j] === userIDs[k]) {
                  match = true;
                }
              }
              if (!match) {
                needRemoved.push(_lastUsers[j]);
              }
            }
          }
        }
        // Perform necessary DOM updates
        if (needRemoved.length > 0) {
          updateUsers('remove', needRemoved);
        }
        doubleCheck = false;
      }
    }
    // Inform server that this client is still connected
    socket.emit('userReport', myID);
  });

  // Another player initiates a game invite
  socket.on('playerFinder', function(d) {
    var playerToFind = d.pid;
    var gameToPlay = d.game;
  	if (myID == playerToFind) {
  		var r = confirm("A player wants to play a game, do you accept?");
  		if (r === true) {
  			window.location = "game?gameTitle=" + gameToPlay;
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
