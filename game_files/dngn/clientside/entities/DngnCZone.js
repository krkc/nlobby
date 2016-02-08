define(["require", "exports", "./characters/DngnCPlayer"], function (require, exports, DngnCPlayer_1) {
    "use strict";
    var Zone = (function () {
        function Zone() {
            this._players = [];
            this._npcs = [];
        }
        Zone.prototype.addPlayer = function (pid) {
            if (pid) {
                try {
                    this._players.push(new DngnCPlayer_1.PWarrior(pid));
                    this._players.push(new DngnCPlayer_1.PMage(pid));
                    this._players.push(new DngnCPlayer_1.PHealer(pid));
                }
                catch (e) {
                    console.log('Error: Unable to add a new player to the game. ' + e);
                    return false;
                }
                var warrior = this._players[0];
                var mage = this._players[1];
                var healer = this._players[2];
                warrior.slash();
                mage.cast();
                healer.heal();
                return true;
            }
        };
        Zone.prototype.removePlayer = function (pid) {
            if (pid) {
                var playerToRemove = void 0;
                for (var _i = 0, _a = this._players; _i < _a.length; _i++) {
                    var player = _a[_i];
                    if (player.pid === pid) {
                        playerToRemove = player;
                    }
                }
                if (playerToRemove) {
                    try {
                        this._players.splice(this._players.indexOf(playerToRemove), 1);
                    }
                    catch (e) {
                        console.log('Error: unable to remove the player from the game. ' + e);
                        return false;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        return Zone;
    }());
    exports.Zone = Zone;
});
//# sourceMappingURL=DngnCZone.js.map