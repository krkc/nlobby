// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */

import { Player, PWarrior, PMage, PHealer } from "./characters/DngnCPlayer";
import { NonPlayer, NPWarrior, NPMage, NPHealer } from "./characters/DngnCNonPlayer";

 export class Zone {
   _players: Player[];
   _npcs: NonPlayer[];
   constructor() {
    this._players = [];
    this._npcs = [];
   }

   /**
 		* @function addPlayer
 		* @memberof DngnCGame
 		* @param {string} pid - Player-ID assigned to the new player-character
 		* @return {boolean} - Success/failure indication
 		*
 		* @desc Add a new player-character to the current game
 	*/
 	public addPlayer(pid: string) {
 		if (pid) {
 			// Add a new player to the list of current players in the game
 			try {
 				this._players.push(new PWarrior(pid));
 				this._players.push(new PMage(pid));
 				this._players.push(new PHealer(pid));
 			}
 			catch (e) {
 				console.log('Error: Unable to add a new player to the game. ' + e);
 				return false;
 			}

 			let warrior = <PWarrior>this._players[0];
 			let mage = <PMage>this._players[1];
 			let healer = <PHealer>this._players[2];
 			warrior.slash();
 			mage.cast();
 			healer.heal();
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
 	public removePlayer(pid: string) {
 		if (pid) {
 			// Add a new player to the list of current players in the game
 			let playerToRemove: Player;
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
 }
