// -- Server-side --

//	-----------------------------------------------------
//	Class:		Snake()
//	Parameters:		None
//	Return:			None
//	Description:	Class representing Snake player.
//	-----------------------------------------------------
var Snake = function ()
{

  // For a 100x100 map, each square is 5
  var headx = 45;   /* Starting position on x-axis */
  var heady = 95;   /* Starting position on y-axis */

  xLoc = [headx, headx, headx, headx, headx];
  yLoc = [heady, heady, heady, heady, heady];
  movingLeft = false;
  movingRight = false;
  movingUp = false;
  movingDown = false;

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
    movingUp = false;
    movingDown = false;
    movingLeft = false;
    movingRight = false;

    // Move all snake blocks except head.
    var lastblock = yLoc.length - 1;
    for (lastblock; lastblock > 0; lastblock--) {
      xLoc[lastblock] = xLoc[lastblock - 1];
      yLoc[lastblock] = yLoc[lastblock - 1];
    }

    // Move snake head block.
    if (direction == "up") {
      if (yLoc[0] > 0)
        yLoc[0] = heady-=5;
      movingUp = true;
    }
    else if (direction == "down") {
      if (yLoc[0] < 95)
        yLoc[0] = heady+=5;
      movingDown = true;
    }
    else if (direction == "left") {
      if (xLoc[0] > 0)
        xLoc[0] = headx-=5;
      movingLeft = true;
    } else {
      if (xLoc[0] < 95)
        xLoc[0] = headx+=5;
      movingRight = true;
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

    var snklen = xLoc.length;

    for (var i = 1; i <= snklen - 1; i++) {
      if (headx == xLoc[i] && heady == yLoc[i]) {
        return true;
      }
    }
    return false;

  }


  // -- Public methods -- //

  /**
    @function isColliding
    @memberof Snake
    @param {object} obj - Foreign object to test
    @return {bool} true for collision
    @desc Detects whether snake is colliding with dot.
  */
  this.isColliding = function(obj)
  {
    // If snake head is > dot x/y, or is < dot x/y + rcux/y[5]
    // then return true for colliding flag. else false.
    if (headx >= obj.xLoc && headx <= (obj.xLoc + 2) && heady >= obj.yLoc && heady <= (obj.yLoc + 2)) {
      return true;
    } else {
      return false;
    }
  };


  /**
    @function updateLoc
    @memberof Snake
    @return {bool} true for collision
    @desc Update snake location each tick.
  */
  this.updateLoc = function(keyIsPressed)
  {
    console.log('updateLoc: keyIsPressed: ' + keyIsPressed);
    if (keyIsPressed[0] === true && !movingDown) {
      // Move up
      moveSnake("up");
    }
    else if (keyIsPressed[1] === true && !movingUp) {
      // Move down
      moveSnake("down");
    }
    else if (keyIsPressed[2] === true && !movingRight) {
      // Move left
      moveSnake("left");
    }
    else if (keyIsPressed[3] === true && !movingLeft) {
      // Move right
      moveSnake("right");
    }
    else {
      // Continue moving.
      if (movingUp)
        moveSnake("up");
      if (movingDown)
        moveSnake("down");
      if (movingLeft)
        moveSnake("left");
      if (movingRight)
        moveSnake("right");
    }
    // Reset keypress flags.
    keyIsPressed[0] = false;
    keyIsPressed[1] = false;
    keyIsPressed[2] = false;
    keyIsPressed[3] = false;

    return !isEatingTail();
  };


  /*
    Function:     grow()
    Parameters:		None
    Return:			  None
    Description:	Increase length of snake tail by 3.
  */
  this.grow = function ()
  {
    var lastBlock = xLoc.length - 1;
    for (var i=0; i<3; i++) {
      xLoc.push(xLoc[lastBlock]);
      yLoc.push(yLoc[lastBlock]);
    }
  };

  /**
   * @function XLoc
   * @memberof Snake
   * @return {Array} - x-axis locations of snake blocks
   * @desc Getter for current snake x-axis location
   */
  this.XLoc = function () {
    return xLoc;
  };

  /**
   * @function YLoc
   * @memberof Snake
   * @return {Array} - y-axis locations of snake blocks
   * @desc Getter for current snake y-axis location
   */
  this.YLoc = function() {
    return yLoc;
  };
};

module.exports = new Snake();