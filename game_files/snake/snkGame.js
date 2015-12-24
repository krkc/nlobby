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
  'use strict';

  var events = require('events');   /* Events middleware module */

  this.eventEmitter = new events.EventEmitter();  /* Event emitter object */

  var mainloop = null;    /* ID for setInterval callback (this.mainl) */
  var self = this;        /* Explicit reference to current context for calling setInterval */

  var readyPlayers = 0;   /* Players that are ready for play */

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
  var Snake = require('./snkSnake');
  this.PlayerOne = new Snake();
  this.PlayerOne.ID = p1;

  /**
   * @member PlayerTwo
   * @memberof Game
   */
  var Dot = require('./snkDot');
  this.PlayerTwo = new Dot();
  this.PlayerTwo.ID = p2;

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
  Game.prototype.gameOver = function ()
  {
    try {
      clearInterval(mainloop);
    }
    catch (e) {
      console.log('clearInterval failed:' + e.message);
    }
    // Inform clients that game has ended
    this.sendData({ GameOver: true });
  };

  /**
   * @function reset
   * @memberof Game
   * @desc Reset the game-state
   */
  Game.prototype.reset = function ()
  {
    // body...
  };

  /**
   * @function init
   * @memberof Game
   * @param {bool} noreset - Option to reset game or create new game
   * @desc Initialize the game environment prior to the game loop starting.
   */
  Game.prototype.init = function ()
  {
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
  Game.prototype.mainl = function ()
  {
    // Update snake location.
    if (!self.PlayerOne.updateLoc(self.keyIsPressed)) {
      // Snake died. Initiate game over.
      console.log('Game: game over.');
      self.gameOver();
    } else {
      // Send a standard game data message
      self.sendData();

      // Test if colliding with dot.
      if (self.PlayerOne.isColliding(self.PlayerTwo)) {
        // Dot collision detected. Increase score and respawn dot.
        self.PlayerOne.grow();
        // TODO: Dot no longer set. Decrease dot score over time until reset.
      }

    }
  };

  /**
   * @function sendData
   * @memberof Game
   * @param {Object} dataOut - Data going out to the client (optional)
   * @desc Send outgoing data to the client player
   */
  Game.prototype.sendData = function (dataOut)
  {
    // Send outgoing packet with new coordinates to clients
    if (dataOut) {
      this.eventEmitter.emit('dataFromGame', dataOut);
      console.log('Game: sent custom game data to client.');
    } else {
      this.eventEmitter.emit('dataFromGame', {
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
          set: self.PlayerTwo.isSet
        },
        Msg: {
          user: self.PlayerOne.ID,
          msg: self.Message
        }
      });
      console.log('Game: sent standard game data to client.');
    }

  };

  /**
   * @function receiveData
   * @memberof Game
   * @param {Object} dataIn - Data coming in from the client
   * @desc Receive and process incoming data sent from client player
   */
  Game.prototype.receiveData = function (dataIn) {

    if (dataIn.readyID) {
      // Game not yet ready, a player is ready to start game
      readyPlayers += 1;

      if (readyPlayers >= 2) {
        // Reset signal
        // Send updated data to clients
        console.log('receiveData: Both players acknowledged, game is ready.');
        this.sendData();
      } else {
        // Add player to count of ready players
        console.log('receiveData: readyPlayers < 2');
      }

    } else if (readyPlayers >= 2){
      // Game is ready or running

      if (dataIn.dot) {
        // Player two sent data
        this.PlayerTwo.XLoc = dataIn.dot.x;
        this.PlayerTwo.YLoc = dataIn.dot.y;
        this.PlayerTwo.DotSet = true;
        console.log('receiveData: click.');
      } else if (dataIn.snake) {
        // Player one sent data

        if (this.PlayerTwo.DotSet) {
          // Initialize game loop
          this.init();

          console.log('receiveData: keyIsPressed: ' + dataIn.snake.keyIsPressed);
          // Update keyIsPressed with data from client
          this.keyIsPressed = dataIn.snake.keyIsPressed;
        }
      } else {
        console.log('Game.receiveData(): problem with dataIn');
        // this.sendData({
        //   readyID: dataIn.readyID
        // });
      }
    }

  };

};


module.exports = Game;
