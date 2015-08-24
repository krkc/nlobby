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

  this.mainloop = null;
  this.keyIsPressed = [false, false, false, false];

  /**
   * @member gameSpeed
   * @memberof Game
   */
  this.gameSpeed = 1000;					/* Game speed in milliseconds */

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
    // Body...
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
    // 1. Player 2 chooses dot location.
    // 2. Player 1 presses a key.
    // 3. Main game loop begins.
    if (this.mainloop === null) {
      this.mainloop = setInterval(this.main.bind(this), this.gameSpeed);
    }
  };

  /**
   * @function main
   * @memberof Game
   * @desc Main server-side game loop.
   */
  Game.prototype.main = function () {
    // Update snake location.
    if (!this.PlayerOne.updateLoc(this.keyIsPressed)) {
      // Snake died. Initiate game over.
      console.log('Game: game over.');
      gameOver();
    } else {


      // // Test if colliding with dot.
      // if (PlayerOne.isColliding(PlayerTwo)) {
      //   // Dot collision detected. Increase score and respawn dot.
      //   PlayerOne.Score += 10;
      //   PlayerOne.grow();
      //   // TODO: Dot will be positioned next
      // }

      // Send outgoing packet with new coordinates to clients
      this.sendData({
        PlayerOne: {
          keyIsPressed: this.keyIsPressed,
          xLoc: this.PlayerOne.XLoc(),
          yLoc: this.PlayerOne.YLoc()
        },
        PlayerTwo: {
          xLoc: this.PlayerTwo.XLoc,
          yLoc: this.PlayerTwo.YLoc
        }
      });
    }
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
    // Initialize game loop
    this.init();

    // Update keyIsPressed with data from client
    this.keyIsPressed = dataIn;
  };
};



module.exports = Game;
