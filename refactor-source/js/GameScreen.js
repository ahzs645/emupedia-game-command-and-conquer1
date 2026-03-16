"use strict";
var Point = require("./Point");
var Rectangle = require("./Rectangle");
var GameScreen = /** @class */ (function () {
    function GameScreen(width, height) {
        this.mapImageSize = {
            width: 0, height: 0
        };
        this.width = width;
        this.height = height;
        this.viewport = new Rectangle(0, 0, 0, 0);
        this.viewportOffset = new Point(0, 0);
        this.viewportDelta = new Point(0, 0);
        this.viewportAdjust = new Point(0, 0);
    }
    return GameScreen;
}());
module.exports = GameScreen;
//# sourceMappingURL=GameScreen.js.map