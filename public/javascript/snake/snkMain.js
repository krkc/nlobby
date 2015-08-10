//	-----------------------------------------------------
//	Function:		init()
//	Parameters:		bool
//	Return:			None
//	Description:	Initialize the game environment prior
//					to main game loop starting.
//	-----------------------------------------------------

var rcux = [];
var rcuy = [];

function init(noreset) {

	// -- Private data members --

	var wWidth = window.innerWidth;										/* Window width */
	var wHeight = window.innerHeight;									/* Window height */
	var canvbg = document.getElementById("canvbg");		/* Page Canvas objects */
	var canvfg = document.getElementById("canvfg");


	if (!noreset) {
		// Register event listener for keypresses and touches.
		window.addEventListener("keydown",onKeyDown,true);

		// Register event listener for window resize.
		window.addEventListener("resize", onResize, true);

		this.scorespan = document.getElementById("scorespan");		/* Player Score html element */
	}

	// Specify canvas size based on window size.
	canvbg.setAttribute('width', wWidth-Math.floor(wWidth * .1));
	canvfg.setAttribute('width', wWidth-Math.floor(wWidth * .1));
	canvbg.setAttribute('height', wHeight-Math.floor(wHeight * .1));
	canvfg.setAttribute('height', wHeight-Math.floor(wHeight * .1));

	// Establish a 2D drawing context.
	try {
		this.glbg = canvbg.getContext("2d");
		this.glfg = canvfg.getContext("2d");				/* Drawing context object */
	}
	catch(e){
		console.log("Error establishing drawing context.");
	}


	// -- Public data members --

	this.runningScore = 0;				/* Player score in memory */
	scorespan.innerHTML = runningScore;

	// Constants
	this.gameSpeed = 200;					/* Game speed in milliseconds */

	// Useful precomputed values.
	this.cWidth = canvfg.clientWidth;						/* Canvas width */
	this.cHeight = canvfg.clientHeight;					/* Canvas height*/

	RCU(cHeight, cWidth);

	this.snake = new Snake();			/* Snake object */
	this.dot = {xLoc: rcux[Math.floor(Math.random() * 20) * 5], yLoc: rcuy[Math.floor(Math.random() * 20) * 5]};

	this.keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */
	this.bgStateChanged = true;

	if (this.glfg && this.glbg) {
		// When all assets are loaded, draw the background
		//   and begin the game loop.
		main();
		this.mainloop = setInterval(main, gameSpeed);
	}

}


//	-----------------------------------------------------
//	Function:		main()
//	Parameters:		None
//	Return:			None
//	Description:	Main loop for the game logic.
//	-----------------------------------------------------

function main() {

	// Redraw scene if states changed.
	if (bgStateChanged) {
		// Draw the canvas background.
		drawbg(this.glbg);
		bgStateChanged = false;
	}

	// Draw the canvas foreground.
	drawfg(this.glfg);

}


//	-----------------------------------------------------
//	Function:		drawbg()
//	Parameters:		opengl context
//	Return:			None
//	Description:	Draw background elements within the
//					canvas area.
//	-----------------------------------------------------
function drawbg(glbgc) {

	// Paint background.

	glbgc.font="20px Arial";
	glbgc.fillStyle="#aaaaaa";
	glbgc.fillRect(rcux[0], rcuy[0], rcux[100], rcuy[100]);	/* x,y,w,h */


	// Draw grid lines.

	for (var x = 5; x < 100; x += 5) {
		glbgc.beginPath();
		glbgc.moveTo(rcux[x], rcuy[0]);
		glbgc.lineTo(rcux[x], rcuy[100]);
		glbgc.stroke();
	}
	for (var y = 5; y < 100; y += 5) {
		glbgc.beginPath();
		glbgc.moveTo(rcux[0], rcuy[y]);
		glbgc.lineTo(rcux[100], rcuy[y]);
		glbgc.stroke();
	}

}


//	-----------------------------------------------------
//	Function:		drawfg()
//	Parameters:		opengl context
//	Return:			None
//	Description:	Draw elements within the canvas area.
//	-----------------------------------------------------
function drawfg(glfgc) {

	// Clear previously drawn player.
	for (var i = 0; i < snake.xLoc.length; i++) {
		glfgc.clearRect(snake.xLoc[i], snake.yLoc[i], rcux[5], rcuy[5]);
	}

	// Clear dot
	glfgc.clearRect(dot.xLoc, dot.yLoc, rcux[5], rcuy[5]);

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

	// Draw new player position.
	glfgc.fillStyle="#000000";
	for (var i = 0; i < snake.xLoc.length; i++) {
		glfgc.fillRect(snake.xLoc[i], snake.yLoc[i], rcux[5], rcuy[5]);			/* x,y,w,h */
	}

	// Redraw dot
	glfgc.fillStyle="#000000";
	glfgc.fillRect(dot.xLoc, dot.yLoc, rcux[5], rcuy[5]);			/* x,y,w,h */
}


/*
	Function:     gameOver()
	Parameters:		opengl context
	Return:			  None
	Description:	Game has ended.
*/
function gameOver(glfgc)
{
	// Stop game loop.
	clearInterval(mainloop);

	// Display "Game Over".
	glfgc.font = "2em Comic Sans MS";
	glfgc.fillStyle="#FF5555";
	glfgc.fillText("Game Over", rcux[45], rcuy[50]);
}


/*
	Function:     stateReset()
	Parameters:		None
	Return:			  None
	Description:	Reset game-state.
*/
function stateReset()
{
	init();
}


// ----- JavaScript Client Events ----- //

/*
	Function:			onkeyDown()
	Parameters:		event parameters
	Return:				None
	Description:	Handle keyboard keypress down event.
*/
function onKeyDown(e)
{

	// ---- Arrow Key --------------
	if (e.keyCode == 38) {
		e.preventDefault();
		// Toggle "move up" keypress state.
		keyIsPressed[0] = true;
	}
	if (e.keyCode == 40) {
		e.preventDefault();
		// Toggle "move down" keypress state.
		keyIsPressed[1] = true;
	}
	if (e.keyCode == 37) {
		e.preventDefault();
		// Toggle "move left" keypress state.
		keyIsPressed[2] = true;
	}
	if (e.keyCode == 39) {
		e.preventDefault();
		// Toggle "move right" keypress state.
		keyIsPressed[3] = true;
	}
}


/*
	Function:     onResize()
	Parameters:		None
	Return:			  None
	Description:	Called upon window resize. Resizes and redraws
								game canvas.
*/
function onResize()
{

	// Reinitialize scene.
	init(true);
}
