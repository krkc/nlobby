// -- Server-side --

//	-----------------------------------------------------
//	Class:		Snake()
//	Parameters:		None
//	Return:			None
//	Description:	Class representing Snake player.
//	-----------------------------------------------------
function Snake()
{

  var headx = 50;
  var heady = 95;

  this.xLoc = [rcux[headx],rcux[headx],rcux[headx],rcux[headx],rcux[headx]];
  this.yLoc = [rcuy[heady],rcuy[heady]+rcuy[5],rcuy[heady]+rcuy[5],rcuy[heady]+rcuy[5],rcuy[heady]+rcuy[5]];
  this.movingLeft = false;
  this.movingRight = false;
  this.movingUp = false;
  this.movingDown = false;

  // -- Private methods -- //

  /*
    Function:     moveSnake()
    Parameters:		string (direction)
    Return:			  none
    Description:	Calculate new snake block positions.
  */
  function moveSnake(direction)
  {
    // Reset moving flags.
    snake.movingUp = false;
    snake.movingDown = false;
    snake.movingLeft = false;
    snake.movingRight = false;

    // Move all snake blocks except head.
    var lastblock = snake.yLoc.length - 1;
    for (lastblock; lastblock > 0; lastblock--) {
      snake.xLoc[lastblock] = snake.xLoc[lastblock - 1];
      snake.yLoc[lastblock] = snake.yLoc[lastblock - 1];
    }

    // Move snake head block.
    if (direction == "up") {
      if (snake.yLoc[0] > rcuy[0])
        snake.yLoc[0] = rcuy[heady-=5];
      snake.movingUp = true;
    }
    else if (direction == "down") {
      if (snake.yLoc[0] < rcuy[95])
        snake.yLoc[0] = rcuy[heady+=5];
      snake.movingDown = true;
    }
    else if (direction == "left") {
      if (snake.xLoc[0] > rcux[0])
        snake.xLoc[0] = rcux[headx-=5];
      snake.movingLeft = true;
    } else {
      if (snake.xLoc[0] < rcux[95])
        snake.xLoc[0] = rcux[headx+=5];
      snake.movingRight = true;
    }

  }

  /*
    Function:     isEatingTail()
    Parameters:		none
    Return:			  bool
    Description:	Determine if snake has hit its tail or a wall.
  */
  function isEatingTail()
  {

    var snklen = snake.xLoc.length;

    for (var i = 1; i <= snklen - 1; i++) {
      if (rcux[headx] == snake.xLoc[i] && rcuy[heady] == snake.yLoc[i]) {
        return true;
      }
    }
    return false;

  }


  // -- Public methods -- //

  /*
    Function:     isColliding()
    Parameters:		Foreign object to test
    Return:			  bool - true for collision
    Description:	Detects whether snake is colliding
                  with dot.
  */
  this.isColliding = function(obj)
  {
    // If snake head is > dot x/y, or is < dot x/y + rcux/y[5]
    // then return true for colliding flag. else false.
    if (rcux[headx] >= obj.xLoc && rcux[headx] <= (obj.xLoc + rcux[2]) && rcuy[heady] >= obj.yLoc && rcuy[heady] <= (obj.yLoc + rcuy[2])) {
      return true;
    } else {
      return false;
    }
  }


  /*
    Function:     updateLoc()
    Parameters:		None
    Return:			  Bool - true for collision
    Description:	Update snake location each tick.
  */
  this.updateLoc = function()
  {
    if (keyIsPressed[0] == true && !this.movingDown) {
      // Move up
      moveSnake("up");
    }
    else if (keyIsPressed[1] == true && !this.movingUp) {
      // Move down
      moveSnake("down");
    }
    else if (keyIsPressed[2] == true && !this.movingRight) {
      // Move left
      moveSnake("left");
    }
    else if (keyIsPressed[3] == true && !this.movingLeft) {
      // Move right
      moveSnake("right");
    }
    else {
      // Continue moving.
      if (this.movingUp)
        moveSnake("up");
      if (this.movingDown)
        moveSnake("down");
      if (this.movingLeft)
        moveSnake("left");
      if (this.movingRight)
        moveSnake("right");
    }
    // Reset keypress flags.
    keyIsPressed[0] = false;
    keyIsPressed[1] = false;
    keyIsPressed[2] = false;
    keyIsPressed[3] = false;

    return !isEatingTail();
  }


  /*
    Function:     grow()
    Parameters:		None
    Return:			  None
    Description:	Increase length of snake tail by 3.
  */
  this.grow = function ()
  {
    var lastBlock = snake.xLoc.length - 1;
    for (var i=0; i<3; i++) {
      snake.xLoc.push(snake.xLoc[lastBlock]);
      snake.yLoc.push(snake.yLoc[lastBlock]);
    }
  }
}
