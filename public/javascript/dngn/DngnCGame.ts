// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */
/// <reference path="../NgRoom.d.ts"/>

export class DngnCGame {
	_self: any;
	_ngRoom: any;
	_dngnEnv: any;
	_gameLoopID: number;
	_gameRunning: boolean;
	_paused: boolean;
	constructor(conn: string) {
		this._self = this;						/* copy of GameClient's 'this' pointer for use in main loop */
	  this._ngRoom = null;					/* Game room object */
	  this._dngnEnv = null;  				/* Game page environment */
		this._gameLoopID = null;			/* setInterval ID for the game loop */
		this._gameRunning = false;		/* Game running flag */
		this._paused = false;					/* Game pause switch */

		// Connect to game room, load assets, and prepare game environment
		this._ngRoom = new NgRoom(conn, function () {
		// 	this._dngnEnv = new DngnEnvironment();
		// 	this._dngnEnv.init(function () {
		// 		// Register all event listeners for the page
		// 		_setPageListeners();
		// 		// Send 'PlayerReady' message to server
		// 		this._ngRoom.dataToServer({
		// 			PlayerReady: {
		// 				pid: this._ngRoom.getMyID()
		// 			}
		// 		});
			console.log('Success!!');
		});
	}

	/**
		* @function setPageListeners
		* @memberof DngnCGame
		*
		* @desc Set all event listeners for the page
	*/
	_setPageListeners ()
	{
		// Register event listener for keypresses, clicks, and touches.
		window.addEventListener('keydown', this._onKeyDown, true);
		this._dngnEnv.Foreground.canvas.addEventListener('click', this._onClick, true);
		// Initialize Hammer touch events
		var options = {
	  	preventDefault: true
		};
		//this._dngnEnv.mc = new Hammer(canvfg, options);
		//this._dngnEnv.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		// Hammerjs swipe event handler
		//this._dngnEnv.mc.on("panend", onPan);
		// Register event listener for window resize and reset.
		window.addEventListener('resize', this._dngnEnv.onResize, true);
		this._dngnEnv.ResetBtn.addEventListener('click', this._onGameReset, true);
		// Register custom event listeners
		addEventListener('onGameStart', this._onGameStart, true);
		addEventListener('onState', this._onState, true);
		addEventListener('onGameOver', this._onGameOver, true);
	}

	_onKeyDown ()
	{
		console.log('Key Down Event');
	}

	_onClick ()
	{
		console.log('Click Event');
	}

	_onPan ()
	{
		console.log('Pan Event');
	}

	_onGameReset ()
	{
		console.log('Game Reset Event');
	}

	_onGameStart ()
	{
		console.log('Game Start Event');
	}

	_onState ()
	{
		console.log('State Event');
	}

	_onGameOver ()
	{
		console.log('Game Over Event');
	}

}
