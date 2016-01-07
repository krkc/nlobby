/**
 * @file Manages the active user sessions
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active user session.
 * @class ActiveUsers
 */

var ActiveUsers = function () {
  'use strict';

  // Required framework modules
  var Hashids = require('hashids');		/* Hashed ID generator */
  var redis = require('redis');
  var rClient = redis.createClient();

  // Required project modules
  var nlConfig = require('../helpers/nLobby');	/* nLobby config file */

  var self = this;    /* For accessing 'this' when being called from another context */

  // Redis error-handler
  rClient.on("error", function (err) {
      console.log("Error " + err);
  });

  // Private methods

  /**
	 * @function genUuid
	 * @memberof ActiveUsers
	 * @return {String} - Generated user id
   *
	 * @desc Generates a new hashed user id
	 */
	function genUuid (sessionNum) {
		// Create an object for generating IDs
		var hashids = new Hashids(nlConfig.user.uuidsalt);
		var d = new Date();
		var currentTimeMs = d.getTime();
		var hashedID = hashids.encode(sessionNum + currentTimeMs);

		return hashedID;
	}


	// Public methods

	/**
	 * @function newUser
	 * @memberof ActiveUsers
	 * @param {Integer} sessionNum - Current session number used to seed hashed id
	 * @param {Object} socket - Socket.io socket used to emit results when finished
   *
	 * @desc Create a new user session using redis-store
	 */
	ActiveUsers.prototype.newUser = function (sessionNum, socket) {
    // Create hashed user id and assign to the current user's socket
    var uuid_h = genUuid(sessionNum);
    socket.username = uuid_h;

    // Add user to redis and promise to emit over socket
    var prom = new Promise(function (resolve, reject) {
      // Add a new user to set of users, set to expire after 2 minutes
      rClient.set("user_" + uuid_h, uuid_h, function (err, reply) {
        if (err) console.log(err);
        rClient.expire("user_" + uuid_h, nlConfig.user.expireTime);
        resolve(reply);
      });
    }).then(function(val) {
      socket.emit('createSession', { sessionID: socket.username });
      // Broadcast to the lobby that user has connected
      socket.broadcast.emit('userJoined', socket.username);
    });
	};


  /**
   * @function findUser
   * @memberof ActiveUsers
   * @param {String} uuid - User id
   *
   * @desc Search for a specific user session in the redis-store
   */
  ActiveUsers.prototype.findUser = function (uuid) {
    // Get user from redis and promise to emit over socket
    var p1 = new Promise(function(resolve, reject) {
      // Get the specified user
      rClient.get("user_" + uuid, function(err, reply) {
        resolve(reply);
      });
    }).then(function(reply) {
      // User found
      console.log("[TEST] User Found: " + reply);
    });
  };


  /**
   * @function removeUser
   * @memberof ActiveUsers
   * @param {String} username - Username of the user to be removed
   * @param {Object} roomsocket - Socket.io socket used to emit results when finished
   *
   * @desc Remove a user from the redis-store
   */
  ActiveUsers.prototype.removeUser = function (username, roomsocket) {
    // Remove user from redis and promise to emit over socket
    var p1 = new Promise(function(resolve, reject) {
      // Remove the specified user
      rClient.del("user_" + username, function (err, reply) {
        if (err) console.log(err);
        if (reply) {
          // User was successfully removed
          resolve(reply);
        } else {
          // User was not found
          console.log("User to be removed was not found");
        }
      });
    }).then(function(reply) {
      // User removal complete, update everyone's user lists
      self.listUsers(roomsocket);
    });

  };

  /**
   * @function listUsers
   * @memberof ActiveUsers
   * @param {Object} roomsocket - Socket.io socket used to emit results when finished
   *
   * @desc Return a list of user ids
   */
  ActiveUsers.prototype.listUsers = function (socket) {
    // Get all users from redis and promise to emit over socket
    var p1 = new Promise(function(resolve, reject) {
      // Get all user keys
      rClient.keys("user*", function (err, users) {
        if (err) console.log(err);
        resolve(users);
      });
    }).then(function(userKeysFound) {
      // Use keys to get all user values (hashed ids)
      rClient.mget(userKeysFound, function (err, usersFound) {
        if (usersFound) {
  				// Broadcast to the lobby that user has disconnected
          socket.emit('userLeft', usersFound);
  			} else {
  				// No users found, send an empty array
  				socket.emit('userLeft', []);
  			}
      });
    });
  };
};

// Make class available to server.js
module.exports = new ActiveUsers();
