"use strict";
var DngnEnums_1 = require("../../DngnEnums");
var MAX_VEL = 5;
var MAX_ACC = 3;
var CHAR_WIDTH = 5;
var CHAR_HEIGHT = 6;
var DngnCharacter = (function () {
    function DngnCharacter(_pid) {
        this.pid = _pid;
        this._location = { x: 10, y: 90 };
        this._velocity = { x: 0, y: 0 };
        this._acceleration = { x: 0, y: 0 };
        this._direction = DngnEnums_1.Direction.EAST;
    }
    DngnCharacter.prototype.startMove = function (_key) {
        if (_key == DngnEnums_1.Key.Up) {
            this._direction = DngnEnums_1.Direction.NORTH;
            if (this._acceleration.y >= -MAX_ACC)
                this._acceleration.y += -1;
            if (this._velocity.y >= -MAX_VEL)
                this._velocity.y += this._acceleration.y;
        }
        if (_key == DngnEnums_1.Key.Down) {
            this._direction = DngnEnums_1.Direction.SOUTH;
            if (this._acceleration.y <= MAX_ACC)
                this._acceleration.y += 1;
            if (this._velocity.y <= MAX_VEL)
                this._velocity.y += this._acceleration.y;
        }
        if (_key == DngnEnums_1.Key.Left) {
            this._direction = DngnEnums_1.Direction.WEST;
            if (this._acceleration.y >= -MAX_ACC)
                this._acceleration.y += 1;
            if (this._velocity.x >= -MAX_VEL)
                this._velocity.x += this._acceleration.x;
        }
        if (_key == DngnEnums_1.Key.Right) {
            this._direction = DngnEnums_1.Direction.EAST;
            if (this._acceleration.y <= MAX_ACC)
                this._acceleration.y += -1;
            if (this._velocity.x <= MAX_VEL)
                this._velocity.x += this._acceleration.x;
        }
        this.move(true);
    };
    DngnCharacter.prototype.move = function (_accelerating) {
        if (this._velocity.x == 0 && this._velocity.y == 0)
            return null;
        if (this._velocity.x != 0) {
            this._location.x += this._velocity.x;
            if (!_accelerating)
                this._velocity.x += this._acceleration.x;
        }
        if (this._velocity.y != 0) {
            this._location.y += this._velocity.y;
            if (!_accelerating)
                this._velocity.y += this._acceleration.y;
        }
        return this.getSides();
    };
    DngnCharacter.prototype.testXCollisions = function (_x1, _x2) {
        var myx2 = (this._location.x + CHAR_WIDTH);
        if (this._location.x >= _x1 && myx2 <= _x2) {
            return true;
        }
        else if (myx2 >= _x1 && this._location.x <= _x2) {
            return true;
        }
        else if (_x1 >= this._location.x && _x2 <= myx2) {
            return true;
        }
        else if (_x2 >= myx2 && _x1 <= this._location.x) {
            return true;
        }
        else {
            return false;
        }
    };
    DngnCharacter.prototype.textYCollisions = function (_y1, _y2) {
        var myy2 = (this._location.y + CHAR_HEIGHT);
        if (this._location.y >= _y1 && myy2 <= _y2) {
            return true;
        }
        else if (myy2 >= _y1 && this._location.x <= _y2) {
            return true;
        }
        else if (_y1 >= this._location.y && _y2 <= myy2) {
            return true;
        }
        else if (_y2 >= myy2 && _y1 <= this._location.y) {
            return true;
        }
        else {
            return false;
        }
    };
    DngnCharacter.prototype.getSides = function () {
        return [this._location.x, (this._location.x + CHAR_WIDTH),
            this._location.y, (this._location.y + CHAR_HEIGHT)];
    };
    return DngnCharacter;
}());
exports.DngnCharacter = DngnCharacter;
//# sourceMappingURL=DngnCharacter.js.map