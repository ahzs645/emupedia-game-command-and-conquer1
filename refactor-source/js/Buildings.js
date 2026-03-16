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
var Building = require("./Building");
var TiberiumRefinery = require("./TiberiumRefinery");
var Buildings = /** @class */ (function (_super) {
    __extends(Buildings, _super);
    function Buildings() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loaded = false;
        _this.types = [];
        _this.buildingDetails = {
            'construction-yard': {
                name: 'construction-yard',
                label: 'Construction Yard',
                type: 'building',
                powerIn: 15,
                powerOut: 30,
                cost: 5000,
                sight: 3,
                maxHitPoints: 400,
                imagesToLoad: [
                    { name: 'build', count: 32 },
                    { name: "damaged", count: 4 },
                    { name: 'damaged-construct', count: 20 },
                    { name: "healthy", count: 4 },
                    { name: 'healthy-construct', count: 20 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [
                    [1, 1, 1],
                    [1, 1, 1]
                ]
            },
            'refinery': {
                name: 'refinery',
                label: 'Tiberium Refinery',
                type: 'building',
                powerIn: 40,
                powerOut: 10,
                cost: 2000,
                tiberiumStorage: 1000,
                sight: 4,
                maxHitPoints: 450,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 12 },
                    { name: 'damaged-unload', count: 18 },
                    { name: "healthy", count: 12 },
                    { name: 'healthy-unload', count: 18 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ]
            },
            'barracks': {
                name: 'barracks',
                label: 'Barracks',
                type: 'building',
                powerIn: 20,
                cost: 300,
                sight: 3,
                maxHitPoints: 400,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 10 },
                    { name: "healthy", count: 10 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [[1, 1],
                    [1, 1]]
            },
            'power-plant': {
                name: 'power-plant',
                label: 'Power Plant',
                type: 'building',
                powerOut: 100,
                cost: 300,
                sight: 2,
                maxHitPoints: 200,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 4 },
                    { name: "healthy", count: 4 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [[1, 0],
                    [1, 1]]
            },
            'advanced-power-plant': {
                name: 'advanced-power-plant',
                label: 'Advanced Power Plant',
                type: 'building',
                powerOut: 200,
                cost: 700,
                sight: 2,
                maxHitPoints: 300,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 4 },
                    { name: "healthy", count: 4 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [[1, 0],
                    [1, 1]]
            },
            'tiberium-silo': {
                name: 'tiberium-silo',
                label: 'Tiberium Silo',
                type: 'building',
                powerIn: 10,
                cost: 150,
                sight: 2,
                maxHitPoints: 150,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 5 },
                    { name: "healthy", count: 5 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [[1, 1]]
            },
            'hand-of-nod': {
                name: 'hand-of-nod',
                label: 'Hand of Nod',
                type: 'building',
                powerIn: 20,
                cost: 300,
                sight: 3,
                maxHitPoints: 400,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 1 },
                    { name: "healthy", count: 1 },
                    { name: "ultra-damaged", count: 1 }
                ],
                gridShape: [[0, 0],
                    [1, 1],
                    [1, 1]]
            },
            'weapons-factory': {
                name: 'weapons-factory',
                label: 'Weapons Factory',
                type: 'building',
                powerIn: 30,
                cost: 2000,
                sight: 3,
                maxHitPoints: 200,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: "damaged", count: 1 },
                    { name: 'damaged-base', count: 1 },
                    { name: 'damaged-construct', count: 9 },
                    { name: "healthy", count: 1 },
                    { name: 'healthy-base', count: 1 },
                    { name: 'healthy-construct', count: 9 },
                    { name: "ultra-damaged", count: 0 },
                    { name: 'ultra-damaged-base', count: 1 }
                ],
                gridShape: [[1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]]
            }
        };
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    Buildings.prototype.load = function (name, gridSize) {
        var details = this.buildingDetails[name];
        var building = name == this.buildingDetails.refinery.name
            ? new TiberiumRefinery()
            : new Building();
        building.hitPoints = details.maxHitPoints;
        building.gridHeight = details.gridShape.length;
        building.gridWidth = details.gridShape[0].length;
        building.pixelHeight = details.gridShape.length * gridSize;
        building.pixelWidth = details.gridShape[0].length * gridSize;
        building.bibImage = this.preloadImage('buildings/bib/bib-' + details.gridShape[0].length + '.gif');
        building.pixelOffsetX = 0;
        building.pixelOffsetY = 0;
        building.pixelTop = 0;
        building.pixelLeft = 0;
        this.loadSpriteSheet(building, details, 'buildings');
        $.extend(building, details);
        this.types[name] = building;
    };
    Buildings.prototype.add = function (details) {
        var newBuilding = details.name == this.buildingDetails.refinery.name
            ? new TiberiumRefinery()
            : new Building();
        newBuilding.team = details.team;
        var name = details.name;
        $.extend(newBuilding, this.types[name].defaults);
        $.extend(newBuilding, this.types[name]);
        $.extend(newBuilding, details);
        if (details.hitPoints !== undefined)
            newBuilding.hitPoints = details.hitPoints;
        else
            newBuilding.hitPoints = newBuilding.maxHitPoints;
        return newBuilding;
    };
    return Buildings;
}(VisualObject));
module.exports = Buildings;
//# sourceMappingURL=Buildings.js.map
