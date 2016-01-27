/**
 * @file Manages the active game sessions
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active game session.
 * @class ActiveGames
 */

var ActiveGames = function () {
  'use strict';

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
  var Game;
  var gamedir;

  if (gametype === 'snake') {
    // TODO: look into using process.fork() for multi-process game instance creation
    gamedir = 'snake/snkGame'; /* Game state module */
  }
  if (gametype === 'dngn') {
    gamedir = 'dngn/DngnGame';
  }

  Game = require('../game_files/' + gamedir);

  if (Game) {
    // Create new game state object and add to list
    // TODO: Eventually move persistent data to redis or sqlite
    if (Game.Game) {
      // TypeScript
      this.sessions.push(
          new Game.Game(p1, p2)
      );
    } else {
      this.sessions.push(
          new Game(p1, p2)
      );
    }

    var newGame = this.sessions[this.sessions.length-1];
    newGame.nlgPlayerOne = { ID: p1 };
    newGame.nlgPlayerTwo = { ID: p2 };

    return newGame;
  }
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
    if ((game.nlgPlayerOne.ID === pid) || (game.nlgPlayerTwo.ID === pid)) {
      return game;
    } else {
      return null;
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
  if (this.sessions[this.sessions.indexOf(game)]) {
    // Destroy the game object, but the array position still needs removed
    this.sessions[this.sessions.indexOf(game)].eventEmitter.removeListener('dataFromServer', function () {
      console.log('ActiveGames.removeGame: event listener removed');
    });
    var gameToRemove = this.sessions[this.sessions.indexOf(game)];
    // This removes the now empty array position
    this.sessions.splice(gameToRemove,1);
    gameToRemove = null;
  }
};

// Make class available to server.js
module.exports = new ActiveGames();
