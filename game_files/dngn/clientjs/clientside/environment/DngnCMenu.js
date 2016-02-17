define(["require", "exports"], function (require, exports) {
    "use strict";
    var Menu = (function () {
        function Menu(_avatars) {
            this.displayed = false;
            this.width = 0;
            this.height = 0;
            this.position = { x: 0, y: 0 };
            this.heading = { text: "Please choose a class", width: 0,
                height: 0, vOffset: 0, hOffset: 0 };
            this.classProfiles = [new ClassProfile(_avatars.warrior),
                new ClassProfile(_avatars.warrior), new ClassProfile(_avatars.warrior)];
        }
        Menu.prototype.setLayout = function (_glol, _rcu, _orientation) {
            if (_orientation == "landscape") {
                this.width = _rcu.y[79];
                this.height = _rcu.y[74];
                this.heading.height = _rcu.y[5];
            }
            else if (_orientation == "portrait") {
                this.width = _rcu.x[95];
                this.height = _rcu.x[74];
                this.heading.height = _rcu.x[6];
            }
            _glol.font = this.heading.height + "px Arial";
            this.heading.width = _glol.measureText(this.heading.text).width;
            this.heading.vOffset = (this.height * 0.125);
            this.heading.hOffset = (this.width / 2) - (this.heading.width / 2);
            for (var _i = 0, _a = this.classProfiles; _i < _a.length; _i++) {
                var profile = _a[_i];
                profile.width = this.width * 0.2;
                profile.height = this.height * 0.6;
                profile.avatar.width = profile.width;
                profile.avatar.height = profile.height;
                profile.positionOffset.y = (this.height * 0.3);
            }
            this.classProfiles[0].positionOffset.x = ((this.width / 4) - (this.classProfiles[0].width / 2));
            this.classProfiles[1].positionOffset.x = ((this.width / 2) - (this.classProfiles[1].width / 2));
            this.classProfiles[2].positionOffset.x = ((this.width / 4 * 3) - (this.classProfiles[2].width / 2));
        };
        Menu.prototype.show = function (glol, align) {
            this.position.x = align.x;
            this.position.y = align.y;
            glol.fillStyle = "#222288";
            glol.fillRect(this.position.x, this.position.y, this.width, this.height);
            glol.fillStyle = "#aaaaaa";
            glol.fillText(this.heading.text, this.position.x + this.heading.hOffset, this.position.y + this.heading.vOffset);
            for (var _i = 0, _a = this.classProfiles; _i < _a.length; _i++) {
                var _profile = _a[_i];
                glol.drawImage(_profile.avatar, this.position.x + _profile.positionOffset.x, this.position.y + _profile.positionOffset.y, _profile.avatar.width, _profile.avatar.height);
            }
            this.displayed = true;
            return true;
        };
        Menu.prototype.hide = function (glol) {
            glol.clearRect(this.position.x, this.position.y, this.width, this.height);
            this.displayed = false;
        };
        return Menu;
    }());
    exports.Menu = Menu;
    var ClassProfile = (function () {
        function ClassProfile(_avatar) {
            this.width = 0;
            this.height = 0;
            this.positionOffset = { x: 0, y: 0 };
            this.avatar = _avatar;
        }
        return ClassProfile;
    }());
});
//# sourceMappingURL=DngnCMenu.js.map