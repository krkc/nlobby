import { DngnCharacter } from "./characters/DngnCharacter";
import { Player, PWarrior, PMage, PHealer } from "./characters/DngnPlayer";
import { NonPlayer, NPWarrior, NPMage, NPHealer } from "./characters/DngnNonPlayer";
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

  public addPlayer(_pid: string, _class: Classes) {
    if (_class == Classes.Warrior) {
      this._players.push(new PWarrior(_pid));
    } else if (_class == Classes.Mage) {
      this._players.push(new PMage(_pid));
    } else if (_class == Classes.Healer) {
      this._players.push(new PHealer(_pid));
    }
  } // End addPlayer

  public removePlayer() {

  } // End removePlayer

  public run() {
    for (let player of this._players) {
      let _playerSidesPos = player.move();
      if (_playerSidesPos) {
        let collidingEntities : Player[] = [];
        this.findCollisions(collidingEntities, player._direction, _playerSidesPos);
        this.handleCollision(collidingEntities);
      }
    }
  } // End run

  private findCollisions(_entityArr: Player[], _direction : Direction, _playerSides : number[]) {
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

  public handleCollision(_entityArr : Player[]) {
    console.log('Collision detected.');
  } // End handleCollision
} // End class
