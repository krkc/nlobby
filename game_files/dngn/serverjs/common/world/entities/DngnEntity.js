var DngnEnums_1 = require("../../../common/DngnEnums");
var Entity = (function () {
    function Entity() {
        this._entityID = 0;
        this._location = { x: 10, y: 90 };
        this._velocity = { x: 0, y: 0 };
        this._acceleration = { x: 0, y: 0 };
        this._direction = DngnEnums_1.Direction.EAST;
    }
    return Entity;
})();
exports.Entity = Entity;
//# sourceMappingURL=DngnEntity.js.map