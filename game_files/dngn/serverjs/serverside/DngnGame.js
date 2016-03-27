var events = require("events");
var Messages = require("../common/DngnMessages");
var DngnZone_1 = require("../common/world/DngnZone");
var Game = (function () {
    function Game(p1, p2) {
        this._readyPlayers = 0;
        this._message = "";
        this._eventEmitter = new events.EventEmitter();
        this._gameRunning = false;
        this._zone = new DngnZone_1.Zone();
    }
    Game.prototype.gameLoop = function (context) {
        this._zone.run();
    };
    Game.prototype.init = function () {
        var _this = this;
        this._gameLoopID = setInterval(function () { _this.gameLoop(_this); }, 1000);
        this._gameRunning = true;
    };
    Game.prototype.gameOver = function () {
        this._gameRunning = false;
    };
    Game.prototype.reset = function () {
    };
    Game.prototype.sendData = function (m) {
        this._eventEmitter.emit('dataFromGame', m);
    };
    Game.prototype.onPlayerReady = function (m) {
        this._zone.addPlayer(m.pid, m.class);
        if (++this._readyPlayers >= 2) {
            this.init();
            this._message = "Arrow keys to move!";
            var _msg = new Messages.ServerMessage();
            _msg.GameReady = Messages.ServerStatusMessages.Ready(m.pid);
            _msg.Toast = Messages.ServerStatusMessages.Toast(this._message);
            this.sendData(_msg);
        }
    };
    Game.prototype.onInput = function (ev) {
        if (ev.keybd) {
            console.log('test1');
            if (this._gameRunning) {
                for (var _i = 0, _a = this._zone._players; _i < _a.length; _i++) {
                    var player = _a[_i];
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
    };
    Game.prototype.onResetRequest = function (ev) {
        this.reset();
    };
    return Game;
})();
exports.Game = Game;
//# sourceMappingURL=DngnGame.js.map