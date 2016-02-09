define(["require", "exports", "./environment/DngnCEnv"], function (require, exports, DngnCEnv_1) {
    "use strict";
    var DngnCGame = (function () {
        function DngnCGame(conn) {
            this.game = new CGame(conn);
        }
        return DngnCGame;
    }());
    exports.DngnCGame = DngnCGame;
    var Classes;
    (function (Classes) {
        Classes[Classes["Warrior"] = 0] = "Warrior";
        Classes[Classes["Mage"] = 1] = "Mage";
        Classes[Classes["Healer"] = 2] = "Healer";
    })(Classes || (Classes = {}));
    var CGame = (function () {
        function CGame(conn) {
            var _this = this;
            this._ngRoom = null;
            this._dngnEnv = null;
            this._gameLoopID = null;
            this._gameRunning = false;
            this._paused = false;
            this._ngRoom = new NgRoom(conn, function () {
                _this._dngnEnv = new DngnCEnv_1.Environment();
                _this._dngnEnv.loadAssets(function () {
                    window.addEventListener('keydown', function (event) { return _this._onKeyDown(_this, event); }, true);
                    addEventListener('onGameStart', function (event) { return _this._onGameStart(_this, event); }, true);
                    addEventListener('onState', function (event) { return _this._onState(_this, event); }, true);
                    addEventListener('onGameOver', function (event) { return _this._onGameOver(_this, event); }, true);
                    _this._dngnEnv.Overlay.canvas.addEventListener('click', function (event) { return _this._onClick(_this, event); }, true);
                    var options = {
                        preventDefault: true
                    };
                    _this._mc = new Hammer(_this._dngnEnv.canvfg, options);
                    _this._mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                    _this._mc.on("panend", function (event) { return _this._onPan(_this, event); });
                    window.addEventListener('resize', function (event) { return _this._dngnEnv.onResize(_this._dngnEnv, event); }, true);
                    if (_this.promptMenu()) {
                        _this._ngRoom.dataToServer({
                            PlayerReady: {
                                pid: _this._ngRoom.getMyID(),
                                class: Classes.Warrior
                            }
                        });
                    }
                });
            });
        }
        CGame.prototype.promptMenu = function () {
            this._dngnEnv.titleMenu.showText(0, 50, 50, "Some text");
            return true;
        };
        CGame.prototype._onKeyDown = function (GameContext, event) {
            console.log('Key Down Event' + this._ngRoom.getMyID());
        };
        CGame.prototype._onClick = function (GameContext, event) {
            console.log('Click Event');
        };
        CGame.prototype._onPan = function (GameContext, event) {
            console.log('Pan Event');
        };
        CGame.prototype._onGameReset = function (GameContext, event) {
            console.log('Game Reset Event');
        };
        CGame.prototype._onGameStart = function (GameContext, event) {
            console.log('Game Start Event');
        };
        CGame.prototype._onState = function (GameContext, event) {
            console.log('State Event');
        };
        CGame.prototype._onGameOver = function (GameContext, event) {
            console.log('Game Over Event');
        };
        return CGame;
    }());
    exports.CGame = CGame;
});
//# sourceMappingURL=DngnCGame.js.map