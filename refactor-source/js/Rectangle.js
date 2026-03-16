"use strict";
var Rectangle = /** @class */ (function () {
    function Rectangle(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () {
            return this.left + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () {
            return this.top + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Rectangle.prototype.intersect = function (other) {
        var x = Math.max(this.left, other.left), num1 = Math.min(this.left + this.width, other.left + other.width), y = Math.max(this.top, other.top), num2 = Math.min(this.top + this.height, other.top + other.height);
        if (num1 >= x && num2 >= y)
            return new Rectangle(x, y, num1 - x, num2 - y);
        else
            return Rectangle.empty;
    };
    Object.defineProperty(Rectangle, "empty", {
        get: function () {
            return this._empty;
        },
        enumerable: false,
        configurable: true
    });
    Rectangle._empty = new Rectangle(0, 0, 0, 0);
    return Rectangle;
}());
module.exports = Rectangle;
//# sourceMappingURL=Rectangle.js.map