"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DngnCharacter_1 = require("./DngnCharacter");
var DngnNonPlayer = (function (_super) {
    __extends(DngnNonPlayer, _super);
    function DngnNonPlayer() {
        _super.call(this, this.pid);
    }
    return DngnNonPlayer;
}(DngnCharacter_1.DngnCharacter));
exports.DngnNonPlayer = DngnNonPlayer;
//# sourceMappingURL=DngnNonPlayer.js.map