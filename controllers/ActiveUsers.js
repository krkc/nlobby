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


	var nlConfig = require('../helpers/nLobby');	/* nLobby config file */
  var NlUser = require('../models/NlUser'); /* Game state module */

  var Hashids = require('hashids');		/* Hashed ID generator */

	this.users = [];


	// Public methods

	/**
	 * @function newUser
	 * @memberof ActiveUsers
	 * @param {Object} p1 - Player ID of Player 1.
	 * @param {Object} p2 - Player ID of Player 2.
	 * @return {Object} - Newly created user object.
	 * @desc Create a new user session.
	 */
	ActiveUsers.prototype.newUser = function (sessionNum) {
    // Create new game state object and add to list
    var uuid_h = genUuid(sessionNum);

    this.users.push(
      new NlUser(uuid_h)
    );
    console.log('ActiveUsers.newUser:');
    for (var user of this.users) {
      console.log('user: ' + user.Uuid_h);
    }

    return this.users[this.users.length-1];
	};

  /**
   * @function findUser
   * @memberof ActiveUsers
   * @param {String} pid - User id
   * @return {Object} - Selected NlUser object or NULL.
   * @desc Search for a specific user session
   */
  ActiveUsers.prototype.findUser = function (uuid) {
    for (var user of this.users) {
      //Check each user session for a matching user ID
      if (user.Uuid_h === uuid) {
        return user;
      }
    }
    console.log('findUser failed: uuid: ' + uuid);
    return null;
  };

  /**
   * @function removeUser
   * @memberof ActiveUsers
   * @param {Object} pid - Player ID of Player 1.
   * @return {Object} - Selected NlUser object or NULL.
   * @desc Remove a game from the list when no longer being played
   */
  ActiveUsers.prototype.removeUser = function (user) {
    var userIndex = this.users.indexOf(user);
    if (this.users[userIndex]) {
      // Destroy the game object, but the array position still needs removed
      this.users[userIndex] = null;
      // This removes the now empty array position
      this.users.splice(userIndex,1);
    }
  };

  /**
   * @function listUsers
   * @memberof ActiveUsers
   * @return {Array<String>} - List of user ids
   * @desc Return a list of user ids
   */
  ActiveUsers.prototype.listUsers = function () {
    if (this.users) {
      // Return list of users
      var userList = [];
      for (var user of this.users) {
        userList.push(user.Uuid_h);
      }
      return userList;
    } else {
      // No users, return empty array
      return [];
    }
  };

	/**
	 * @function genUuid
	 * @memberof ActiveUsers
	 * @return {String} - Generated user id
	 * @desc Generates a new hashed user id
	 */
	function genUuid (sessionNum) {
		// Create an object for generating IDs
		var hashids = new Hashids(nlConfig.uuidsalt);
		var d = new Date();
		var currentTimeMs = d.getTime();
		var hashedID = hashids.encode(sessionNum + currentTimeMs);

		return hashedID;
	}

};

// Make class available to server.js
module.exports = new ActiveUsers();
