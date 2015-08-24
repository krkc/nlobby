// -- Client-side --

var rcu = {};

//	-----------------------------------------------------
//	Function:		init()
//	Parameters:		bool
//	Return:			None
//	Description:	Initialize the game environment prior
//					to main game loop starting.
//	-----------------------------------------------------


function init(type) {

	// -- Private data members --

	var wWidth = window.innerWidth;										/* Window width */
	var wHeight = window.innerHeight;									/* Window height */
	var canvbg = document.getElementById("canvbg");		/* Page Canvas objects */
	var canvfg = document.getElementById("canvfg");

	var gameSpeed = 200;


	if (!type) {
		// Register event listener for keypresses and touches.
		window.addEventListener("keydown",onKeyDown,true);

		// Register event listener for window resize.
		window.addEventListener("resize", onResize, true);

		this.scorespan = document.getElementById("scorespan");		/* Player Score html element */
	}

	// Specify canvas size based on window size.
	canvbg.setAttribute('width', wWidth-Math.floor(wWidth * 0.1));
	canvfg.setAttribute('width', wWidth-Math.floor(wWidth * 0.1));
	canvbg.setAttribute('height', wHeight-Math.floor(wHeight * 0.1));
	canvfg.setAttribute('height', wHeight-Math.floor(wHeight * 0.1));

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

	rcu = RCU(canvfg.clientHeight, canvfg.clientWidth);

	this.bgStateChanged = true;

	if (this.glfg && this.glbg) {
		// When all assets are loaded, draw the background
		//   and begin the game loop.
		main();
		this.mainloop = setInterval(main, gameSpeed);
	}

}

//	-----------------------------------------------------
//	Function:		RCU()
//	Parameters:		cHeight, cWidth
//	Return:			JSON Object
//	Description:	Defines units relative to the game
//                canvas. (Relative Canvas Units)
//	-----------------------------------------------------


function RCU(cHeight, cWidth)
{

	var rcux = [];
	var rcuy = [];

  while (rcux.length > 0)
    rcux.pop();
  while (rcuy.length > 0)
    rcuy.pop();

  for (var i = 0; i <= 1.01; i += 0.01) {
      rcux.push(Math.floor(cWidth * i));
      rcuy.push(Math.floor(cHeight * i));
  }
	return { x: rcux, y: rcuy };

}


//	-----------------------------------------------------
//	Function:		main()
//	Parameters:		None
//	Return:			None
//	Description:	Main loop for the game logic.
//	-----------------------------------------------------

function main()
{

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
function drawbg(glbgc)
{

	// Paint background.

	glbgc.font="20px Arial";
	glbgc.fillStyle="#aaaaaa";
	glbgc.fillRect(rcu.x[0], rcu.y[0], rcu.x[100], rcu.y[100]);	/* x,y,w,h */


	// Draw grid lines.

	for (var x = 5; x < 100; x += 5) {
		glbgc.beginPath();
		glbgc.moveTo(rcu.x[x], rcu.y[0]);
		glbgc.lineTo(rcu.x[x], rcu.y[100]);
		glbgc.stroke();
	}
	for (var y = 5; y < 100; y += 5) {
		glbgc.beginPath();
		glbgc.moveTo(rcu.x[0], rcu.y[y]);
		glbgc.lineTo(rcu.x[100], rcu.y[y]);
		glbgc.stroke();
	}

}


//	-----------------------------------------------------
//	Function:		drawfg()
//	Parameters:		opengl context
//	Return:			None
//	Description:	Draw elements within the canvas area.
//	-----------------------------------------------------
function drawfg(glfgc)
{

	// Clear previously drawn player.
	for (var i = 0; i < snake.xLoc.length; i++) {
		glfgc.clearRect(rcu.x[snake.lastxLoc[i]], rcu.y[snake.lastyLoc[i]], rcu.x[5], rcu.y[5]);
	}

	// Clear dot
	glfgc.clearRect(rcu.x[dot.lastxLoc], rcu.y[dot.lastyLoc], rcu.x[5], rcu.y[5]);


	// Draw new player position.
	glfgc.fillStyle="#000000";
	for (var j = 0; j < snake.xLoc.length; j++) {
		glfgc.fillRect(rcu.x[snake.xLoc[j]], rcu.y[snake.yLoc[j]], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
	}

	// Redraw dot
	glfgc.fillStyle="#000000";
	glfgc.fillRect(rcu.x[dot.xLoc], rcu.x[dot.yLoc], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
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
	glfgc.fillText("Game Over", rcu.x[45], rcu.y[50]);
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
	var keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */

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
	dataToServer(keyIsPressed);
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
	init('resize');
}
