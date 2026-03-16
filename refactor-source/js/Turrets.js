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
var Turret = require("./Turret");
var Turrets = /** @class */ (function (_super) {
    __extends(Turrets, _super);
    function Turrets() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = [];
        _this.turretDetails = {
            'gun-turret': {
                name: 'gun-turret',
                label: 'Gun Turret',
                type: 'turret',
                powerIn: 20,
                primaryWeapon: 12,
                cost: 600,
                maxHitPoints: 200,
                sight: 5,
                turnSpeed: 5,
                reloadTime: 1500,
                pixelWidth: 24,
                pixelHeight: 24,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: 'damaged', count: 32 },
                    { name: "healthy", count: 32 }
                ],
                pixelOffsetX: -12,
                pixelOffsetY: -12,
                pixelTop: 12,
                pixelLeft: 12,
                gridWidth: 1,
                gridHeight: 1,
                gridShape: [[1]]
            },
            'guard-tower': {
                name: 'guard-tower',
                label: 'Guard Tower',
                type: 'turret',
                powerIn: 10,
                primaryWeapon: 1,
                cost: 500,
                maxHitPoints: 200,
                sight: 5,
                reloadTime: 1000,
                pixelWidth: 24,
                pixelHeight: 24,
                pixelOffsetX: -12,
                pixelOffsetY: -12,
                pixelTop: 12,
                pixelLeft: 12,
                imagesToLoad: [
                    { name: 'build', count: 20 },
                    { name: 'damaged', count: 1 },
                    { name: "healthy", count: 1 }
                ],
                gridWidth: 1,
                gridHeight: 1,
                gridShape: [[1, 1]]
            },
        };
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    Turrets.prototype.load = function (name) {
        var details = this.turretDetails[name];
        var turret = new Turret(details.maxHitPoints);
        this.loadSpriteSheet(turret, details, 'turrets');
        $.extend(turret, details);
        this.types[name] = turret;
    };
    Turrets.prototype.add = function (details) {
        var name = details.name;
        var newTurret = new Turret(0);
        newTurret.team = details.team;
        $.extend(newTurret, this.types[name].defaults);
        $.extend(newTurret, this.types[name]);
        $.extend(newTurret, details);
        if (details.hitPoints !== undefined)
            newTurret.hitPoints = details.hitPoints;
        else
            newTurret.hitPoints = newTurret.maxHitPoints;
        return newTurret;
    };
    return Turrets;
}(VisualObject));
module.exports = Turrets;
//# sourceMappingURL=Turrets.js.map
