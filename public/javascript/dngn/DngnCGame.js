// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */



function GameClient (conn)
{

	'use strict';

	var self = this;	/* copy of GameClient's 'this' pointer for use in main loop */
  var ngRoom;							/* Game room object */
  var dngnEnv;   					/* Game page environment */
	var readyCounter = 0;		/* Stage of game readiness */
	var readyStages = 2;		/* Total number of steps to be ready */
	var gameSpeed = 200;		/* Default game speed */
	var bgStateChanged = true;	/* Flag if background needs updated */
	var snake;							/* Snake player object */
	var dot;								/* Dot player object */
	var keyIsPressed = [false, false, false, false];	/* Keypress/swipe data */
	var gameLoopID = null;	/* setInterval ID for the game loop */
	var gameRunning;				/* Game running flag */
	var paused = false;			/* Game pause switch */



	init();

  /**
    * @function init
    * @memberof SnkClient
    *
    * @desc Set all event listeners for the page
  */
  function init()
  {
		// Connect to game room, load assets, and prepare game environment
		ngRoom = new NgRoom(conn, function () {
			dngnEnv = new DngnEnvironment();
			dngnEnv.init(function () {
				// Register all event listeners for the page
				setPageListeners();
				// Send 'PlayerReady' message to server
				ngRoom.dataToServer({
					PlayerReady: {
						pid: ngRoom.getMyID()
					}
				});
			});
		});
  }

	/**
		* @function setPageListeners
		* @memberof DngnCGame
		*
		* @desc Set all event listeners for the page
	*/
	function setPageListeners()
	{
		// Register event listener for keypresses, clicks, and touches.
		window.addEventListener('keydown', onKeyDown, true);
		dngnEnv.Foreground.canvas.addEventListener('click', onClick, true);
		// Initialize Hammer touch events
		var options = {
	  	preventDefault: true
		};
		dngnEnv.mc = new Hammer(canvfg, options);
		dngnEnv.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		// Hammerjs swipe event handler
		dngnEnv.mc.on("panend", onPan);
		// Register event listener for window resize and reset.
		window.addEventListener('resize', dngnEnv.onResize, true);
		dngnEnv.ResetBtn.addEventListener('click', onGameReset, true);
		// Register custom event listeners
		addEventListener('onGameStart', onGameStart, true);
		addEventListener('onState', onState, true);
		addEventListener('onGameOver', onGameOver, true);
	}

}
