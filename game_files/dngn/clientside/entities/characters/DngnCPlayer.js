var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DngnCCharacter"], function (require, exports, DngnCCharacter_1) {
    "use strict";
    var DngnCPlayer = (function (_super) {
        __extends(DngnCPlayer, _super);
        function DngnCPlayer(_pid) {
            _super.call(this, _pid);
        }
        return DngnCPlayer;
    }(DngnCCharacter_1.DngnCCharacter));
    exports.DngnCPlayer = DngnCPlayer;
});
//# sourceMappingURL=DngnCPlayer.js.map