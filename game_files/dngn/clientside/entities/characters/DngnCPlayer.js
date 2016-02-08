var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DngnCCharacter"], function (require, exports, DngnCCharacter_1) {
    "use strict";
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(_pid) {
            _super.call(this);
            this.pid = _pid;
        }
        Player.prototype.move = function (keybd) {
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
        return Player;
    }(DngnCCharacter_1.DngnCCharacter));
    exports.Player = Player;
    var PWarrior = (function (_super) {
        __extends(PWarrior, _super);
        function PWarrior(_pid) {
            this._weapon_type = 0;
            _super.call(this, _pid);
        }
        PWarrior.prototype.slash = function () {
            console.log('Warrior: Slash. Weapon type: ' + this._weapon_type);
        };
        return PWarrior;
    }(Player));
    exports.PWarrior = PWarrior;
    var PMage = (function (_super) {
        __extends(PMage, _super);
        function PMage(_pid) {
            this._weapon_type = 1;
            _super.call(this, _pid);
        }
        PMage.prototype.cast = function () {
            console.log('Mage: Cast. Weapon type: ' + this._weapon_type);
        };
        return PMage;
    }(Player));
    exports.PMage = PMage;
    var PHealer = (function (_super) {
        __extends(PHealer, _super);
        function PHealer(_pid) {
            this._weapon_type = 2;
            _super.call(this, _pid);
        }
        PHealer.prototype.heal = function () {
            console.log('Healer: Heal. Weapon type: ' + this._weapon_type);
        };
        return PHealer;
    }(Player));
    exports.PHealer = PHealer;
});
//# sourceMappingURL=DngnCPlayer.js.map