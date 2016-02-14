define(["require", "exports", "./environment/DngnCEnv", "../common/DngnMessages", "../common/world/entities/characters/DngnClasses"], function (require, exports, DngnCEnv_1, DngnMessages_1, DngnClasses_1) {
    var DngnCGame = (function () {
        function DngnCGame(conn) {
            this.game = new CGame(conn);
        }
        return DngnCGame;
    })();
    exports.DngnCGame = DngnCGame;
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
                    addEventListener('onGameStart', function (event) { return _this.onGameStart(_this, event); }, true);
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
                        _this._ngRoom.dataToServer(DngnMessages_1.ClientStatusMsg.ready(_this._ngRoom.getMyID(), DngnClasses_1.Classes.Warrior));
                    }
                });
            });
        }
        CGame.prototype.promptMenu = function () {
            this._dngnEnv.titleMenu.showText(0, 50, 50, "Some text");
            return true;
        };
        CGame.prototype._onKeyDown = function (GameContext, event) {
            if (GameContext._gameRunning) {
                if (event.keyCode == DngnMessages_1.Key.Up) {
                    GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.NORTH));
                }
                if (event.keyCode == DngnMessages_1.Key.Down) {
                    GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.SOUTH));
                }
                if (event.keyCode == DngnMessages_1.Key.Left) {
                    GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.WEST));
                }
                if (event.keyCode == DngnMessages_1.Key.Right) {
                    GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.EAST));
                }
                if (event.keyCode == DngnMessages_1.Key.Space) {
                    GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.keyDown(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.NORTH));
                }
            }
        };
        CGame.prototype._onClick = function (GameContext, event) {
            GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.click(GameContext._ngRoom.getMyID(), event.clientX, event.clientY));
        };
        CGame.prototype._onPan = function (GameContext, event) {
            if (event.direction == 8) {
                GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.NORTH));
            }
            if (event.direction == 16) {
                GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.SOUTH));
            }
            if (event.direction == 4) {
                GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.EAST));
            }
            if (event.direction == 2) {
                GameContext._ngRoom.dataToServer(DngnMessages_1.ClientInputMsg.pan(GameContext._ngRoom.getMyID(), DngnMessages_1.Direction.WEST));
            }
        };
        CGame.prototype._onGameReset = function (GameContext, event) {
            console.log('Game Reset Event');
        };
        CGame.prototype.onGameStart = function (GameContext, event) {
            console.log('Game Start Event');
            GameContext._gameRunning = true;
        };
        CGame.prototype._onState = function (GameContext, event) {
            console.log('State Event');
        };
        CGame.prototype._onGameOver = function (GameContext, event) {
            console.log('Game Over Event');
        };
        return CGame;
    })();
    exports.CGame = CGame;
});
//# sourceMappingURL=DngnCGame.js.map