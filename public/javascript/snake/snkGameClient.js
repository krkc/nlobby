// -- Client-side --

/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */

function GameClient ()
{

  this.gamespeed = 200;    /* Default game speed */
  this.snake = {};       /* Player 1 (Snake) object */
  this.dot = {};         /* Player 2 (Dot) object */

  this.init = function ()
  {
    // Set the initial game speed
    this.gameSpeed = 200;

    // Set the initial snake properties
    this.snake = {
      id: null,
      xLoc: [-1, -1, -1], yLoc: [-1, -1, -1],
      lastxLoc: [-1, -1, -1], lastyLoc: [-1, -1, -1],
      score: 0
    };

    // Set the initial dot properties
    this.dot = {
      id: null,
      xLoc: -1, yLoc: -1,
      lastxLoc: -1, lastyLoc: -1,
      score: 0
    };

  };


  /**
   * @function gameOver
   * @param {Object} glfgc - OpenGL context
   * @param {Object} mloop - Reference ID for main loop
   * @desc Game has ended
   */
  function gameOver(mloop)
  {
  	// Stop game loop.
  	clearInterval(mloop);
  	// Display "Game Over".
  	toastScreen({ user: myID, msg: "Game Over."});
  }


  /*
  	Function:     stateReset()
  	Parameters:		None
  	Return:			  None
  	Description:	Reset game-state.
  */
  function stateReset()
  {
  	init('reset');
  }


  /**
   * @function update
   * @param {Object} data - Incoming data from server to update
   * @desc Update the screen with new server-side game state
   */
  this.update = function (data)
  {
  	// Update snake properties
  	snake.lastxLoc = snake.xLoc;
  	snake.xLoc = data.PlayerOne.xLoc;
  	snake.lastyLoc = snake.yLoc;
  	snake.yLoc = data.PlayerOne.yLoc;
  	// Update dot properties
  	dot.lastxLoc = dot.xLoc;
  	dot.xLoc = data.PlayerTwo.xLoc;
  	dot.lastyLoc = dot.yLoc;
  	dot.yLoc = data.PlayerTwo.yLoc;

  	// Update the scoreboard and player ids
  	if (myID === data.PlayerOne.id) {
  		snake.id = data.PlayerOne.id;
  		dot.id = data.PlayerTwo.id;
  	  console.log('my score update: ' + data.PlayerOne.score);
  		myscorespan.innerHTML = data.PlayerOne.score;
  		oppscorespan.innerHTML = data.PlayerTwo.score;
  	} else if (myID === data.PlayerTwo.id) {
  		snake.id = data.PlayerOne.id;
  		dot.id = data.PlayerTwo.id;
  		console.log('my score update: ' + data.PlayerTwo.score);
  		myscorespan.innerHTML = data.PlayerTwo.score;
  		oppscorespan.innerHTML = data.PlayerOne.score;
  	}
  };

}
