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
	ActiveUsers.prototype.newUser = function (sessionNum, emitToLobbyCB) {
    // Create hashed user id and assign to the current user's socket
    var uuid_h = genUuid(sessionNum);
    // Add a new user to set of users, set to expire after 2 minutes
    rClient.set("user_" + uuid_h, uuid_h, function (err, reply) {
      if (err) {
        emitToLobbyCB(err, null);
      } else {
        rClient.expire("user_" + uuid_h, nlConfig.user.expireTime);
        // Callback to server.js for emitting to the lobby
        emitToLobbyCB(null, uuid_h);
      }
    });
	};


  /**
   * @function findUser
   * @memberof ActiveUsers
   * @param {String} uuid - User id
   *
   * @desc Search for a specific user session in the redis-store
   */
  ActiveUsers.prototype.findUser = function (uuid, findUserCB) {
      // Get the specified user from redis
      rClient.get("user_" + uuid, function(err, reply) {
        if (err) {
          findUserCB(err, null);
        } else {
          findUserCB(null, reply);
        }
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
  ActiveUsers.prototype.removeUser = function (username, removeUserCB) {
    // Remove the specified user
    rClient.del("user_" + username, function (err, status) {
      if (err) {
        removeUserCB(err, null);
      } else {
        removeUserCB(null, status);
      }
    });
  };

  /**
   * @function listUsers
   * @memberof ActiveUsers
   * @param {Object} roomsocket - Socket.io socket used to emit results when finished
   *
   * @desc Return a list of user ids
   */
  ActiveUsers.prototype.listUsers = function (listUsersCB) {
    // Get all users from redis and promise to emit over socket
    var p1 = new Promise(function(resolve, reject) {
      // Get all user keys
      rClient.keys("user*", function (err, users) {
        if (err) console.log(err);
        if (users.length > 0) {
          rClient.mget(users, function (err, usersFound) {
            if (err) {
              reject(err);
            } else {
              resolve(usersFound);
            }
          }); // End rClient.mget
        } else {
          resolve([]);
        }
      }); // End rClient.keys
    }); // End promise

    p1.then(function(val) {
      listUsersCB(null, val);
    });

    p1.catch(function(val) {
      listUsersCB(val, null);
    });
  };
};

// Make class available to server.js
module.exports = new ActiveUsers();
