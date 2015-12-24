// -- Client-side -- //


/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


function GameClient ()
{

	'use strict';

	var self = this;	/* copy of GameClient's 'this' pointer for use in main loop */
	var rcu = {};			/* relative canvas units object */
	var mc = {};			/* HammerJS object */
	var ngroom = {};	/* Game room object */
	var snkgame = {};	/* Game client object */
	var myscorespan = {};		/* Player Score DOM object */
	var oppscorespan = {};	/* Opponent Score DOM object */
	var bgStateChanged = false;		/* Indicates the background state needs updated */
	var clientReadyFlag = false;	/* indicates that game client is ready or not */
	var wWidth = {};			/* Window width */
	var wHeight = {};			/* Window height */
	var canvbg = {};			/* Page canvas background object */
	var canvfg = {};			/* Page canvas foreground object */
	var glfg = {};		/* canvas foreground context object */
	var glbg = {};		/* canvas background context object */

	var mainloop = null;			/* id for the main loop */
	var readyChecker = null;	/* id for the checkGameReady loop */
	var initialTime = {};		/* Time of first ready check attempt */

	init();


	/**
	 * @method init
	 * @memberof GameClient
	 * @param {bool} reset - (optional) Determines type of init operation (initial or reset)
	 *
	 * @desc Initializes the canvas and game client prior to game loop starting
	 * @public
	 */
	function init (reset)
	{

		wWidth = window.innerWidth;										/* Window width */
		wHeight = window.innerHeight;									/* Window height */
		canvbg = document.getElementById("canvbg");		/* Page Canvas objects */
		canvfg = document.getElementById("canvfg");


		if (!reset) {
			ngroom = new NgRoom(':3000');

			// Register event listener for keypresses, clicks, and touches.
			window.addEventListener("keydown", onKeyDown, true);
			canvfg.addEventListener("click", onClick, true);

			// Register event listener for window resize.
			window.addEventListener("resize", onResize, true);

			addEventListener('dataToGame', dataToGame, true);

			myscorespan = document.getElementById("myscorespan");		/* Player 1 Score html element */
			oppscorespan = document.getElementById("oppscorespan");		/* Player 2 Score html element */
		}

		// Specify canvas size based on window size.
		canvbg.setAttribute('width', (wWidth - Math.floor(wWidth * 0.1)) );
		canvfg.setAttribute('width', (wWidth - Math.floor(wWidth * 0.1)) );
		canvbg.setAttribute('height', (wHeight - Math.floor(wHeight * 0.1)) );
		canvfg.setAttribute('height', (wHeight - Math.floor(wHeight * 0.1)) );

		// Establish a 2D drawing context.
		try {
			glbg = canvbg.getContext("2d");
			glfg = canvfg.getContext("2d");				/* Drawing context object */
		}
		catch(e){
			console.log("Error establishing drawing context.");
		}

		// Set the initial scoreboard
		myscorespan.innerHTML = 0;
		oppscorespan.innerHTML = 0;


		// Initialize Hammer touch events
		var options = {
	  	preventDefault: true
		};
		mc = new Hammer(canvfg, options);
		mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

		// Hammerjs swipe event handler
		mc.on("panend", onPan);


		snkgame = new GameMain();
		snkgame.init();

		rcu = RCU(canvfg.clientHeight, canvfg.clientWidth);

		bgStateChanged = true;

		if (glfg && glbg) {
			// When all assets are loaded, draw the background
			//   and begin the game loop.
			if (!reset) {
				main();
				// Poll for client ready status
				var date = new Date();
				initialTime = date.getTime();
				readyChecker = setInterval(checkGameReady, 1000);
				// Begin game loop
				mainloop = setInterval(main, snkgame.gameSpeed);
			}
		}

	}


	// The following function inspired by:
	// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	/**
	 * @function getMousePos
	 * @memberof Utils
	 * @param {Object} canvas - Canvas object
	 * @param {Object} evt - Event object
	 *
	 * @desc Return the position of the mouse relative to the canvas
	 * @public
	 */
	function getMousePos (evt)
	{

	  var rect = canvfg.getBoundingClientRect();
	  return {
	    x: (evt.clientX - rect.left) / canvfg.clientWidth,
	    y: (evt.clientY - rect.top) / canvfg.clientHeight
	  };

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
			drawbg(glbg);
			bgStateChanged = false;
		}

		// Draw the canvas foreground.
		drawfg(glfg);

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

		var snkCoords = snkgame.getCoords('snake');
		var dotCoords = snkgame.getCoords('dot');
		// Clear previously drawn player.
		for (var i = 0; i < snkCoords.xLoc.length; i++) {
			glfgc.clearRect(rcu.x[snkCoords.lastxLoc[i]], rcu.y[snkCoords.lastyLoc[i]], rcu.x[5], rcu.y[5]);
		}

		// Clear dot
		glfgc.clearRect(rcu.x[dotCoords.lastxLoc], rcu.y[dotCoords.lastyLoc], rcu.x[5], rcu.y[5]);


		// Draw new player position.
		glfgc.fillStyle="#000000";
		for (var j = 0; j < snkCoords.xLoc.length; j++) {
			glfgc.fillRect(rcu.x[snkCoords.xLoc[j]], rcu.y[snkCoords.yLoc[j]], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
		}

		// Redraw dot
		glfgc.fillStyle="#000000";
		glfgc.fillRect(rcu.x[dotCoords.xLoc], rcu.y[dotCoords.yLoc], rcu.x[5], rcu.y[5]);			/* x,y,w,h */
	}


	/**
	 * @function toastScreen
	 * @param {Object} user - Recipient of the message
	 * @param {Object} data - Message to send to screen
	 * @desc Draws a message box with a message on player's game canvas
	 */
	function toastScreen (id, msg)
	{
		if (id === ngroom.getMyID()) {
			glfg.font="20px Arial";
			glfg.fillStyle="#888888";
			glfg.fillRect(rcu.x[40], rcu.y[40], rcu.x[20], rcu.y[20]);	/* x,y,w,h */
			// print msg for current player
			glfg.fillText(msg.msg, rcu.x[45], rcu.y[50]);
		}
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
	 * @function dataToGame
	 * @param {Object} data - Data object to send to game client
	 * @desc Processes incoming data from server
	 */
	function dataToGame (e)
	{
		var data = e.detail;
		// Check to see if server has sent a toast message
		if (data.Msg) {
			toastScreen(data.Msg.ID, data.Msg.msg);
		}

		// Update game client with data from server
		snkgame.update(data, ngroom.getMyID());
	}

	/**
	 * @function checkGameReady
	 *
	 * @desc Check if game is ready and update ready flag
	 */
	function checkGameReady ()
	{
		var d = new Date();

		if (d.getTime() <= initialTime + 5000) {
			if (snkgame.ready() && ngroom.getMyID()) {
				// Game object is ready
				clientReadyFlag = true;
				// Indicate to game server that the client is ready
				console.log("MyID: " + ngroom.getMyID());
				ngroom.dataToServer({ readyID: ngroom.getMyID() });
				clearInterval(readyChecker);
			}
		} else {
			// Game failed to pass ready check, aborting check
			console.log("Game ready check failed after timeout. " + snkgame.ready() + " and " + ngroom.getMyID());
			clearInterval(readyChecker);
			clearInterval(mainloop);
		}

	}




	// ----- GameClient JavaScript Events ----- //

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
		console.log("Test: myRole: " + snkgame.getRole(ngroom.getMyID()));
		if (snkgame.getRole(ngroom.getMyID()) === 'snake') {
			dataToServer({
				snake: {
					keyIsPressed: keyIsPressed
				}
			});
		}	// endif
	}


	/**
	 * @function onClick
	 * @param {Event} e - Event object for onclick event
	 * @desc Handles client mouse click events
	 */
	function onClick (e)
	{
		console.log("onClick TEST: myRole: " + snkgame.getRole(ngroom.getMyID()));
		if (snkgame.getRole(ngroom.getMyID()) == 'dot') {
			var canvcoords = getMousePos(e);

			dataToServer({
				dot: {
					x: canvcoords.x,
					y: canvcoords.y
				}
			});
		}		// endif
	}


	/**
	 * @function onPan
	 */
	function onPan (evt)
	{
		var keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */

		if (evt.direction === 8) {
			// Swipe up
			keyIsPressed[0] = true;
		} else if (evt.direction === 16) {
			// Swipe down
			keyIsPressed[1] = true;
		} else if (evt.direction === 2) {
			// Swipe left
			keyIsPressed[2] = true;
		} else if (evt.direction === 4) {
			// Swipe right
			keyIsPressed[3] = true;
		}

		if (snkgame.getRole(ngroom.getMyID()) === 'snake') {
			dataToServer({
				snake: {
					keyIsPressed: keyIsPressed
				}
			});
		}	// endif
	}

}
