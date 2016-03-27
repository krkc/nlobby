var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../DngnEntity"], function (require, exports, DngnEntity_1) {
    var CHAR_WIDTH = 30;
    var CHAR_HEIGHT = 40;
    var DngnCharacter = (function (_super) {
        __extends(DngnCharacter, _super);
        function DngnCharacter(_pid) {
            this.pid = _pid;
            this.width = CHAR_WIDTH;
            this.height = CHAR_HEIGHT;
            _super.call(this);
        }
        return DngnCharacter;
    })(DngnEntity_1.Entity);
    exports.DngnCharacter = DngnCharacter;
});
//# sourceMappingURL=DngnCharacter.js.map