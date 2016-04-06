var LobbyUser = function (socket, nlUsers) {
  'use strict';

  // Add user
  nlUsers.newUser(function (err, newUuid) {
    if (err) console.log(err);
    socket.username = newUuid;
    socket.emit('createSession', { sessionID: socket.username });
    // Broadcast to the lobby that user has connected
    socket.broadcast.emit('userJoined', socket.username);
  });

	// Socket.io handler for client browser 'unload' event
	socket.on('sessionDisconnect', function () {
		// Remove the disconnecting user from the list and broadcast update
		nlUsers.removeUser(socket.username, function (err, status) {
			if (err) console.log(err);
		});

		socket.broadcast.emit('userLeft', socket.username);
	});

	// Socket.io handler for client browser 'userReport' event
	socket.on('userReport', function (uid) {
		// Add reporting user to the list of reported users
		nlUsers.usersReportedArr.push(uid);
	});
}

// Make class available to server.js
module.exports = LobbyUser;
