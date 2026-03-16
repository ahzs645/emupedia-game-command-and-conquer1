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
var VisualObject = require("./VisualObject");
var Overlay = require("./Overlay");
var OverlayFactory = /** @class */ (function (_super) {
    __extends(OverlayFactory, _super);
    function OverlayFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = [];
        _this.overlayDetails = {
            'tiberium': {
                name: 'tiberium',
                count: 2,
                pixelWidth: 24,
                pixelHeight: 24,
                stageCount: 12,
                gridOffsetX: 0,
                gridOffsetY: 0,
                imagesToLoad: [
                    { name: '0', count: 12 },
                    { name: '1', count: 12 }
                ]
            },
            'tree': {
                name: 'tree',
                count: 1,
                stageCount: 10,
                pixelWidth: 48,
                pixelHeight: 48,
                gridOffsetX: 0,
                gridOffsetY: -1,
                imagesToLoad: [
                    { name: '0', count: 10 },
                    { name: '1', count: 10 },
                    { name: '2', count: 10 }
                ]
            },
            'trees': {
                name: 'trees',
                count: 1,
                stageCount: 10,
                gridOffsetX: 0,
                gridOffsetY: -1,
                pixelWidth: 72,
                pixelHeight: 48,
                imagesToLoad: [
                    { name: '0', count: 10 }
                ]
            }
        };
        _this.loaded = true;
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    OverlayFactory.prototype.load = function (name) {
        var overlay = new Overlay(name);
        var details = this.overlayDetails[name];
        this.loadSpriteSheet(overlay, details, 'tiles/temperate');
        /*
        var imageArray = [];
        for(i=0;i<details.count;i++){
            imageArray[i] = this.loadImageArray('tiles/temperate/'+name+'/'+name+'-'+i,details.stageCount,'.gif');
        }
        overlayType.imageArray = imageArray;
        */
        $.extend(overlay, details);
        this.types[name] = overlay;
    };
    OverlayFactory.prototype.loadAll = function () {
        this.load('tiberium');
        this.load('tree');
        this.load('trees');
    };
    OverlayFactory.prototype.add = function (details) {
        var name = details.name;
        var newOverlay = new Overlay(name);
        newOverlay.stage = 0;
        $.extend(newOverlay, this.types[name]);
        $.extend(newOverlay, details);
        newOverlay.type = '0';
        return newOverlay;
    };
    return OverlayFactory;
}(VisualObject));
module.exports = OverlayFactory;
//# sourceMappingURL=OverlayFactory.js.map