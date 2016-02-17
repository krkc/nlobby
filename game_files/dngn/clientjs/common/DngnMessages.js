define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (Direction) {
        Direction[Direction["NORTH"] = 0] = "NORTH";
        Direction[Direction["SOUTH"] = 1] = "SOUTH";
        Direction[Direction["EAST"] = 2] = "EAST";
        Direction[Direction["WEST"] = 3] = "WEST";
    })(exports.Direction || (exports.Direction = {}));
    var Direction = exports.Direction;
    ;
    (function (Key) {
        Key[Key["Left"] = 37] = "Left";
        Key[Key["Up"] = 38] = "Up";
        Key[Key["Right"] = 39] = "Right";
        Key[Key["Down"] = 40] = "Down";
        Key[Key["Space"] = 32] = "Space";
        Key[Key["One"] = 49] = "One";
        Key[Key["Two"] = 50] = "Two";
        Key[Key["Three"] = 51] = "Three";
    })(exports.Key || (exports.Key = {}));
    var Key = exports.Key;
    ;
    var ClientInputMsg = (function () {
        function ClientInputMsg() {
        }
        ClientInputMsg.keyDown = function (_pid, _direction) {
            return {
                pid: _pid,
                keybd: { direction: _direction }
            };
        };
        ClientInputMsg.click = function (_pid, _x, _y) {
            return {
                pid: _pid,
                mouse: { x: _x, y: _y }
            };
        };
        ClientInputMsg.pan = function (_pid, _direction) {
            return {
                pid: _pid,
                touch: { direction: _direction }
            };
        };
        return ClientInputMsg;
    }());
    exports.ClientInputMsg = ClientInputMsg;
    var ClientStatusMsg = (function () {
        function ClientStatusMsg() {
        }
        ClientStatusMsg.ready = function (_pid, _class) {
            return {
                PlayerReady: {
                    pid: _pid,
                    class: _class
                }
            };
        };
        return ClientStatusMsg;
    }());
    exports.ClientStatusMsg = ClientStatusMsg;
    var ServerStatusMsg = (function () {
        function ServerStatusMsg() {
        }
        return ServerStatusMsg;
    }());
    exports.ServerStatusMsg = ServerStatusMsg;
});
//# sourceMappingURL=DngnMessages.js.map