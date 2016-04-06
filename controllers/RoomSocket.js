var Room = function (socket, nlUsers, activeGames) {
  'use strict';

  // User is already in a game, so something is wrong. redirect them to lobby.
  if (socket.currentGame) {
    socket.redirect('/');
    return;
  }

  // Check if user is currently in a game session
  if (!socket.currentGame) {
    // Perform game and player session setup if newly joined
    if (socket.request.cookies.sid) {
      socket.username = socket.request.cookies.sid;		/* Session username for player */
    }
    // Ensure player is registered to an active game and retrieve that game
    socket.currentGame = activeGames.findGame(socket.username);		/* Session game for player */
  }
  // Game is now created, continue with player registration
  if (socket.currentGame) {
    var gameID = socket.currentGame.GameID;		/* ID of the current game session */
    socket.join(gameID);
    // Move user in redis
    nlUsers.moveUserToGame(socket.username, gameID, function (err, res) {
      if (err) console.log('user not moved to game' + err);
      else console.log('user moved to game');
    });

    console.log('User connected to game room ' + gameID + '. ' + activeGames.sessions.length + ' active games.');
    socket.emit('createGameSession', { ID: socket.username, gameID: gameID });

    // Event handler for when game instance relays data via server to players
    socket.currentGame.eventEmitter.on('dataFromGame', function (dataOut) {
      // Broadcast data to players in the current game room

      socket.broadcast.to(gameID).emit('serverToClient', dataOut);
      //console.log('server: Received data from game.');
    });

    // Socket.io event handler for session destruction/removal
    socket.on('disconnectGameSession', function () {
      activeGames.removeGame(socket.currentGame);
      socket.currentGame = null;
      console.log('User has disconnected from game room. ' + activeGames.sessions.length + ' active games.');
    });

    // Socket.io event handler for session creation
    socket.on('clientToServer', function (dataIn, serverAckCB) {
      if (dataIn.PlayerReady) {
        console.log('server: Received "PlayerReady" message from client.');
        socket.currentGame.onPlayerReady(dataIn.PlayerReady);
      }
      if (dataIn.Input) {
        console.log('server: Received "Input" message from client.');
        socket.currentGame.onInput(dataIn.Input);
      }
      if (dataIn.ResetRequest) {
        console.log('server: Received "ResetRequest" message from client.');
        socket.currentGame.onResetRequest(dataIn.ResetRequest);
      }
    });
  }

  // Broadcast to players in a given room
  //grio.sockets.in('gameID').emit('dataToClient', dataOut);
}

// Make class available to server.js
module.exports = Room;
