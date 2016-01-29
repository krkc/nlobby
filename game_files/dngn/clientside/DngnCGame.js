define(["require", "exports", "./entities/characters/DngnCPlayer"], function (require, exports, DngnCPlayer_1) {
    "use strict";
    var DngnCGame = (function () {
        function DngnCGame(conn) {
            this._self = this;
            this._ngRoom = null;
            this._dngnEnv = null;
            this._gameLoopID = null;
            this._gameRunning = false;
            this._paused = false;
            this._ngRoom = new NgRoom(conn, function () {
            });
        }
        DngnCGame.prototype.addPlayer = function (pid) {
            if (pid) {
                try {
                    this._players.push(new DngnCPlayer_1.DngnCPlayer(pid));
                }
                catch (e) {
                    console.log('Error: Unable to add a new player to the game. ' + e);
                    return false;
                }
                return true;
            }
        };
        DngnCGame.prototype.removePlayer = function (pid) {
            if (pid) {
                var playerToRemove = void 0;
                for (var _i = 0, _a = this._players; _i < _a.length; _i++) {
                    var player = _a[_i];
                    if (player.pid === pid) {
                        playerToRemove = player;
                    }
                }
                if (playerToRemove) {
                    try {
                        this._players.splice(this._players.indexOf(playerToRemove), 1);
                    }
                    catch (e) {
                        console.log('Error: unable to remove the player from the game. ' + e);
                        return false;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        DngnCGame.prototype._setPageListeners = function () {
            window.addEventListener('keydown', this._onKeyDown, true);
            this._dngnEnv.Foreground.canvas.addEventListener('click', this._onClick, true);
            var options = {
                preventDefault: true
            };
            window.addEventListener('resize', this._dngnEnv.onResize, true);
            this._dngnEnv.ResetBtn.addEventListener('click', this._onGameReset, true);
            addEventListener('onGameStart', this._onGameStart, true);
            addEventListener('onState', this._onState, true);
            addEventListener('onGameOver', this._onGameOver, true);
        };
        DngnCGame.prototype._onKeyDown = function (ev) {
            console.log('Key Down Event');
        };
        DngnCGame.prototype._onClick = function (ev) {
            console.log('Click Event');
        };
        DngnCGame.prototype._onPan = function (ev) {
            console.log('Pan Event');
        };
        DngnCGame.prototype._onGameReset = function (ev) {
            console.log('Game Reset Event');
        };
        DngnCGame.prototype._onGameStart = function (ev) {
            console.log('Game Start Event');
        };
        DngnCGame.prototype._onState = function (ev) {
            console.log('State Event');
        };
        DngnCGame.prototype._onGameOver = function (ev) {
            console.log('Game Over Event');
        };
        return DngnCGame;
    }());
    exports.DngnCGame = DngnCGame;
});
//# sourceMappingURL=DngnCGame.js.map