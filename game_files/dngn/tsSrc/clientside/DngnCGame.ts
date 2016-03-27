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
import { Zone } from "../common/world/DngnZone";
import * as Messages from "../common/DngnMessages";
import { Classes } from "../common/world/entities/characters/DngnClasses";
import { Entity } from "../common/world/entities/DngnEntity";

export class DngnCGame {
	game : CGame;
	constructor(conn: string) {
		this.game = new CGame(conn);
	}
}

export class CGame {
	_ngRoom: NgRoom;
	_dngnEnv: Environment;
	_gameLoopID: number;
	_gameRunning: boolean;
	_zone: Zone;
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
			this._zone = new Zone();
			this._zone._myPlayer.pid = this._ngRoom.getMyID();
			this._dngnEnv.loadAssets(() => {
				// Register event listener for keypresses, clicks, and touches.
				window.addEventListener('keydown', (ev: KeyboardEvent) => this._onKeyDown(this, ev), true);
				//window.onkeydown = (event: Event) => this._onKeyDown(this, event);
				// Register custom event listeners
				addEventListener('onGameStart', (event: CustomEvent) => this.onGameStart(this, event), true);
				addEventListener('onState', (event: CustomEvent) => this._onState(this, event), true);
				addEventListener('onGameOver', (event: CustomEvent) => this._onGameOver(this, event), true);
				this._dngnEnv.Overlay.canvas.addEventListener('click', (event: MouseEvent) => this._onClick(this, event), true);
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

				// Draw background
				this._dngnEnv.drawBackground();
				// Prompt user with class-selection menu
				this._dngnEnv.promptMenu( (_selectedClass: Classes) => {
					this._dngnEnv.hideMenu();
					// Send 'PlayerReady' message to server
					this._ngRoom.dataToServer(Messages.ClientStatusMsg.ready(this._ngRoom.getMyID(), _selectedClass));
				});
			});
		});

	}	// End DngnCGame constructor


	private gameLoop() {
		// See if my player is moving
		if (this._zone._myPlayer.isMoving()) {
			this._dngnEnv.bgStateChanged = true;
		}
		// TODO: make a decision!!!!!!!! (ugh)
		//this._dngnEnv.scene.add(this._zone._players);
		//this._dngnEnv.scene.add(this._zone._npcs);

		// Redraw entire scene
		this._dngnEnv.drawScene(this._zone._players);
	}




	// Event handler: '_onKeyDown'
	private _onKeyDown(GameContext: CGame, event: KeyboardEvent) {
		if (GameContext._dngnEnv.titleMenu.displayed) {
			GameContext._dngnEnv.titleMenu.onKey(event.keyCode);
		} else
		if (GameContext._gameRunning) {
			// ---- Arrow Key --------------
			if (event.keyCode == Messages.Key.Up) {
				event.preventDefault();
				GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), Messages.Direction.NORTH));
			}
			if (event.keyCode == Messages.Key.Down) {
				event.preventDefault();
				GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), Messages.Direction.SOUTH));
			}
			if (event.keyCode == Messages.Key.Left) {
				event.preventDefault();
				GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), Messages.Direction.WEST));
			}
			if (event.keyCode == Messages.Key.Right) {
				event.preventDefault();
				GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), Messages.Direction.EAST));
			}
			if (event.keyCode == Messages.Key.Space) {
				event.preventDefault();
				GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), Messages.Direction.NORTH));
			}
		}
	}
	// Event handler: '_onClick'
	private _onClick(GameContext: CGame, event: MouseEvent) {
		if (GameContext._dngnEnv.titleMenu.displayed) {
			GameContext._dngnEnv.titleMenu.onClick(event.clientX, event.clientY);
		} else {
			// GameContext._ngRoom.dataToServer(ClientInputMsg.click(GameContext._ngRoom.getMyID(), event.clientX, event.clientY));
		}
	}
	// Event handler: '_onPan'
	private _onPan(GameContext: CGame, event: HammerInput) {
		if (event.direction == 8) {
			GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), Messages.Direction.NORTH));
		}
		if (event.direction == 16) {
			GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), Messages.Direction.SOUTH));
		}
		if (event.direction == 4) {
			GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), Messages.Direction.EAST));
		}
		if (event.direction == 2) {
			GameContext._ngRoom.dataToServer(Messages.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), Messages.Direction.WEST));
		}
	}
	// Event handler: '_onGameReset'
	private _onGameReset(GameContext: CGame, event: CustomEvent) {
		console.log('Game Reset Event');
	}
	// Event handler: '_onGameStart'
	public onGameStart(GameContext: CGame, event: CustomEvent) {
		console.log('Game Start Event');
		// Start game loop
		this._gameLoopID = setInterval(() => this.gameLoop, 1000);
		GameContext._gameRunning = true;
	}
	// Event handler: '_onState'
	private _onState(GameContext: CGame, event: CustomEvent) {
		console.log('State Event');
		if (this._gameRunning) {
			// Process state data
			this._zone.run();
		}
	}
	// Event handler: '_onGameOver'
	private _onGameOver(GameContext: CGame, event: CustomEvent) {
		console.log('Game Over Event');
	}

}
