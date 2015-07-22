// Client-side script for the index.jade page (Game lobby)

var socket = io();		/* Initiate Socket IO Connection with server */

window.addEventListener('beforeunload', onUserDisconnect);
window.addEventListener('unload', onUserDisconnect);

// JS Event handler for user disconnecting from server
function onUserDisconnect() {
	
	socket.emit('sessionDisconnect');
}
var myid;

socket.on('createSession', function (sid) {
	myid = sid.sessionID;
});

socket.on('userJoined', function (newUserID) {	
	var usersDiv = document.getElementById('divUsers');
	console.log('New User message received');
	// Add new user link
	usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + newUserID + "' data-content=\"<a href='snake'>Play Snake!</a>\" >" + newUserID +  "</a>";
	// Register the new popover element in JQuery
    $('[data-toggle="popover"]').popover({ html: true });
});

socket.on('userLeft', function (userIDs) {
	var usersDiv = document.getElementById('divUsers');
	// Clear out div contents
	usersDiv.innerHTML = "";
	// Add updated users to div
	for (var i=0; i<userIDs.length; i++) {
		if (userIDs[i] != myid) {
			usersDiv.innerHTML += "<a href='#' class='btn btn-success btn-sm' role='button' data-toggle='popover' data-trigger='focus' title='user: " + userIDs[i] + "' data-content=\"<a href='snake'>Play Snake!</a>\" >" + userIDs[i] +  "</a>";
		}		
	}
	// Update JQuery popover element list
    $('[data-toggle="popover"]').popover({ html: true });
});

// When page loads, register all popover elements in JQuery
$(document).ready(function(){
    $('[data-toggle="popover"]').popover({ html: true });
});