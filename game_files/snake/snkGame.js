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

  var entity = require('./snkEntities.js');   /* Entities module */

  /**
   * @member gameSpeed
   * @memberof Game
   */
  this.gameSpeed = 200;					/* Game speed in milliseconds */

  /**
   * @member GameID
   * @memberof Game
   */
  this.GameID = p1.toString() + p2.toString();

  /**
   * @member PlayerOne
   * @memberof Game
   */
  this.PlayerOne = {
    ID: p1,
    XLoc: -1,
    YLoc: -1,
    Score: 0
  };

  /**
   * @member PlayerTwo
   * @memberof Game
   */
  this.PlayerTwo = {
    ID: p2,
    XLoc: -1,
    YLoc: -1,
    Score: 0
  };

  /**
   * @member Snake
   * @memberof Game
   */
  //this.Snake;
  /**
   * @member Dot
   * @memberof Game
   */
  //this.Dot;

  /**
   * @function reset
   * @memberof Game
   * @desc Reset the game-state
   */
  function reset()
  {
    // body...
  }

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
 * @function receiveData
 * @memberof Game
 * @param {Object} dataIn - Data coming in from the client
 * @desc Receive and process incoming data sent from client player
 */
Game.prototype.receiveData = function (dataIn) {
  // body...
};

/**
 * @function sendData
 * @memberof Game
 * @param {Object} dataOut - Data going out to the client
 * @desc Send outgoing data to the client player
 */
Game.prototype.sendData = function (dataOut) {
  // body...
};

module.exports = Game;

// // TODO: Move this logic into Game's main loop
// // Initialize the game environment
// game.init();
//
// function main() {
//   // Update snake location.
//   if (!snake.updateLoc()) {
//     // Snake died. Initiate game over.
//     gameOver(glfgc);
//   }
//
//   // Test if colliding with dot.
//   if (snake.isColliding(dot)) {
//     // Dot collision detected. Increase score and respawn dot.
//     runningScore += 10;
//     scorespan.innerHTML = runningScore;
//     snake.grow();
//     dot.xLoc = Math.floor(Math.random() * 20) * 5;
//     dot.yLoc = Math.floor(Math.random() * 20) * 5;
//   }
// }
