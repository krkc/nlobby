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
ActiveGames.prototype.newGame = function (gametype, p1, p2) {
  var game;

  if (gametype === 'snakegame') {
    game = require('../game_files/snake/snkGame'); /* Game state module */
  }

  // Create new game state object and add to list
  // Eventually move to redis
  this.sessions.push(
    new game(p1, p2)
  );

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
    //Check each game session for a matching player ID
    if ((game.PlayerOne.ID === pid) || (game.PlayerTwo.ID === pid)) {
      return game;
    } else {
      return 0;
    }
  }
};

/**
 * @function removeGame
 * @memberof ActiveGames
 * @param {Object} pid - Player ID of Player 1.
 * @return {Object} - Selected game object or NULL.
 * @desc Remove a game from the list when no longer being played
 */
ActiveGames.prototype.removeGame = function (game) {
  // Destroy the game object, but the array position still needs removed
  this.sessions[this.sessions.indexOf(game)] = null;
  // This removes the now empty array position
  this.sessions.splice(this.sessions.indexOf(game),1);
};

// Make class available to server.js
module.exports = new ActiveGames();
