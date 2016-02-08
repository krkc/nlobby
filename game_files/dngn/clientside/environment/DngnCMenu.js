define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (textAlign) {
        textAlign[textAlign["NONE"] = 0] = "NONE";
        textAlign[textAlign["TOP"] = 1] = "TOP";
        textAlign[textAlign["BOTTOM"] = 2] = "BOTTOM";
        textAlign[textAlign["LEFT"] = 3] = "LEFT";
        textAlign[textAlign["RIGHT"] = 4] = "RIGHT";
        textAlign[textAlign["XCENTERED"] = 5] = "XCENTERED";
        textAlign[textAlign["YCENTERED"] = 6] = "YCENTERED";
        textAlign[textAlign["TOP_LEFT"] = 7] = "TOP_LEFT";
        textAlign[textAlign["TOP_RIGHT"] = 8] = "TOP_RIGHT";
        textAlign[textAlign["BOTTOM_LEFT"] = 9] = "BOTTOM_LEFT";
        textAlign[textAlign["BOTTOM_RIGHT"] = 10] = "BOTTOM_RIGHT";
        textAlign[textAlign["TOP_XCENTERED"] = 11] = "TOP_XCENTERED";
        textAlign[textAlign["BOTTOM_XCENTERED"] = 12] = "BOTTOM_XCENTERED";
        textAlign[textAlign["LEFT_YCENTERED"] = 13] = "LEFT_YCENTERED";
        textAlign[textAlign["RIGHT_YCENTERED"] = 14] = "RIGHT_YCENTERED";
    })(exports.textAlign || (exports.textAlign = {}));
    var textAlign = exports.textAlign;
    var Menu = (function () {
        function Menu() {
        }
        Menu.prototype.showText = function (align, width, height, text, x_position, y_position) {
            if (align == textAlign.NONE) {
            }
        };
        return Menu;
    }());
    exports.Menu = Menu;
});
//# sourceMappingURL=DngnCMenu.js.map