var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DngnCharacter_1 = require("./DngnCharacter");
var NonPlayer = (function (_super) {
    __extends(NonPlayer, _super);
    function NonPlayer(_pid) {
        _super.call(this, this.pid);
    }
    return NonPlayer;
})(DngnCharacter_1.DngnCharacter);
exports.NonPlayer = NonPlayer;
var NPWarrior = (function (_super) {
    __extends(NPWarrior, _super);
    function NPWarrior(_pid) {
        _super.call(this, _pid);
    }
    return NPWarrior;
})(NonPlayer);
exports.NPWarrior = NPWarrior;
var NPMage = (function (_super) {
    __extends(NPMage, _super);
    function NPMage(_pid) {
        _super.call(this, _pid);
    }
    return NPMage;
})(NonPlayer);
exports.NPMage = NPMage;
var NPHealer = (function (_super) {
    __extends(NPHealer, _super);
    function NPHealer(_pid) {
        _super.call(this, _pid);
    }
    return NPHealer;
})(NonPlayer);
exports.NPHealer = NPHealer;
//# sourceMappingURL=DngnNonPlayer.js.map