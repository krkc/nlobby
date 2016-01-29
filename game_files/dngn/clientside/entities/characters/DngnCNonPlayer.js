var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DngnCCharacter"], function (require, exports, DngnCCharacter_1) {
    "use strict";
    var DngnCNonPlayer = (function (_super) {
        __extends(DngnCNonPlayer, _super);
        function DngnCNonPlayer() {
            _super.call(this, this.pid);
        }
        return DngnCNonPlayer;
    }(DngnCCharacter_1.DngnCCharacter));
    exports.DngnCNonPlayer = DngnCNonPlayer;
});
//# sourceMappingURL=DngnCNonPlayer.js.map