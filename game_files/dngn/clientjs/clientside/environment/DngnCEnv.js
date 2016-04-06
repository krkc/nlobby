define(["require", "exports", "./DngnCMenu", "./DngnCHUD", "./DngnRCU"], function (require, exports, DngnCMenu_1, DngnCHUD_1, DngnRCU_1) {
    "use strict";
    var Environment = (function () {
        function Environment() {
            this._getPageElements();
            this._setCanvas();
            this._setCanvasContext();
            this.rcu = new DngnRCU_1.CanvasUnits();
            this.rcu.setRCU(this.canvfg.width, this.canvfg.height);
            this.bgStateChanged = true;
            this.backgroundSprite = new Image();
            this.characterSprite = { warrior_m: new Image() };
            this.classAvatar = { warrior: new Image() };
            this.assetsToLoad = 3;
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
        Object.defineProperty(Environment.prototype, "Overlay", {
            get: function () {
                return this.glol;
            },
            enumerable: true,
            configurable: true
        });
        Environment.prototype.loadAssets = function (callback) {
            var _this = this;
            this.backgroundSprite.src = "textures/brick_1.png";
            this.characterSprite["warrior_m"].src = "textures/warrior_m.png";
            this.classAvatar.warrior.src = "textures/warrior_class_profile.png";
            this.backgroundSprite.onload = function () { _this.checkAssetsLoaded(callback); };
            this.characterSprite["warrior_m"].onload = function () { _this.checkAssetsLoaded(callback); };
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
                var landscapeHeight = Math.floor(this.wHeight - (this.wHeight * 0.1)).toString();
                var landscapeWidth = Math.floor(this.wWidth - (this.wWidth * 0.4)).toString();
                this.canvbg.setAttribute('width', landscapeWidth);
                this.canvbg.setAttribute('height', landscapeHeight);
                this.canvfg.setAttribute('width', landscapeWidth);
                this.canvfg.setAttribute('height', landscapeHeight);
                this.canvol.setAttribute('width', landscapeWidth);
                this.canvol.setAttribute('height', landscapeHeight);
            }
            else {
                var portraitWidth = Math.floor(this.wWidth - (this.wWidth * 0.01)).toString();
                var portraitHeight = Math.floor(this.wHeight - (this.wHeight * 0.006)).toString();
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
        Environment.prototype.drawScene = function (ents) {
            this.glfg.clearRect(0, 0, this.canvfg.width, this.canvfg.height);
            for (var _i = 0, ents_1 = ents; _i < ents_1.length; _i++) {
                var ent = ents_1[_i];
                this.glfg.drawImage(this.characterSprite[ent.spriteName], this.rcu.x[ent._location.x], this.rcu.y[ent._location.y], this.rcu.x[ent.width], this.rcu.y[ent.height]);
            }
        };
        Environment.prototype.drawBackground = function () {
            this.glbg.drawImage(this.backgroundSprite, 0, 0, this.canvbg.width, this.canvbg.height);
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