/**
 * @file Represents a nlobby user
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active nlobby user
 * @class NlUser
 */

var NlUser = function (sessionNum, saltstr) {
  'use strict';

  var Hashids = require('hashids');		/* Hashed ID generator */
  var uuid_h = 0;       /* Hashed user id */
  var lastActive = 0;   /* Time that the user was last active */

  uuid_h = genUuid();


  // Public

  /**
   * @property Uuid_h
   * @memberof NlUser
   * @return {Int} - User's hashed id
   * @desc Getter for current user's hashed id
   * @public
   */
  Object.defineProperty(this,"Uuid_h", {
    get: function() { return uuid_h; },
    enumerable: true,
    configurable: true
  });


  /**
	 * @function genuuid
	 * @memberof NlUsers
	 * @param {Int} sessionNum - Session number assigned to user
	 * @return {String} - Generated user id
	 * @desc Generates a new hashed user id
	 */
	function genUuid () {
		// Create an object for generating IDs
		var hashids = new Hashids(saltstr);
		var d = new Date();
		var currentTimeMs = d.getTime();
		var hashedID = hashids.encode(sessionNum + currentTimeMs);

		return hashedID;
	}

};

module.exports = NlUser;
