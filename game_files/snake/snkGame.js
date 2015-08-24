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

  var events = require('events');

  this.eventEmitter = new events.EventEmitter();

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
  this.PlayerOne = require('./snkSnake');
  this.PlayerOne.ID = p1;
  this.PlayerOne.Score = 0;

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
   * @function gameOver
   * @memberof Game
   * @desc End gameplay round
   */
  function gameOver()
  {
    // body...
  }

  /**
   * @function reset
   * @memberof Game
   * @desc Reset the game-state
   */
  function reset()
  {
    // body...
  }

  /**
   * @function init
   * @memberof Game
   * @param {bool} noreset - Option to reset game or create new game
   * @desc Initialize the game environment prior to the game loop starting.
   */
  Game.prototype.init = function () {
    // // Feed xLoc into rcu.x, and yLoc into rcu.y
    this.sendData({ test: 'test' });
  };

  /**
   * @function sendData
   * @memberof Game
   * @param {Object} dataOut - Data going out to the client
   * @desc Send outgoing data to the client player
   */
  Game.prototype.sendData = function (dataOut) {
    this.eventEmitter.emit('dataFromServer', dataOut);
    console.log('Game: sent data to server through eventEmitter.');
  };

  /**
   * @function receiveData
   * @memberof Game
   * @param {Object} dataIn - Data coming in from the client
   * @desc Receive and process incoming data sent from client player
   */
  Game.prototype.receiveData = function (dataIn) {
    var keyIsPressed = dataIn;

    // Update snake location.
    if (!this.PlayerOne.updateLoc(keyIsPressed)) {
      // Snake died. Initiate game over.
      gameOver(glfgc);
    }

    // // Test if colliding with dot.
    // if (PlayerOne.isColliding(PlayerTwo)) {
    //   // Dot collision detected. Increase score and respawn dot.
    //   PlayerOne.Score += 10;
    //   PlayerOne.grow();
    //   // TODO: Dot will be positioned next
    // }

    this.sendData({
      PlayerOne: {
        keyIsPressed: keyIsPressed,
        xLoc: this.PlayerOne.XLoc(),
        yLoc: this.PlayerOne.YLoc()
      },
      PlayerTwo: {
        xLoc: this.PlayerTwo.XLoc,
        yLoc: this.PlayerTwo.YLoc
      }
    });
  };

};



module.exports = Game;
