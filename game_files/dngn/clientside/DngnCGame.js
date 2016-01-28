define(["require", "exports"], function (require, exports) {
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
                console.log('Success!!');
            });
        }
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
        DngnCGame.prototype._onKeyDown = function () {
            console.log('Key Down Event');
        };
        DngnCGame.prototype._onClick = function () {
            console.log('Click Event');
        };
        DngnCGame.prototype._onPan = function () {
            console.log('Pan Event');
        };
        DngnCGame.prototype._onGameReset = function () {
            console.log('Game Reset Event');
        };
        DngnCGame.prototype._onGameStart = function () {
            console.log('Game Start Event');
        };
        DngnCGame.prototype._onState = function () {
            console.log('State Event');
        };
        DngnCGame.prototype._onGameOver = function () {
            console.log('Game Over Event');
        };
        return DngnCGame;
    }());
    exports.DngnCGame = DngnCGame;
});
//# sourceMappingURL=DngnCGame.js.map