// Client-side script for the index.jade page (Game lobby)

//var socket = io('localhost:3000/gameLobby');		/* Initiate Socket IO Connection with server */
var socket = io('192.168.1.7:3000/gameLobby');		/* Initiate Socket IO Connection with server */


// Register client event handlers
window.addEventListener('beforeunload', onUserDisconnect);
//window.addEventListener('unload', onUserDisconnect);

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	// Alert server that client is leaving
	socket.emit('sessionDisconnect');
}

// Store client's SID for this page
var myid;

// Acquire a SID for this page
socket.on('createSession', function (sid) {
	myid = sid.sessionID;
});

// A new user has joined the socket.io lobby
socket.on('userJoined', function (newUserID) {
	var usersDiv = document.getElementById('divUsers');
	console.log('New User message received');
	// Add new user link
	usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + newUserID + "' data-content=\"<a href='snake?p1=" + myid + "&p2=" + newUserID + "'>Play Snake!</a>\" >" + newUserID +  "</a>";
	// Register the new popover element in JQuery
    $('[data-toggle="popover"]').popover({ html: true });
});

// A user has left the socket.io lobby
socket.on('userLeft', function (userIDs) {
	var usersDiv = document.getElementById('divUsers');
	// Clear out div contents
	usersDiv.innerHTML = "";
	// Add updated users to div
	for (var i=0; i<userIDs.length; i++) {
		if (userIDs[i] != myid) {
			usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + userIDs[i] + "' data-content=\"<a href='snake?p1=" + myid + "&p2=" + userIDs[i] + "'>Play Snake!</a>\" >" + userIDs[i] +  "</a>";
		}
	}
	// Update JQuery popover element list
    $('[data-toggle="popover"]').popover({ html: true });
});

// Another player initiates a game invite
socket.on('playerFinder', function(playerToFind) {
	if (myid == playerToFind) {
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
