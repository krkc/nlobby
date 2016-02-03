/// <reference path="node.d.ts"/>

import * as events from "events";
import { DngnPlayer } from "./entities/characters/DngnPlayer.ts";

export class Game {
  players : DngnPlayer[];
  readyPlayers : number;
  Message : string;
  eventEmitter : events.EventEmitter;
  gameRunning : string;

  constructor(p1: string, p2: string) {
    this.players.push(new DngnPlayer(p1));
    this.players.push(new DngnPlayer(p2));
    this.eventEmitter = new events.EventEmitter();
  }

  private gameLoop () {
    
  };

  private init () {

  }

  private gameOver () {

  }

  private reset () {

  }

  private sendData (d : any) {
    this.eventEmitter.emit('dataFromGame', d);
  }

  // Client message events

  public onPlayerReady (ev: Event) {
    // A player is ready, increment readyPlayer counter
    if (++this.readyPlayers >= 2) {
      // Start game
      this.init();
      // Send updated data to clients
      this.Message = "Arrow keys to move!";
      this.sendData({
        GameReady: {

        },
        Toast: {
          msg: this.Message
        }
      });
    }
  }

  public onInput (ev: any) {
    if (ev.keybd) {
      if (this.gameRunning) {
        for (let player of this.players) {
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
