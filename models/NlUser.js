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

var NlUser = function (uuid_hIn) {
  'use strict';

  var uuid_h = uuid_hIn;       /* Hashed user id */
  var lastActive = 0;   /* Time that the user was last active */


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

};

module.exports = NlUser;
