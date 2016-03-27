import { Classes } from "../common/world/entities/characters/DngnClasses";

export enum Direction { NORTH, SOUTH, EAST, WEST };
export enum Key { Left = 37, Up = 38, Right = 39, Down = 40, Space = 32, One = 49, Two = 50, Three = 51 };

export declare type ClientReadyMsg = { pid: string, class: Classes };
// Server message types
export declare type ServerReadyMsg = { pid: string };
export declare type ServerToastMsg = { msg: string, pid?: string };
export declare type ServerStateMsg = {  };

// ---- Client Messages ---- //

export class ClientMessage {
  Input: ClientInputMsg;
  PlayerReady: ClientReadyMsg;
}

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
    };
  }

  static pan(_pid: string, _direction: Direction) {
    return {
      pid: _pid,
      touch: { direction: _direction }
    };
  }
}

export class ClientStatusMsg {

  static ready(_pid: string, _class: Classes) {
    return {
      PlayerReady: {
        pid: _pid,
        class: _class
      }
    };
  }
}

// ---- Server Messages ---- //

/**
 * An instance of this class holds the server status messages
 */
export class ServerMessage {
  GameReady: ServerReadyMsg;
  Toast: ServerToastMsg;
  StateUpdate: ServerStateMsg;
  constructor() {
    this.GameReady = null;
    this.Toast = null;
    this.StateUpdate = null;
  }
}

/**
 * This Class contains methods that build the individual
 *  server status messages.
 */
export class ServerStatusMessages {

  public static Ready(_pid: string) {
    let _rm : ServerReadyMsg = { pid: _pid };
    return _rm;
  }

  public static Toast(_msg: string, _pid?: string) {
    let _tm : ServerToastMsg = { msg: _msg };
    if (_pid) {
      _tm.pid = _pid;
    }
    return _tm;
  }

  public static State() {
    let _sm : ServerStateMsg = {  };

    return _sm;
  }
}
