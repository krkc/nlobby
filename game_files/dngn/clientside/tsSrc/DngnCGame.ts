// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */
/// <reference path="../../../../public/javascript/NgRoom.d.ts"/>

import { DngnCPlayer } from "./entities/characters/DngnCPlayer";

export class DngnCGame {
	_self: any;
	_ngRoom: any;
	_dngnEnv: any;
	_players: DngnCPlayer[];
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
		// 	console.log('Success!!');
		// });
		});
	}


	/**
		* @function addPlayer
		* @memberof DngnCGame
		* @param {string} pid - Player-ID assigned to the new player-character
		* @return {boolean} - Success/failure indication
		*
		* @desc Add a new player-character to the current game
	*/
	public addPlayer (pid: string)
	{
		if (pid) {
			// Add a new player to the list of current players in the game
			try {
				this._players.push(new DngnCPlayer(pid));
			}
			catch (e) {
				console.log('Error: Unable to add a new player to the game. ' + e);
				return false;
			}
			return true;
		}
	}

	/**
		* @function removePlayer
		* @memberof DngnCGame
		* @param {string} pid - Player-ID of the player to be removed
		* @return {boolean} - Success/failure indication
		*
		* @desc Removes a new player-character from the current game
	*/
	public removePlayer (pid: string)
	{
		if (pid) {
			// Add a new player to the list of current players in the game
			let playerToRemove: DngnCPlayer;
			for (let player of this._players) {
				if (player.pid === pid) {
					playerToRemove = player;
				}
			}
			if (playerToRemove) {
				// PlayerID was found in the game, remove the player.
				try {
					this._players.splice(this._players.indexOf(playerToRemove), 1);
				}
				catch (e) {
					console.log('Error: unable to remove the player from the game. ' + e);
					return false;
				}
				return true;
			} else {
				return false;
			}
		}
	}

	/**
		* @function setPageListeners
		* @memberof DngnCGame
		*
		* @desc Set all event listeners for the page
	  */
	private _setPageListeners ()
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


	// Event handler: '_onKeyDown'
	private _onKeyDown (ev: Event)
	{
		console.log('Key Down Event');
	}
	// Event handler: '_onClick'
	private _onClick (ev: Event)
	{
		console.log('Click Event');
	}
	// Event handler: '_onPan'
	private _onPan (ev: Event)
	{
		console.log('Pan Event');
	}
	// Event handler: '_onGameReset'
	private _onGameReset (ev: Event)
	{
		console.log('Game Reset Event');
	}
	// Event handler: '_onGameStart'
	private _onGameStart (ev: Event)
	{
		console.log('Game Start Event');
	}
	// Event handler: '_onState'
	private _onState (ev: Event)
	{
		console.log('State Event');
	}
	// Event handler: '_onGameOver'
	private _onGameOver (ev: Event)
	{
		console.log('Game Over Event');
	}

}
