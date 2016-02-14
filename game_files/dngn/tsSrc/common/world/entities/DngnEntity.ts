import { Direction, Key } from "../../../common/DngnEnums";

export class Entity {
  _entityID: number;
  _location: { x: number, y: number };
  _velocity: { x: number, y: number }
  _acceleration: { x: number, y: number }
  _direction: Direction;
  constructor() {
    this._entityID = 0;
    this._location = { x : 10, y : 90 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
    this._direction = Direction.EAST;
  }
}
