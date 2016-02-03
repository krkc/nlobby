"use strict";
var events = require("events");
var DngnPlayer_ts_1 = require("./entities/characters/DngnPlayer.ts");
var Game = (function () {
    function Game(p1, p2) {
        this.players.push(new DngnPlayer_ts_1.DngnPlayer(p1));
        this.players.push(new DngnPlayer_ts_1.DngnPlayer(p2));
        this.eventEmitter = new events.EventEmitter();
    }
    Game.prototype.gameLoop = function () {
    };
    ;
    Game.prototype.init = function () {
    };
    Game.prototype.gameOver = function () {
    };
    Game.prototype.reset = function () {
    };
    Game.prototype.sendData = function (d) {
        this.eventEmitter.emit('dataFromGame', d);
    };
    Game.prototype.onPlayerReady = function (ev) {
        if (++this.readyPlayers >= 2) {
            this.init();
            this.Message = "Arrow keys to move!";
            this.sendData({
                GameReady: {},
                Toast: {
                    msg: this.Message
                }
            });
        }
    };
    Game.prototype.onInput = function (ev) {
        if (ev.keybd) {
            if (this.gameRunning) {
                for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                    var player = _a[_i];
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
    };
    Game.prototype.onResetRequest = function (ev) {
        this.reset();
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=DngnGame.js.map