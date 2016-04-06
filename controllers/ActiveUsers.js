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
  this.rClient = redis.createClient();

  // Required project modules
  this.nlConfig = require('../helpers/nLobby');	/* nLobby config file */
  this.self = this;    /* For accessing 'this' when being called from another context */
  this.sessionNumber = 0;
  this.usersReportedArr = [];   /* array of keys of users to look for in redis */

  // Create an object for generating IDs
  this.hashIdGen = new Hashids(this.nlConfig.user.uuidsalt);

  // Redis error-handler
  this.rClient.on("error", function (err) {
      console.log("Error " + err);
  });
};  // End ActiveUsers constructor


// Public methods

/**
 * @function newUser
 * @memberof ActiveUsers
 * @param {Integer} sessionNum - Current session number used to seed hashed id
 * @param {Object} socket - Socket.io socket used to emit results when finished
 *
 * @desc Create a new user session using redis-store
 */
ActiveUsers.prototype.newUser = function (emitToLobbyCB) {
  var self = this;
  // Create hashed user id and assign to the current user's socket
  var d = new Date();
  var currentTimeMs = d.getTime();
  var uuid_h = self.hashIdGen.encode(++self.sessionNumber + currentTimeMs);

  // Add a new user to set of users, set to expire after 2 minutes
  self.rClient.set("user_" + uuid_h, uuid_h, function (err, reply) {
    if (err) {
      emitToLobbyCB(err, null);
    } else {
      self.rClient.expire("user_" + uuid_h, self.nlConfig.user.expireTime);
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
    this.rClient.get("user_" + uuid, function(err, reply) {
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
  this.rClient.del("user_" + username, function (err, status) {
    if (err) {
      removeUserCB(err, null);
    } else {
      removeUserCB(null, status);
    }
  });
};

/**
 * @function refreshUsers
 * @memberof ActiveUsers
 * @param {Array[String]} userkeys - Keys of the users still connected
 * @param {Object} roomsocket - Socket.io socket used to emit results when finished
 *
 * @desc Remove a user from the redis-store
 */
ActiveUsers.prototype.refreshUsers = function (refreshUserCB) {
  var self = this;
  if (self.usersReportedArr.length > 0) {
    var expireCmds = [];
    for (var key of self.usersReportedArr) {
      expireCmds.push(["expire", "user_" + key, self.nlConfig.user.expireTime]);
    }
    // Remove the specified user
    self.rClient.multi(expireCmds).exec(function (err, status) {
      if (err) {
        refreshUserCB(err, null);
      } else {
        self.usersReportedArr = [];
        refreshUserCB(null, status);
      }
    });
  }
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
  var self = this;

  // redis lua scripting, http://redis.io/commands/eval
  self.rClient.eval("local res = redis.call('KEYS', 'user_*'); if (#res > 0) then return redis.call('MGET', unpack(res)) end;", 0, "",
  function (err, reply) {
    if (err) listUsersCB(err, null);
    else listUsersCB(null, reply);
  });
};  // End listUsers

ActiveUsers.prototype.moveUserToGame = function (uuidToMove, game, moveUserCB) {
  var self = this;

  // edit entry from lobby user to game user
  var expireCmds = [];
  expireCmds.push(["del", "user_" + uuidToMove]);
  expireCmds.push(["set", "game_" + game + "_user_" + uuidToMove, uuidToMove]);
  expireCmds.push(["expire", "game_" + game + "_user_" + uuidToMove, self.nlConfig.user.expireTime]);
  // Remove the specified user
  self.rClient.multi(expireCmds).exec(function (err, status) {
    if (err) {
      moveUserCB(err, null);
    } else {
      moveUserCB(null, status);
    }
  });
}

// Make class available to server.js
module.exports = new ActiveUsers();
