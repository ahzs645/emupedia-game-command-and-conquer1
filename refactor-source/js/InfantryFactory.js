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
var Infantry = require("./Infantry");
var InfantryFactory = /** @class */ (function (_super) {
    __extends(InfantryFactory, _super);
    function InfantryFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = [];
        _this.loaded = true;
        _this.infantryDetails = {
            'minigunner': {
                name: 'minigunner',
                label: 'Minigunner',
                speed: 8,
                cost: 100,
                sight: 1,
                maxHitPoints: 50,
                collisionRadius: 5,
                imagesToLoad: [
                    { name: 'stand', count: 1, directionCount: 8 },
                    { name: "walk", count: 6, directionCount: 8 },
                    { name: "fire", count: 8, directionCount: 8 }
                ]
            }
        };
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    InfantryFactory.prototype.load = function (name) {
        var details = this.infantryDetails[name];
        var infantry = new Infantry(details.maxHitPoints);
        //$.extend(infantryType,defaults);
        // Load all the images
        infantry.imageArray = [];
        for (var i = details.imagesToLoad.length - 1; i >= 0; i--) {
            var constructImageCount = details.imagesToLoad[i].count;
            var constructImageDirectionCount = details.imagesToLoad[i].directionCount;
            var constructImageName = details.imagesToLoad[i].name;
            var imgArray = [];
            for (var j = 0; j < constructImageDirectionCount; j++) {
                imgArray[j] = (this.loadImageArray('units/infantry/' + name + '/' + name + '-' + constructImageName + '-' + j, constructImageCount, '.gif'));
            }
            //alert(imgArray)
            infantry.imageArray[constructImageName] = imgArray;
        }
        // Add all the basic unit details
        $.extend(infantry, details);
        this.types[name] = infantry;
    };
    InfantryFactory.prototype.add = function (details) {
        var newInfantry = new Infantry(0);
        newInfantry.team = details.team;
        var name = details.name;
        $.extend(newInfantry, this.types[name].defaults);
        $.extend(newInfantry, this.types[name]);
        $.extend(newInfantry, details);
        if (details.hitPoints !== undefined)
            newInfantry.hitPoints = details.hitPoints;
        else
            newInfantry.hitPoints = newInfantry.maxHitPoints;
        return newInfantry;
    };
    return InfantryFactory;
}(VisualObject));
module.exports = InfantryFactory;
//# sourceMappingURL=InfantryFactory.js.map
