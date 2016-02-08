var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DngnCCharacter"], function (require, exports, DngnCCharacter_1) {
    "use strict";
    var NonPlayer = (function (_super) {
        __extends(NonPlayer, _super);
        function NonPlayer() {
            _super.call(this);
        }
        return NonPlayer;
    }(DngnCCharacter_1.DngnCCharacter));
    exports.NonPlayer = NonPlayer;
    var NPWarrior = (function (_super) {
        __extends(NPWarrior, _super);
        function NPWarrior() {
            _super.call(this);
        }
        NPWarrior.prototype.slash = function () {
        };
        return NPWarrior;
    }(NonPlayer));
    exports.NPWarrior = NPWarrior;
    var NPMage = (function (_super) {
        __extends(NPMage, _super);
        function NPMage() {
            _super.call(this);
        }
        NPMage.prototype.cast = function () {
        };
        return NPMage;
    }(NonPlayer));
    exports.NPMage = NPMage;
    var NPHealer = (function (_super) {
        __extends(NPHealer, _super);
        function NPHealer() {
            _super.call(this);
        }
        NPHealer.prototype.heal = function () {
        };
        return NPHealer;
    }(NonPlayer));
    exports.NPHealer = NPHealer;
});
//# sourceMappingURL=DngnCNonPlayer.js.map