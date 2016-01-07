// -- Client-side --

/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */

function GameMain ()
{

  var gameReadyFlag = false;    /* Client is ready status */

  this.gamespeed = 200;    /* Default game speed */
  var snake = {};       /* Player 1 (Snake) object */
  var dot = {};         /* Player 2 (Dot) object */



  this.init = function ()
  {
    // Set the initial game speed
    this.gameSpeed = 200;

    // Set the initial snake properties
    snake = {
      id: null,
      xLoc: [-1, -1, -1], yLoc: [-1, -1, -1],
      lastxLoc: [-1, -1, -1], lastyLoc: [-1, -1, -1],
      score: 0
    };

    // Set the initial dot properties
    dot = {
      id: null,
      xLoc: -1, yLoc: -1,
      lastxLoc: -1, lastyLoc: -1,
      score: 0
    };

    gameReadyFlag = true;

  };


  /**
   * @function gameOver
   * @param {Object} glfgc - OpenGL context
   * @param {Object} mloop - Reference ID for main loop
   * @desc Game has ended
   */
  function gameOver()
  {

  	// Display "Game Over".
    var toaster = new CustomEvent("toast", {
      detail: {
        user: "all",
        msg: "Game Over."
      }
    });
    dispatchEvent(toaster);
  }


  /**
   * @function update
   * @param {Object} data - Incoming data from server to update
   * @desc Update the screen with new server-side game state
   */
  this.update = function (data, myID)
  {
    // Check if game has ended
    if (data.GameOver) {
      gameOver();
    } else {
      // Update snake properties


      if (snake.lastxLoc.length !== snake.xLoc.length) {
        // Reconnect arrays if needed
        snake.lastxLoc = null;
        snake.lastyLoc = null;
        snake.lastxLoc = snake.xLoc;
        snake.lastyLoc = snake.yLoc;
      }
      // Make a deep copy of arrays if needed
      if (snake.lastxLoc.length !== data.PlayerOne.xLoc.length) {
        snake.lastxLoc = deepCopy(snake.xLoc);
        snake.lastyLoc = deepCopy(snake.yLoc);
      }

      snake.xLoc = data.PlayerOne.xLoc;
      snake.yLoc = data.PlayerOne.yLoc;

      snake.score = data.PlayerOne.score;
    	// Update dot properties
    	dot.lastxLoc = dot.xLoc;
    	dot.xLoc = data.PlayerTwo.xLoc;
    	dot.lastyLoc = dot.yLoc;
    	dot.yLoc = data.PlayerTwo.yLoc;
      dot.score = data.PlayerTwo.score;

    	// Update the scoreboard and player ids

    	if (myID === data.PlayerOne.id) {
    		snake.id = data.PlayerOne.id;
    		dot.id = data.PlayerTwo.id;
    		myscorespan.innerHTML = data.PlayerOne.score;
    		oppscorespan.innerHTML = data.PlayerTwo.score;
    	} else if (myID === data.PlayerTwo.id) {
    		snake.id = data.PlayerOne.id;
    		dot.id = data.PlayerTwo.id;
    		myscorespan.innerHTML = data.PlayerTwo.score;
    		oppscorespan.innerHTML = data.PlayerOne.score;
    	} else {
        // Something went wrong, print debug info
        console.log("Error in client.update():" + myID + " and " + data.PlayerOne.id + " and " + data.PlayerTwo.id);
      }
    }
  };

  function deepCopy (arrIn)
  {
    var newArr = [];
    for (var i = 0; i < arrIn.length; i++) {
      newArr.push(arrIn[i]);
    }
    return newArr;
  }


  /**
   * @function getCoords
   * @param {String} entity - Entity we needs coordinates from
   * @return {Object} Coordinates of the specified entity
   * @desc Retrieve the coordinates of a specified entity
   */
  this.getCoords = function (entity)
  {
    if (entity === 'snake') {
      return {
        xLoc: snake.xLoc,
        lastxLoc: snake.lastxLoc,
        yLoc: snake.yLoc,
        lastyLoc: snake.lastyLoc
      };
    } else if (entity === 'dot') {
      return {
        xLoc: dot.xLoc,
        lastxLoc: dot.lastxLoc,
        yLoc: dot.yLoc,
        lastyLoc: dot.lastyLoc
      };
    }
  };

  /**
   * @function getRole
   * @param {String} entity - Entity we needs coordinates from
   * @return {Object} Coordinates of the specified entity
   * @desc Retrieve the coordinates of a specified entity
   */
  this.getRole = function (id)
  {
    if (snake.id === id) {
      // return snake
      return 'snake';
    } else if (dot.id === id) {
      // return dot
      return 'dot';
    }
  };

  /**
   * @function ready
   * @memberof GameMain
   * @return {Boolean} - Ready status of game client
   * @desc Returns the ready status of the game client
   */
  this.ready = function ()
  {
    if (gameReadyFlag) {
      return true;
    } else {
      return false;
    }
  };

}
