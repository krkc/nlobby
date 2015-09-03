// -- Client-side --

/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


var rcu = {};
var mc = {};
var client = {};

var myscorespan = null;
var oppscorespan = null;


//	-----------------------------------------------------
//	Function:		init()
//	Parameters:		bool
//	Return:			None
//	Description:	Initialize the game environment prior
//					to main game loop starting.
//	-----------------------------------------------------


function init(type) {

	var wWidth = window.innerWidth;										/* Window width */
	var wHeight = window.innerHeight;									/* Window height */
	var canvbg = document.getElementById("canvbg");		/* Page Canvas objects */
	var canvfg = document.getElementById("canvfg");


	if (!type) {
		// Register event listener for keypresses, clicks, and touches.
		window.addEventListener("keydown", onKeyDown, true);
		canvfg.addEventListener("click", onClick, true);

		// Register event listener for window resize.
		window.addEventListener("resize", onResize, true);

		myscorespan = document.getElementById("myscorespan");		/* Player 1 Score html element */
		oppscorespan = document.getElementById("oppscorespan");		/* Player 2 Score html element */
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

	// Set the initial scoreboard
	myscorespan.innerHTML = 0;
	oppscorespan.innerHTML = 0;

	mc = new Hammer(canvfg);
	mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

	// Hammerjs swipe event handler
	mc.on("panleft panright panup pandown", onPan);

	client = new GameClient();
	client.init();

	rcu = RCU(canvfg.clientHeight, canvfg.clientWidth);

	bgStateChanged = true;

	if (this.glfg && this.glbg) {
		// When all assets are loaded, draw the background
		//   and begin the game loop.
		main();
		this.mainloop = setInterval(main, client.gameSpeed);
	}

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
	for (var i = 0; i < client.snake.xLoc.length; i++) {
		glfgc.clearRect(rcu.x[client.snake.lastxLoc[i]], rcu.y[client.snake.lastyLoc[i]], rcu.x[5], rcu.y[5]);
	}

	// Clear dot
	glfgc.clearRect(rcu.x[client.dot.lastxLoc], rcu.y[client.dot.lastyLoc], rcu.x[5], rcu.y[5]);


	// Draw new player position.
	glfgc.fillStyle="#000000";
	for (var j = 0; j < client.snake.xLoc.length; j++) {
		glfgc.fillRect(rcu.x[client.snake.xLoc[j]], rcu.y[client.snake.yLoc[j]], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
	}

	// Redraw dot
	glfgc.fillStyle="#000000";
	glfgc.fillRect(rcu.x[client.dot.xLoc], rcu.y[client.dot.yLoc], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
}


/**
 * @function toastScreen
 * @param {Object} user - Recipient of the message
 * @param {Object} data - Message to send to screen
 * @desc Draws a message box with a message on player's game canvas
 */
function toastScreen (msg)
{
	if (msg.user === myID) {
		this.glfg.font="20px Arial";
		this.glfg.fillStyle="#888888";
		this.glfg.fillRect(rcu.x[40], rcu.y[40], rcu.x[20], rcu.y[20]);	/* x,y,w,h */
		// print msg for current player
		this.glfg.fillText(msg.msg, rcu.x[45], rcu.y[50]);
	}
}


// ----- JavaScript Client Events ----- //

/**
 * @function onkeyDown
 * @param {Event} e - Event object for keypress event
 * @desc Handle keyboard keypress down event.
*/
function onKeyDown (e)
{
	var keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */

	// ---- Arrow Key --------------
	if (e.keyCode == 38) {
		e.preventDefault();
		// Toggle "move up" keypress state.
		keyIsPressed[0] = true;
		dataToServer(keyIsPressed);
	}
	if (e.keyCode == 40) {
		e.preventDefault();
		// Toggle "move down" keypress state.
		keyIsPressed[1] = true;
		dataToServer(keyIsPressed);
	}
	if (e.keyCode == 37) {
		e.preventDefault();
		// Toggle "move left" keypress state.
		keyIsPressed[2] = true;
		dataToServer(keyIsPressed);
	}
	if (e.keyCode == 39) {
		e.preventDefault();
		// Toggle "move right" keypress state.
		keyIsPressed[3] = true;
		dataToServer(keyIsPressed);
	}
}


/**
 * @function onClick
 * @param {Event} e - Event object for onclick event
 * @desc Handles client mouse click events
 */
function onClick (e)
{
	if (client.dot.set) {
		var canvcoords = getMousePos(canvfg,e);
		var percentx = canvcoords.x / clientX;
		var percenty = canvcoords.y / clientY;

		dataToServer({
			dot: {
				x: percentx,
				y: percenty
			}
		});
	}		// endif
}


/**
 * @function onPan
 */
function onPan (evt)
{
	var keyIsPressed = [false, false, false, false];
	dataToServer(keyIsPressed);
}


/**
 * @function onResize
 * @desc Called upon window resize. Resizes and redraws
 *  game canvas.
*/
function onResize ()
{
	// Reinitialize scene.
	init('resize');
}

/**
 * @function dataToClient
 * @param {Object} data - Data object to send to game client
 * @desc Processes incoming data from server
 */
function dataToClient (data)
{
	// Check to see if server has sent a toast message
	if (data.Msg) {
		toastScreen(data.ID, data.Msg);
	}
	// Update game client with data from server
	client.update(data);
}
