var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DngnCharacter_1 = require("./DngnCharacter");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(_pid) {
        if (_pid)
            _super.call(this, _pid);
        else
            _super.call(this, "NULLPLAYER");
    }
    return Player;
})(DngnCharacter_1.DngnCharacter);
exports.Player = Player;
var PWarrior = (function (_super) {
    __extends(PWarrior, _super);
    function PWarrior(_pid) {
        _super.call(this, _pid);
        this._weapon_type = 0;
        this.spriteName = "warrior_m";
    }
    PWarrior.prototype.slash = function () {
        console.log('Warrior: Slash. Weapon type: ' + this._weapon_type);
    };
    return PWarrior;
})(Player);
exports.PWarrior = PWarrior;
var PMage = (function (_super) {
    __extends(PMage, _super);
    function PMage(_pid) {
        _super.call(this, _pid);
        this._weapon_type = 1;
    }
    PMage.prototype.cast = function () {
        console.log('Mage: Cast. Weapon type: ' + this._weapon_type);
    };
    return PMage;
})(Player);
exports.PMage = PMage;
var PHealer = (function (_super) {
    __extends(PHealer, _super);
    function PHealer(_pid) {
        _super.call(this, _pid);
        this._weapon_type = 2;
    }
    PHealer.prototype.heal = function () {
        console.log('Healer: Heal. Weapon type:  ' + this._weapon_type);
    };
    return PHealer;
})(Player);
exports.PHealer = PHealer;
//# sourceMappingURL=DngnPlayer.js.map