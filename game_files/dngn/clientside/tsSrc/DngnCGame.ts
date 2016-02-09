// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */
/// <reference path="../../../../public/javascript/NgRoom.d.ts"/>
/// <reference path="hammerjs.d.ts"/>


import { Environment } from "./environment/DngnCEnv";

export class DngnCGame {
	game : CGame;
	constructor(conn: string) {
		this.game = new CGame(conn);
	}
}

enum Classes {
  Warrior, Mage, Healer
}

export class CGame {
	_ngRoom: NgRoom;
	_dngnEnv: Environment;
	_gameLoopID: number;
	_gameRunning: boolean;
	_paused: boolean;
	_mc: HammerManager;

	constructor(conn: string) {
	  this._ngRoom = null;					/* Game room object */
	  this._dngnEnv = null;  				/* Game page environment */
		this._gameLoopID = null;			/* setInterval ID for the game loop */
		this._gameRunning = false;		/* Game running flag */
		this._paused = false;					/* Game pause switch */
		// Connect to game room, load assets, and prepare game environment
		this._ngRoom = new NgRoom(conn, () => {
			this._dngnEnv = new Environment();
			this._dngnEnv.loadAssets(() => {
				// Register event listener for keypresses, clicks, and touches.
				window.addEventListener('keydown', (event: Event) => this._onKeyDown(this, event), true);
				//window.onkeydown = (event: Event) => this._onKeyDown(this, event);
				// Register custom event listeners
				addEventListener('onGameStart', (event: CustomEvent) => this._onGameStart(this, event), true);
				addEventListener('onState', (event: CustomEvent) => this._onState(this, event), true);
				addEventListener('onGameOver', (event: CustomEvent) => this._onGameOver(this, event), true);
				this._dngnEnv.Overlay.canvas.addEventListener('click', (event: Event) => this._onClick(this, event), true);
				// Initialize Hammer touch events
				var options = {
					preventDefault: true
				};
				this._mc = new Hammer(this._dngnEnv.canvfg, options);
				this._mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
				// Hammerjs swipe event handler
				this._mc.on("panend", (event: HammerInput) => this._onPan(this, event));
				// Register event listener for window resize and reset.
				window.addEventListener('resize', (event: Event) => this._dngnEnv.onResize(this._dngnEnv, event), true);
				// Prompt user with class-selection menu
				if (this.promptMenu()) {
					// Send 'PlayerReady' message to server
					this._ngRoom.dataToServer({
						PlayerReady: {
							pid: this._ngRoom.getMyID(),
							class: Classes.Warrior
						}
					});
				}
			});
		});



	}	// End DngnCGame constructor


	/**
		* @function promptMenu
		* @memberof CGame
		* @return {boolean} - Success/failure indication
		*
		* @desc Prompts a class-selection menu to the user
	*/
	private promptMenu() {
		this._dngnEnv.titleMenu.showText(0, 50, 50, "Some text");
		// User has selected a class
		return true;
	}




	// Event handler: '_onKeyDown'
	private _onKeyDown(GameContext: CGame, event: Event) {
		console.log('Key Down Event' + this._ngRoom.getMyID());
	}
	// Event handler: '_onClick'
	private _onClick(GameContext: CGame, event: Event) {
		console.log('Click Event');
	}
	// Event handler: '_onPan'
	private _onPan(GameContext: CGame, event: HammerInput) {
		console.log('Pan Event');
	}
	// Event handler: '_onGameReset'
	private _onGameReset(GameContext: CGame, event: CustomEvent) {
		console.log('Game Reset Event');
	}
	// Event handler: '_onGameStart'
	public _onGameStart(GameContext: CGame, event: CustomEvent) {
		console.log('Game Start Event');
	}
	// Event handler: '_onState'
	private _onState(GameContext: CGame, event: CustomEvent) {
		console.log('State Event');
	}
	// Event handler: '_onGameOver'
	private _onGameOver(GameContext: CGame, event: CustomEvent) {
		console.log('Game Over Event');
	}

}
