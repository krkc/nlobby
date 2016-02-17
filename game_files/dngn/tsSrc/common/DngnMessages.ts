import { Classes } from "../common/world/entities/characters/DngnClasses";

export enum Direction { NORTH, SOUTH, EAST, WEST };
export enum Key { Left = 37, Up = 38, Right = 39, Down = 40, Space = 32, One = 49, Two = 50, Three = 51 };

// ---- Client Messages ---- //

export class ClientInputMsg {

  static keyDown(_pid: string, _direction: Direction) {
    return {
      pid: _pid,
      keybd: { direction: _direction }
    }
  }

  static click(_pid: string, _x: number, _y: number) {
    return {
      pid: _pid,
      mouse: { x: _x, y: _y }
    }
  }

  static pan(_pid: string, _direction: Direction) {
    return {
      pid: _pid,
      touch: { direction: _direction }
    }
  }
}

export class ClientStatusMsg {

  static ready(_pid: string, _class: Classes) {
    return {
      PlayerReady: {
        pid: _pid,
        class: _class
      }
    }
  }
}

// ---- Server Messages ---- //

export class ServerStatusMsg {
  //
}
