// Client-side script for the index.jade page (Game lobby)

var socket = io('localhost:3000');

window.addEventListener('beforeunload', onUserDisconnect);

function onUserDisconnect() {
	
	socket.emit('sessionDisconnect');
}


socket.on('createSession', function (sid) {
	document.cookie = "sid=" + sid.sessionID;
});

$(document).ready(function(){
    $('[data-toggle="popover"]').popover({ html: true });
});