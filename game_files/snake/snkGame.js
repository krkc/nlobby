// -- Server-side --

/**
 * @file Manages the game state object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active game state
 * @class
 */
var Game = function () {

  var entity = require('./snkEntities.js');   /* Entities module */

  // Constants
  this.gameSpeed = 200;					/* Game speed in milliseconds */

  /** @member snake */
  this.snake;
  this.dot;

};

/**
 * @function init
 * @memberof Game
 * @param {bool} noreset - Option to reset game or create new game
 * @desc Initialize the game environment prior to the game loop starting.
 */
Game.prototype.init = function () {
  this.snake = new Snake();			/* Snake object */
  this.dot = {xLoc: rcux[Math.floor(Math.random() * 20) * 5], yLoc: rcuy[Math.floor(Math.random() * 20) * 5]};
};

/**
 * @function reset
 * @memberof Game
 * @desc Reset the game-state
 */
Game.prototype.reset = function () {
  // body...
};

module.exports = new Game();
