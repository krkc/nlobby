define(["require", "exports", "./entities/characters/DngnPlayer", "../DngnEnums"], function (require, exports, DngnPlayer_1, DngnEnums_1) {
    var Classes;
    (function (Classes) {
        Classes[Classes["Warrior"] = 0] = "Warrior";
        Classes[Classes["Mage"] = 1] = "Mage";
        Classes[Classes["Healer"] = 2] = "Healer";
    })(Classes || (Classes = {}));
    var Zone = (function () {
        function Zone() {
            this._players = [];
            this._npcs = [];
            this._topSideMap = {};
            this._bottomSideMap = {};
            this._leftSideMap = {};
            this._rightSideMap = {};
            this._playersMoving = [];
        }
        Zone.prototype.addPlayer = function (_pid, _class) {
            if (_class == Classes.Warrior) {
                this._players.push(new DngnPlayer_1.PWarrior(_pid));
            }
            else if (_class == Classes.Mage) {
                this._players.push(new DngnPlayer_1.PMage(_pid));
            }
            else if (_class == Classes.Healer) {
                this._players.push(new DngnPlayer_1.PHealer(_pid));
            }
            var _pl = this._players[this._players.length - 1];
            var _sides = _pl.getSides();
            this.addToMap(this._leftSideMap, _sides[0], _pl);
            this.addToMap(this._rightSideMap, _sides[1], _pl);
            this.addToMap(this._topSideMap, _sides[2], _pl);
            this.addToMap(this._bottomSideMap, _sides[3], _pl);
        };
        Zone.prototype.removePlayer = function () {
        };
        Zone.prototype.run = function () {
            for (var _i = 0, _a = this._players; _i < _a.length; _i++) {
                var player = _a[_i];
                var _lastSidesPos = player.getSides();
                var _playerSidesPos = player.move();
                if (_playerSidesPos) {
                    var collidingEntities = [];
                    this.updateBoundaries(player, _lastSidesPos, _playerSidesPos);
                    this.findCollisions(collidingEntities, player._direction, _playerSidesPos);
                    this.handleCollision(collidingEntities);
                }
            }
        };
        Zone.prototype.addToMap = function (_map, _side, _pl) {
            if (_map[_side]) {
                _map[_side].push(_pl);
            }
            else {
                _map[_side] = [_pl];
            }
        };
        Zone.prototype.removeFromMap = function (_map, _side, _pl) {
            var parallelSides = _map[_side];
            if (parallelSides.length <= 1) {
                delete _map[_side];
            }
            else {
                parallelSides.splice(parallelSides.indexOf(_pl), 1);
            }
        };
        Zone.prototype.updateBoundaries = function (_player, _lastSides, _newSides) {
            if (_player._direction == DngnEnums_1.Direction.NORTH ||
                _player._direction == DngnEnums_1.Direction.SOUTH) {
                this.removeFromMap(this._topSideMap, _lastSides[2], _player);
                this.addToMap(this._topSideMap, _newSides[2], _player);
                this.removeFromMap(this._bottomSideMap, _lastSides[3], _player);
                this.addToMap(this._bottomSideMap, _newSides[3], _player);
            }
            if (_player._direction == DngnEnums_1.Direction.EAST ||
                _player._direction == DngnEnums_1.Direction.WEST) {
                this.removeFromMap(this._leftSideMap, _lastSides[0], _player);
                this.addToMap(this._leftSideMap, _newSides[0], _player);
                this.removeFromMap(this._rightSideMap, _lastSides[1], _player);
                this.addToMap(this._rightSideMap, _newSides[1], _player);
            }
        };
        Zone.prototype.findCollisions = function (_entityArr, _direction, _playerSides) {
            if (_direction == DngnEnums_1.Direction.NORTH) {
                if (this._bottomSideMap[_playerSides[2]]) {
                    var plArr = this._bottomSideMap[_playerSides[2]];
                    for (var _i = 0; _i < plArr.length; _i++) {
                        var pl = plArr[_i];
                        if (pl.testXCollisions(_playerSides[0], _playerSides[1])) {
                            _entityArr.push(pl);
                        }
                    }
                }
            }
            if (_direction == DngnEnums_1.Direction.SOUTH) {
                if (this._topSideMap[_playerSides[3]]) {
                    var plArr = this._topSideMap[_playerSides[2]];
                    for (var _a = 0; _a < plArr.length; _a++) {
                        var pl = plArr[_a];
                        if (pl.testXCollisions(_playerSides[0], _playerSides[1])) {
                            _entityArr.push(pl);
                        }
                    }
                }
            }
            if (_direction == DngnEnums_1.Direction.EAST) {
                if (this._leftSideMap[_playerSides[1]]) {
                    var plArr = this._leftSideMap[_playerSides[2]];
                    for (var _b = 0; _b < plArr.length; _b++) {
                        var pl = plArr[_b];
                        if (pl.textYCollisions(_playerSides[2], _playerSides[3])) {
                            _entityArr.push(pl);
                        }
                    }
                }
            }
            if (_direction == DngnEnums_1.Direction.WEST) {
                if (this._rightSideMap[_playerSides[0]]) {
                    var plArr = this._rightSideMap[_playerSides[2]];
                    for (var _c = 0; _c < plArr.length; _c++) {
                        var pl = plArr[_c];
                        if (pl.textYCollisions(_playerSides[2], _playerSides[3])) {
                            _entityArr.push(pl);
                        }
                    }
                }
            }
        };
        Zone.prototype.handleCollision = function (_entityArr) {
            console.log('Collision detected.');
        };
        return Zone;
    })();
    exports.Zone = Zone;
});
//# sourceMappingURL=DngnZone.js.map