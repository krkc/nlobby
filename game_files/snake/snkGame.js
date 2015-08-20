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
var Game = function (p1, p2) {

  //var entity = require('./snkEntities.js');   /* Entities module */

  // Constants
  this.gameSpeed = 200;					/* Game speed in milliseconds */

  this.GameID = p1.toString() + p2.toString();

  this.PlayerOne = {
    ID: p1,
    XLoc: -1,
    YLoc: -1,
    Score: 0
  };

  this.PlayerTwo = {
    ID: p2,
    XLoc: -1,
    YLoc: -1,
    Score: 0
  };

  /** @member snake */
  //this.snake;
  //this.dot;

};

/**
 * @function init
 * @memberof Game
 * @param {bool} noreset - Option to reset game or create new game
 * @desc Initialize the game environment prior to the game loop starting.
 */
Game.prototype.init = function () {
  this.snake = new Snake();			/* Snake object */
  // Feed xLoc into rcu.x, and yLoc into rcu.y
  this.dot = { xLoc: Math.floor(Math.random() * 20) * 5, yLoc: Math.floor(Math.random() * 20) * 5 };
};

/**
 * @function reset
 * @memberof Game
 * @desc Reset the game-state
 */
Game.prototype.reset = function () {
  // body...
};

module.exports = Game;
