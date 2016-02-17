define(["require", "exports", "./DngnCMenu", "./DngnCHUD", "./DngnRCU"], function (require, exports, DngnCMenu_1, DngnCHUD_1, DngnRCU_1) {
    "use strict";
    var Environment = (function () {
        function Environment() {
            this._getPageElements();
            this._setCanvas();
            this._setCanvasContext();
            this.rcu = new DngnRCU_1.CanvasUnits();
            this.rcu.setRCU(this.canvfg.width, this.canvfg.height);
            this.characterSprite = {
                male: {
                    warrior: new Image(),
                    mage: null,
                    healer: null
                },
                female: {
                    warrior: null,
                    mage: null,
                    healer: null
                }
            };
            this.classAvatar = { warrior: new Image() };
            this.assetsToLoad = 2;
            this.titleMenu = new DngnCMenu_1.Menu(this.classAvatar);
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
            var _this = this;
            this.characterSprite.male.warrior.src = "textures/warrior_m.png";
            this.classAvatar.warrior.src = "textures/warrior_class_profile.png";
            this.characterSprite.male.warrior.onload = function () { _this.checkAssetsLoaded(callback); };
            this.classAvatar.warrior.onload = function () { _this.checkAssetsLoaded(callback); };
        };
        Environment.prototype.checkAssetsLoaded = function (_done) {
            if (--this.assetsToLoad == 0) {
                _done();
            }
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
                var portraitWidth = (this.wWidth - Math.floor(this.wWidth * 0.01)).toString();
                var portraitHeight = (this.wHeight - Math.floor(this.wHeight * 0.006)).toString();
                this.wOrientation = "portrait";
                this.canvbg.setAttribute('width', portraitWidth);
                this.canvbg.setAttribute('height', portraitHeight);
                this.canvfg.setAttribute('width', portraitWidth);
                this.canvfg.setAttribute('height', portraitHeight);
                this.canvol.setAttribute('width', portraitWidth);
                this.canvol.setAttribute('height', portraitHeight);
            }
        };
        Environment.prototype._setCanvasContext = function () {
            try {
                this.glbg = this.canvbg.getContext("2d");
                this.glfg = this.canvfg.getContext("2d");
                this.glol = this.canvol.getContext("2d");
            }
            catch (e) {
                console.log("Error establishing drawing context.");
            }
        };
        Environment.prototype.promptMenu = function (_callback) {
            if (_callback) {
                this.titleMenu.setLayout(this.glol, this.rcu, this.wOrientation, _callback);
            }
            this.titleMenu.setLayout(this.glol, this.rcu, this.wOrientation);
            this.titleMenu.show(this.glol, this.rcu.getRCU(DngnRCU_1.CAlign.BULLSEYE, this.titleMenu.width, this.titleMenu.height));
        };
        Environment.prototype.hideMenu = function () {
            if (this.titleMenu.displayed)
                this.titleMenu.hide(this.glol);
        };
        Environment.prototype.onResize = function (EnvContext, event) {
            EnvContext._setCanvas();
            EnvContext.rcu.setRCU(EnvContext.canvfg.width, EnvContext.canvfg.height);
            if (EnvContext.titleMenu.displayed)
                EnvContext.promptMenu();
        };
        return Environment;
    }());
    exports.Environment = Environment;
});
//# sourceMappingURL=DngnCEnv.js.map