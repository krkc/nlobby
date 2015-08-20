/**
 * @file Manages the game session object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


/**
 * Represents an active game session
 * @class
 */
var SnakeGame = function ()
{

  var game = require('snkGame.js');   /* Game state object */

  // Relative canvas units
  var rcux = [];
  var rcuy = [];

  // Generate relative canvas units
  RCU(cHeight, cWidth);

  // Initialize the game environment
  game.init();

  function main() {
    // Update snake location.
    if (!snake.updateLoc()) {
      // Snake died. Initiate game over.
      gameOver(glfgc);
    }

    // Test if colliding with dot.
    if (snake.isColliding(dot)) {
      // Dot collision detected. Increase score and respawn dot.
      runningScore += 10;
      scorespan.innerHTML = runningScore;
      snake.grow();
      dot.xLoc = rcux[Math.floor(Math.random() * 20) * 5];
      dot.yLoc = rcuy[Math.floor(Math.random() * 20) * 5];
    }
  }

};

/**
 * @function init
 * @memberof Game
 * @param
 * @desc Initialize the game session.
 */
SnakeGame.prototype.init = function () {
  game.init();
};



module.exports = new SnakeGame();
