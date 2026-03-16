"use strict";
var Rectangle = require("./Rectangle");
var GameObject = /** @class */ (function () {
    function GameObject(type) {
        this.type = type;
    }
    GameObject.prototype.underPoint = function (x, y, gridSize) {
        var xo = this.x * gridSize + this.pixelOffsetX;
        var yo = this.y * gridSize + this.pixelOffsetY;
        var x1 = xo + this.pixelLeft;
        var y1 = yo + this.pixelTop;
        var x2 = x1 + this.pixelWidth;
        var y2 = y1 + this.pixelHeight;
        //
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    };
    GameObject.prototype.drawSelection = function (context, gridSize, screen, sidebar) {
        if (this.selected) {
            context.strokeStyle = 'white';
            //context.strokeWidth = 4;
            var selectBarSize = 5;
            var bounds = this.getSelectionBounds(gridSize, screen);
            // First draw the white bracket
            context.beginPath();
            //alert(x1);
            context.moveTo(bounds.left, bounds.top + selectBarSize);
            context.lineTo(bounds.left, bounds.top);
            context.lineTo(bounds.left + selectBarSize, bounds.top);
            context.moveTo(bounds.right - selectBarSize, bounds.top);
            context.lineTo(bounds.right, bounds.top);
            context.lineTo(bounds.right, bounds.top + selectBarSize);
            context.moveTo(bounds.right, bounds.bottom - selectBarSize);
            context.lineTo(bounds.right, bounds.bottom);
            context.lineTo(bounds.right - selectBarSize, bounds.bottom);
            context.moveTo(bounds.left + selectBarSize, bounds.bottom);
            context.lineTo(bounds.left, bounds.bottom);
            context.lineTo(bounds.left, bounds.bottom - selectBarSize);
            context.stroke();
        }
    };
    GameObject.prototype.getSelectionBounds = function (gridSize, screen) {
        var x = this.x * gridSize + screen.viewportAdjust.x + this.pixelOffsetX;
        var y = this.y * gridSize + screen.viewportAdjust.y + this.pixelOffsetY;
        var x1 = x + this.pixelLeft;
        var y1 = y + this.pixelTop;
        return new Rectangle(x1, y1, this.pixelWidth, this.pixelHeight);
    };
    GameObject.prototype.findAngle = function (object, unit, base) {
        if (unit === void 0) { unit = this; }
        if (base === void 0) { base = 32; }
        var dy = object.y - unit.y;
        var dx = object.x - unit.x;
        if (unit.type == 'turret') {
            dy = dy - 0.5;
            dx = dx - 0.5;
        }
        var angle = base / 2 + Math.round(Math.atan2(dx, dy) * base / (2 * Math.PI));
        if (angle < 0) {
            angle += base;
        }
        if (angle >= base) {
            angle -= base;
        }
        return angle;
    };
    GameObject.prototype.addAngle = function (angle, increment, base) {
        angle = Math.round(angle) + increment;
        if (angle > base - 1) {
            angle -= base;
        }
        if (angle < 0) {
            angle += base;
        }
        return angle;
    };
    GameObject.prototype.angleDiff = function (angle1, angle2, base) {
        angle1 = Math.floor(angle1);
        angle2 = Math.floor(angle2);
        if (angle1 >= base / 2) {
            angle1 = angle1 - base;
        }
        if (angle2 >= base / 2) {
            angle2 = angle2 - base;
        }
        var diff = angle2 - angle1;
        if (diff < -base / 2) {
            diff += base;
        }
        if (diff > base / 2) {
            diff -= base;
        }
        return diff;
    };
    return GameObject;
}());
module.exports = GameObject;
//# sourceMappingURL=GameObject.js.map