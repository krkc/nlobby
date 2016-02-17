// -- Server-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */

/// <reference path="node.d.ts"/>

import * as events from "events";
import { Zone } from "../common/world/DngnZone";

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

  public onPlayerReady (d : any) {
    // A player is ready
    this._zone.addPlayer(d.pid, d.class);
    // increment readyPlayer counter
    if (++this._readyPlayers >= 2) {
      // Start game
      this.init();
      // Send updated data to clients
      this._message = "Arrow keys to move!";
      this.sendData({
        GameReady: {
          pid: d.pid
        },
        Toast: {
          msg: this._message
        }
      });
    }
  }

  public onInput (ev: any) {
    if (ev.keybd) {
      console.log('test1');
      if (this._gameRunning) {
        for (let player of this._zone._players) {
          if (player.pid == ev.pid) {
            console.log('test2');
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
