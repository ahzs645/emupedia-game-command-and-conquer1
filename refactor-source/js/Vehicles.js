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
var Vehicle = require("./Vehicle");
var Harvester = require("./Harvester");
var Vehicles = /** @class */ (function (_super) {
    __extends(Vehicles, _super);
    function Vehicles() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loaded = false;
        _this.types = [];
        _this.vehicleDetails = {
            'mcv': {
                name: 'mcv',
                label: 'Mobile Construction Vehicle',
                type: 'vehicle',
                turnSpeed: 5,
                speed: 12,
                cost: 5000,
                maxHitPoints: 200,
                sight: 2,
                moveImageCount: 32,
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: -24,
                pixelOffsetY: -24,
                collisionRadius: 12, //20
                softCollisionRadius: 16,
                imagesToLoad: [
                    { name: 'move', count: 32 }
                ],
            },
            'harvester': {
                name: 'harvester',
                label: 'Harvester',
                type: 'vehicle',
                turnSpeed: 5,
                speed: 12,
                cost: 1400,
                maxHitPoints: 600,
                sight: 2,
                tiberium: 0,
                moveImageCount: 32,
                imagesToLoad: [
                    { name: 'move', count: 32 },
                    { name: 'harvest-00', count: 4 },
                    { name: 'harvest-04', count: 4 },
                    { name: 'harvest-08', count: 4 },
                    { name: 'harvest-12', count: 4 },
                    { name: 'harvest-16', count: 4 },
                    { name: 'harvest-20', count: 4 },
                    { name: 'harvest-24', count: 4 },
                    { name: 'harvest-28', count: 4 },
                ],
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: -24,
                pixelOffsetY: -24,
                collisionRadius: 6, //20
                softCollisionRadius: 12
            },
            'light-tank': {
                name: 'light-tank',
                label: 'Light Tank',
                type: 'vehicle',
                turnSpeed: 5,
                speed: 18,
                cost: 600,
                sight: 3,
                maxHitPoints: 300,
                primaryWeapon: 9,
                reloadTime: 2000,
                moveImageCount: 32,
                turretImageCount: 32,
                imagesToLoad: [
                    { name: 'move', count: 32 },
                    { name: 'turret', count: 32 }
                ],
                pixelWidth: 24,
                pixelHeight: 24,
                pixelOffsetX: -12,
                pixelOffsetY: -12,
                collisionRadius: 5,
                softCollisionRadius: 9 //10
            }
        };
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        _this.movementSpeed = 0;
        return _this;
    }
    Vehicles.prototype.load = function (name) {
        var details = this.vehicleDetails[name];
        var vehicle = name == this.vehicleDetails.harvester.name
            ? new Harvester()
            : new Vehicle();
        this.loadSpriteSheet(vehicle, details, 'units/vehicles');
        $.extend(vehicle, details);
        vehicle.hitPoints = details.maxHitPoints;
        this.types[name] = vehicle;
    };
    Vehicles.prototype.add = function (details) {
        var newVehicle = details.name == this.vehicleDetails.harvester.name
            ? new Harvester()
            : new Vehicle();
        newVehicle.team = details.team;
        var name = details.name;
        $.extend(newVehicle, this.types[name].defaults);
        $.extend(newVehicle, this.types[name]);
        $.extend(newVehicle, details);
        if (details.hitPoints !== undefined)
            newVehicle.hitPoints = details.hitPoints;
        else
            newVehicle.hitPoints = newVehicle.maxHitPoints;
        return newVehicle;
    };
    return Vehicles;
}(VisualObject));
module.exports = Vehicles;
//# sourceMappingURL=Vehicles.js.map
