define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (CAlign) {
        CAlign[CAlign["TOP_LEFT"] = 0] = "TOP_LEFT";
        CAlign[CAlign["TOP_RIGHT"] = 1] = "TOP_RIGHT";
        CAlign[CAlign["BOTTOM_LEFT"] = 2] = "BOTTOM_LEFT";
        CAlign[CAlign["BOTTOM_RIGHT"] = 3] = "BOTTOM_RIGHT";
        CAlign[CAlign["TOP_XCENTERED"] = 4] = "TOP_XCENTERED";
        CAlign[CAlign["BOTTOM_XCENTERED"] = 5] = "BOTTOM_XCENTERED";
        CAlign[CAlign["LEFT_YCENTERED"] = 6] = "LEFT_YCENTERED";
        CAlign[CAlign["RIGHT_YCENTERED"] = 7] = "RIGHT_YCENTERED";
        CAlign[CAlign["BULLSEYE"] = 8] = "BULLSEYE";
    })(exports.CAlign || (exports.CAlign = {}));
    var CAlign = exports.CAlign;
    var CanvasUnits = (function () {
        function CanvasUnits() {
            this.x = [];
            this.y = [];
        }
        CanvasUnits.prototype.setRCU = function (_cwidth, _cheight) {
            while (this.x.length > 0)
                this.x.pop();
            while (this.y.length > 0)
                this.y.pop();
            for (var i = 0; i <= 1; i += 0.01) {
                this.x.push(Math.floor(_cwidth * i));
                this.y.push(Math.floor(_cheight * i));
            }
        };
        CanvasUnits.prototype.getRCU = function (align, width, height) {
            if (align == CAlign.TOP_LEFT)
                return { x: 0, y: 0 };
            if (align == CAlign.TOP_RIGHT)
                return { x: this.x[100] - width, y: 0 };
            if (align == CAlign.BOTTOM_LEFT)
                return { x: 0, y: this.y[100] - height };
            if (align == CAlign.BOTTOM_RIGHT)
                return { x: this.x[100] - width, y: this.y[100] - height };
            if (align == CAlign.TOP_XCENTERED)
                return { x: this.x[50] - (width / 2), y: 0 };
            if (align == CAlign.BOTTOM_XCENTERED)
                return { x: this.x[50] - (width / 2), y: this.y[100] - height };
            if (align == CAlign.LEFT_YCENTERED)
                return { x: 0, y: this.y[50] - (width / 2) };
            if (align == CAlign.RIGHT_YCENTERED)
                return { x: this.x[100] - width, y: this.y[50] - (width / 2) };
            if (align == CAlign.BULLSEYE)
                return { x: this.x[50] - (width / 2), y: this.y[50] - (width / 2) };
        };
        return CanvasUnits;
    }());
    exports.CanvasUnits = CanvasUnits;
});
//# sourceMappingURL=DngnRCU.js.map