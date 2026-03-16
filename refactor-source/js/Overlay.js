"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = require("./GameObject");
var Overlay = /** @class */ (function (_super) {
    __extends(Overlay, _super);
    function Overlay(name) {
        var _this = _super.call(this, 'overlay') || this;
        _this.name = name;
        return _this;
    }
    Overlay.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy, debugMode) {
        // Finally draw the top part with appropriate animation
        var imageWidth = this.pixelWidth;
        var imageHeight = this.pixelHeight;
        var x = Math.round((this.x + this.gridOffsetX) * gridSize + screen.viewportAdjust.x);
        var y = Math.round((this.y + this.gridOffsetY) * gridSize + screen.viewportAdjust.y);
        var imageList = this.spriteArray[this.type];
        var imageIndex = this.stage;
        context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, 0, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
        return;
    };
    return Overlay;
}(GameObject));
module.exports = Overlay;
//# sourceMappingURL=Overlay.js.map