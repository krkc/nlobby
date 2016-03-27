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

  //var events = require('events');   /* Events middleware module */
  this.mainloop = null;    /* ID for setInterval callback (this.mainl) */
  this.readyPlayers = 0;   /* Players that are ready for play */

  this.keyIsPressed = [false, false, false, false];   /* Keypress flags */

  /**
   * @member gameSpeed
   * @memberof Game
   */
  this.gameSpeed = 800;					/* Game speed in milliseconds */

  /**
   * @member gameRunning
   * @memberof Game
   */
  this.gameRunning = false;					/* Game running status */

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
   * @member MsgTargetID
   * @memberof Game
   */
  this.MsgTargetID = null;

};  // End Game


/**
 * @function gameOver
 * @memberof Game
 * @desc End gameplay round
 */
Game.prototype.gameOver = function ()
{
  try {
    clearInterval(this.mainloop);
    this.mainloop = null;
  }
  catch (e) {
    console.log('clearInterval failed:' + e.message);
  }
  this.gameRunning = false;
  // Inform clients that game has ended
  this.Message = "Round Over";
  this.sendData({
    GameOver: true,
    Toast: {
      msg: this.Message
    }
  });
};

/**
 * @function reset
 * @memberof Game
 * @desc Reset the game-state
 */
Game.prototype.reset = function ()
{
  try {
    clearInterval(this.mainloop);
    this.mainloop = null;
  }
  catch (e) {
    console.log('clearInterval failed:' + e.message);
  }
  this.gameRunning = false;
  this.PlayerOne.setDefaults();
  this.PlayerTwo.setDefault();
  this.sendData({
    ResetAck: true
  });
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
  if (this.mainloop === null) {
    this.mainloop = setInterval(this.mainl.bind(this), this.gameSpeed);
  }
};

/**
 * @function main
 * @memberof Game
 * @desc Main server-side game loop.
 */
Game.prototype.mainl = function ()
{
  if (this.gameRunning) {
    // Update snake location.
    if (!this.PlayerOne.updateLoc(this.keyIsPressed)) {
      // Snake died. Initiate game over.
      this.gameOver();
    } else {
      // Test if colliding with dot.
      if (this.PlayerOne.isColliding(this.PlayerTwo)) {
        // Dot collision detected. Increase score and respawn dot.
        this.PlayerOne.grow();
        // Clear dot position until reset
        this.PlayerTwo.setDefault();
      }
      // Adjust dot score
      this.PlayerTwo.dotCheck();
      // Send 'StateUpdate' message to client
      this.sendData();
    }
  }
};  // End mainl

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
    // A non-standard message is being sent
    this.eventEmitter.emit('dataFromGame', dataOut);
  } else {
    // A standard game-state message is being sent
    this.eventEmitter.emit('dataFromGame', {
      StateUpdate: {
        playerone: {
          pid: this.PlayerOne.ID,
          xloc: this.PlayerOne.XLoc,
          yloc: this.PlayerOne.YLoc,
          score: this.PlayerOne.Score,
          direction: this.PlayerOne.Direction
        },
        playertwo: {
          pid: this.PlayerTwo.ID,
          xloc: this.PlayerTwo.XLoc,
          yloc: this.PlayerTwo.YLoc,
          score: this.PlayerTwo.Score,
          set: this.PlayerTwo.DotSet
        }
      }
    }); // End eventemiiter
  }
};  // End sendData

// Client message events

Game.prototype.onPlayerReady = function (ev)
{
  // -- Server message: 'PlayerReady' -- //
  // A player is ready, increment readyPlayer counter
  if (++this.readyPlayers >= 2) {
    // Start game
    this.init();
    // Send updated data to clients
    this.Message = "Click or touch anywhere to place dot and begin game.";
    this.MsgTargetID = this.PlayerTwo.ID;
    this.sendData({
      GameReady: {
        playerone: {
          pid: this.PlayerOne.ID
        },
        playertwo: {
          pid: this.PlayerTwo.ID
        }
      },
      Toast: {
        pid: this.MsgTargetID,
        msg: this.Message
      }
    });
  }
}; // End onPlayerReady

Game.prototype.onInput = function (ev)
{
  // -- Server message: 'Input' -- //
  if (ev.keybd) {
    if (ev.pid === this.PlayerOne.ID) {
      if (!this.gameRunning && this.PlayerTwo.DotSet) {
        this.gameRunning = true;
      }
      if (this.gameRunning) {
        this.keyIsPressed = ev.keybd.keys;
      }
    }
  }
  if (ev.mouse) {
    if (ev.pid === this.PlayerTwo.ID) {
      this.PlayerTwo.setValue(ev.mouse.x, ev.mouse.y);
      this.sendData();
    }
  }
  if (ev.touch) {
    if (ev.pid === this.PlayerOne.ID) {
      if (!this.gameRunning && this.PlayerTwo.DotSet) {
        this.gameRunning = true;
      }
      if (this.gameRunning) {
        this.keyIsPressed = ev.touch.pan.direction;
      }
    }
  }
}; // End onInput

Game.prototype.onResetRequest = function (ev)
{
  // -- Server message: 'ResetRequest' -- //
  // Perform reset
  this.reset();
}; // End onResetRequest


module.exports = Game;
