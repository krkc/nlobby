/**
 * @file Manages the active game sessions
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active game session.
 * @class
 */

var ActiveGames = function () {

  // Private data members
  this.sessions = [];

};

// Public methods

/**
 * @function newGame
 * @memberof ActiveGames
 * @param {Object} p1 - Player ID of Player 1.
 * @param {Object} p2 - Player ID of Player 2.
 * @return {Object} - Newly created game object.
 * @desc Create a new game session.
 */
ActiveGames.prototype.newGame = function (p1, p2) {
  this.sessions.push({
    GameID: p1 + p2,   /* The Game ID. For now, simply both player ID strings combined */
    PlayerOne: {
      PlayerID: p1,
      XLoc: -1,
      YLoc: -1,
      Score: 0
    },
    PlayerTwo: {
      PlayerID: p2,
      XLoc: -1,
      YLoc: -1,
      Score: 0
    }
  });

  return this.sessions[this.sessions.length-1];
};

/**
 * @function findGame
 * @memberof ActiveGames
 * @param {Object} pid - Player ID of Player 1.
 * @return {Object} - Selected game object or NULL.
 * @desc Search for a specific game session containing
 *  a given player ID.
 */
ActiveGames.prototype.findGame = function (pid) {
  for (var game of this.sessions) {
    // Check each game session for a matching player ID
    if ((game.PlayerOne.PlayerID === pid) || (game.PlayerTwo.PlayerID === pid)) {
      return game;
    } else {
      return 0;
    }
  }
};

// Make class available to server.js
module.exports = new ActiveGames();
