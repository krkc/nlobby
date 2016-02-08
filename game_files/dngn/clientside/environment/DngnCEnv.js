define(["require", "exports", "./DngnCMenu", "./DngnCHUD"], function (require, exports, DngnCMenu_1, DngnCHUD_1) {
    "use strict";
    var Environment = (function () {
        function Environment() {
            console.log(this);
            this._getPageElements();
            this._setCanvas();
            this.characterSprite = {
                male: {
                    warrior: null,
                    mage: null,
                    healer: null
                },
                female: {
                    warrior: null,
                    mage: null,
                    healer: null
                }
            };
            this.titleMenu = new DngnCMenu_1.Menu();
            this.hud = new DngnCHUD_1.HUD();
        }
        Object.defineProperty(Environment.prototype, "Foreground", {
            get: function () {
                return this.glfg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "Background", {
            get: function () {
                return this.glbg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "Overlay", {
            get: function () {
                return this.glol;
            },
            enumerable: true,
            configurable: true
        });
        Environment.prototype.loadAssets = function (callback) {
            this.characterSprite.male.warrior = new Image();
            this.characterSprite.male.warrior.src = "warrior_m.png";
            callback();
        };
        Environment.prototype._getPageElements = function () {
            this.canvbg = document.getElementById("canvbg");
            this.canvfg = document.getElementById("canvfg");
            this.canvol = document.getElementById("canvol");
        };
        Environment.prototype._setCanvas = function () {
            this.wWidth = window.innerWidth;
            this.wHeight = window.innerHeight;
            this.existingWidth = this.wWidth;
            if (this.wWidth > this.wHeight) {
                this.wOrientation = "landscape";
                var landscapeHeight = (this.wHeight - Math.floor(this.wHeight * 0.1)).toString();
                var landscapeWidth = (this.wWidth - Math.floor(this.wWidth * 0.4)).toString();
                this.canvbg.setAttribute('width', landscapeWidth);
                this.canvbg.setAttribute('height', landscapeHeight);
                this.canvfg.setAttribute('width', landscapeWidth);
                this.canvfg.setAttribute('height', landscapeHeight);
                this.canvol.setAttribute('width', landscapeWidth);
                this.canvol.setAttribute('height', landscapeHeight);
            }
            else {
                var portraitWidth = (this.wWidth - Math.floor(this.wWidth * 0.0)).toString();
                var portraitHeight = (this.wHeight - Math.floor(this.wHeight * 0.006)).toString();
                this.wOrientation = "portrait";
                this.canvbg.setAttribute('width', portraitWidth);
                this.canvbg.setAttribute('height', portraitHeight);
                this.canvfg.setAttribute('width', portraitWidth);
                this.canvfg.setAttribute('height', portraitHeight);
                this.canvol.setAttribute('width', portraitWidth);
                this.canvol.setAttribute('height', portraitHeight);
            }
            try {
                this.glbg = this.canvbg.getContext("2d");
                this.glfg = this.canvfg.getContext("2d");
                this.glol = this.canvol.getContext("2d");
            }
            catch (e) {
                console.log("Error establishing drawing context.");
            }
        };
        Environment.prototype.onResize = function (EnvContext, event) {
            this._setCanvas();
        };
        return Environment;
    }());
    exports.Environment = Environment;
});
//# sourceMappingURL=DngnCEnv.js.map