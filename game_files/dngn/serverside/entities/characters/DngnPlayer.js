"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DngnCharacter_1 = require("./DngnCharacter");
var DngnPlayer = (function (_super) {
    __extends(DngnPlayer, _super);
    function DngnPlayer(_pid) {
        _super.call(this, _pid);
    }
    DngnPlayer.prototype.move = function (keybd) {
        var Key;
        (function (Key) {
            Key[Key["Left"] = 37] = "Left";
            Key[Key["Up"] = 38] = "Up";
            Key[Key["Right"] = 39] = "Right";
            Key[Key["Down"] = 40] = "Down";
            Key[Key["Space"] = 32] = "Space";
        })(Key || (Key = {}));
        ;
        if (keybd.key == Key.Up) {
        }
        if (keybd.key == Key.Down) {
        }
        if (keybd.key == Key.Left) {
        }
        if (keybd.key == Key.Right) {
        }
    };
    return DngnPlayer;
}(DngnCharacter_1.DngnCharacter));
exports.DngnPlayer = DngnPlayer;
//# sourceMappingURL=DngnPlayer.js.map