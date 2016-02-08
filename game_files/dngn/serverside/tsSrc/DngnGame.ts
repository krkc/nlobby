/// <reference path="node.d.ts"/>

import * as events from "events";
import { Zone } from "./entities/DngnZone";

export class Game {
  _readyPlayers : number;
  _message : string;
  _eventEmitter : events.EventEmitter;
  _gameLoopID : NodeJS.Timer;
  _gameRunning : boolean;
  _zone : Zone;

  constructor(p1: string, p2: string) {
    this._readyPlayers = 0;
    this._message = "";
    this._eventEmitter = new events.EventEmitter();
    this._gameRunning = false;
    this._zone = new Zone();
  }

  private gameLoop (context : Game) {
    this._zone.run();
  }

  private init () {
    this._gameLoopID = setInterval(() => { this.gameLoop(this); }, 1000);
    this._gameRunning = true;
  }

  private gameOver () {
    this._gameRunning = false;
  }

  private reset () {

  }

  private sendData (d : any) {
    this._eventEmitter.emit('dataFromGame', d);
  }

  // Client message events

  public onPlayerReady (ev: CustomEvent) {
    // A player is ready
    this._zone.addPlayer(ev.detail.pid, ev.detail.class);
    // increment readyPlayer counter
    if (++this._readyPlayers >= 2) {
      // Start game
      this.init();
      // Send updated data to clients
      this._message = "Arrow keys to move!";
      this.sendData({
        GameReady: {
          pid: ev.detail.pid
        },
        Toast: {
          msg: this._message
        }
      });
    }
  }

  public onInput (ev: any) {
    if (ev.keybd) {
      if (this._gameRunning) {
        for (let player of this._zone._players) {
          if (player.pid == ev.pid) {
            player.move(ev.keybd);
          }
        }
      }
    }
    if (ev.mouse) {

    }
    if (ev.touch) {

    }
  }

  public onResetRequest (ev: Event) {
    this.reset();
  }
}
