import { DngnCharacter } from "./entities/characters/DngnCharacter";
import { Player, PWarrior, PMage, PHealer } from "./entities/characters/DngnPlayer";
import { NonPlayer, NPWarrior, NPMage, NPHealer } from "./entities/characters/DngnNonPlayer";
import { Direction } from "../DngnEnums";

enum Classes {
  Warrior, Mage, Healer
}

declare type PosMap = { [key : number] : DngnCharacter[] };

export class Zone {
  _players : Player[];
  _npcs : NonPlayer[];
  _topSideMap : PosMap;
  _bottomSideMap : PosMap;
  _leftSideMap : PosMap;
  _rightSideMap : PosMap;
  _playersMoving : Player[];
  constructor() {
    this._players = [];
    this._npcs = [];
    this._topSideMap = {};
    this._bottomSideMap = {};
    this._leftSideMap = {};
    this._rightSideMap = {};
    this._playersMoving = [];
  } // End constructor

  /**
   * @function addPlayer
   * @memberof DngnGame
   * @param {string} pid - Player-ID assigned to the new player-character
   * @return {boolean} - Success/failure indication
   *
   * @desc Add a new player-character to the current game
 */
  public addPlayer(_pid: string, _class: Classes) {
    if (_class == Classes.Warrior) {
      this._players.push(new PWarrior(_pid));
    } else if (_class == Classes.Mage) {
      this._players.push(new PMage(_pid));
    } else if (_class == Classes.Healer) {
      this._players.push(new PHealer(_pid));
    }
    // Register entity boundaries in the side maps
    let _pl = this._players[this._players.length - 1];
    let _sides = _pl.getSides();
    this.addToMap(this._leftSideMap, _sides[0], <DngnCharacter>_pl);
    this.addToMap(this._rightSideMap, _sides[1], <DngnCharacter>_pl);
    this.addToMap(this._topSideMap, _sides[2], <DngnCharacter>_pl);
    this.addToMap(this._bottomSideMap, _sides[3], <DngnCharacter>_pl);
  } // End addPlayer

  /**
 		* @function removePlayer
 		* @memberof DngnCGame
 		* @param {string} pid - Player-ID of the player to be removed
 		* @return {boolean} - Success/failure indication
 		*
 		* @desc Removes a new player-character from the current game
 	*/
  public removePlayer() {

  } // End removePlayer

  public run() {
    for (let player of this._players) {
      let _lastSidesPos = player.getSides();
      let _playerSidesPos = player.move();
      if (_playerSidesPos) {
        let collidingEntities : DngnCharacter[] = [];
        this.updateBoundaries(player, _lastSidesPos, _playerSidesPos);
        this.findCollisions(collidingEntities, player._direction, _playerSidesPos);
        this.handleCollision(collidingEntities);
      }
    }
  } // End run

  private addToMap(_map : PosMap, _side : number, _pl : DngnCharacter) {
    if (_map[_side]) {
      _map[_side].push(_pl);
    } else {
      _map[_side] = [_pl];
    }
  }

  private removeFromMap(_map : PosMap, _side : number, _pl : DngnCharacter) {
    let parallelSides = _map[_side];
    if (parallelSides.length <= 1) {
      delete _map[_side];
    } else {
      parallelSides.splice(parallelSides.indexOf(_pl), 1);
    }
  }

  private updateBoundaries(_player: DngnCharacter, _lastSides: number[], _newSides: number[]) {
    if (_player._direction == Direction.NORTH ||
      _player._direction == Direction.SOUTH) {
      // Remove previous top from list
      this.removeFromMap(this._topSideMap, _lastSides[2], _player);
      // Replace with new top coords
      this.addToMap(this._topSideMap, _newSides[2], _player);
      // Remove previous bottom from list
      this.removeFromMap(this._bottomSideMap, _lastSides[3], _player);
      // Replace with new bottom coords
      this.addToMap(this._bottomSideMap, _newSides[3], _player);
    }

    if (_player._direction == Direction.EAST ||
      _player._direction == Direction.WEST) {
      // Remove left from list
      this.removeFromMap(this._leftSideMap, _lastSides[0], _player);
      // Replace with new left
      this.addToMap(this._leftSideMap, _newSides[0], _player);
      // Remove right from list
      this.removeFromMap(this._rightSideMap, _lastSides[1], _player);
      // Replace with new right
      this.addToMap(this._rightSideMap, _newSides[1], _player);
    }
  }

  private findCollisions(_entityArr: DngnCharacter[], _direction : Direction, _playerSides : number[]) {
    if (_direction == Direction.NORTH) {
      // Player moving north, so check the bottom-sides of all entities
      if (this._bottomSideMap[_playerSides[2]]) {
        let plArr = this._bottomSideMap[_playerSides[2]];
        for (let pl of plArr) {
          // Test all entities currently on the same horizontal plane
          if (pl.testXCollisions(_playerSides[0], _playerSides[1])) {
            // Collision detected with entity, add to the list
            _entityArr.push(pl);
          }
        }
      }
    }
    if (_direction == Direction.SOUTH) {
      // Player moving south, so check the top-sides of all entities
      if (this._topSideMap[_playerSides[3]]) {
        let plArr = this._topSideMap[_playerSides[2]];
        for (let pl of plArr) {
          // Test all entities currently on the same horizontal plane
          if (pl.testXCollisions(_playerSides[0], _playerSides[1])) {
            // Collision detected with entity, add to the list
            _entityArr.push(pl);
          }
        }
      }
    }
    if (_direction == Direction.EAST) {
      // Player moving east, so check the left-sides of all entities
      if (this._leftSideMap[_playerSides[1]]) {
        let plArr = this._leftSideMap[_playerSides[2]];
        for (let pl of plArr) {
          // Test all entities currently on the same vertical plane
          if (pl.textYCollisions(_playerSides[2], _playerSides[3])) {
            // Collision detected with entity, add to the list
            _entityArr.push(pl);
          }
        }
      }
    }
    if (_direction == Direction.WEST) {
      // Player moving west, so check the right-sides of all entities
      if (this._rightSideMap[_playerSides[0]]) {
        let plArr = this._rightSideMap[_playerSides[2]];
        for (let pl of plArr) {
          // Test all entities currently on the same vertical plane
          if (pl.textYCollisions(_playerSides[2], _playerSides[3])) {
            // Collision detected with entity, add to the list
            _entityArr.push(pl);
          }
        }
      }
    }
  } // End findCollisions

  public handleCollision(_entityArr : DngnCharacter[]) {
    console.log('Collision detected.');
  } // End handleCollision
} // End class
