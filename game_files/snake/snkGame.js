// -- Server-side --

/**
 * @file Manages the game state object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


/**
 * Represents an active game state
 * @class
 */
var Game = function (p1, p2) {

  var events = require('events');   /* Events middleware module */

  this.eventEmitter = new events.EventEmitter();  /* Event emitter object */

  var mainloop = null;    /* ID for setInterval callback (this.mainl) */
  var self = this;        /* Explicit reference to current context for calling setInterval */

  this.keyIsPressed = [false, false, false, false];   /* Keypress flags */

  /**
   * @member gameSpeed
   * @memberof Game
   */
  this.gameSpeed = 800;					/* Game speed in milliseconds */

  /**
   * @member GameID
   * @memberof Game
   */
  this.GameID = p1.toString() + p2.toString();

  /**
   * @member PlayerOne
   * @memberof Game
   */
  var snake = require('./snkSnake');
  this.PlayerOne = new snake();
  this.PlayerOne.ID = p1;

  /**
   * @member PlayerTwo
   * @memberof Game
   */
  this.PlayerTwo = {
    ID: p2,
    XLoc: 50,
    YLoc: 40,
    Score: 0,
    Set: false
  };

  /**
   * @member Message
   * @memberof Game
   */
  this.Message = null;


  /**
   * @function gameOver
   * @memberof Game
   * @desc End gameplay round
   */
  function gameOver()
  {
    try {
      clearInterval(mainloop);
    }
    catch (e) {
      console.log('clearInterval failed:' + e.message);
    }
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
    if (mainloop === null) {
      mainloop = setInterval(this.mainl, this.gameSpeed);
    }
  };

  /**
   * @function main
   * @memberof Game
   * @desc Main server-side game loop.
   */
  Game.prototype.mainl = function () {
    // Update snake location.
    if (!self.PlayerOne.updateLoc(self.keyIsPressed)) {
      // Snake died. Initiate game over.
      console.log('Game: game over.');
      gameOver();
    } else {


      // Test if colliding with dot.
      if (self.PlayerOne.isColliding(self.PlayerTwo)) {
        // Dot collision detected. Increase score and respawn dot.
        self.PlayerOne.grow();
        // TODO: Dot will be positioned next
      }

      // Send outgoing packet with new coordinates to clients
      self.sendData({
        PlayerOne: {
          keyIsPressed: self.keyIsPressed,
          id: self.PlayerOne.ID,
          xLoc: self.PlayerOne.XLoc(),
          yLoc: self.PlayerOne.YLoc(),
          score: self.PlayerOne.Score()
        },
        PlayerTwo: {
          id: self.PlayerTwo.ID,
          xLoc: self.PlayerTwo.XLoc,
          yLoc: self.PlayerTwo.YLoc,
          score: self.PlayerTwo.Score,
          set: self.PlayerTwo.Set
        },
        Msg: {
          user: self.PlayerOne.ID,
          msg: self.Message
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
    console.log('receiveData: keyIsPressed: ' + dataIn);
    // Update keyIsPressed with data from client
    this.keyIsPressed = dataIn;
  };
};



module.exports = Game;
