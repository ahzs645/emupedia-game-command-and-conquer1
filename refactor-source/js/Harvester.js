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
var Vehicle = require("./Vehicle");
var Harvester = /** @class */ (function (_super) {
    __extends(Harvester, _super);
    function Harvester() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Harvester.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy, debugMode) {
        _super.prototype.draw.call(this, context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy, debugMode);
        if (this.status != '') {
            var imageList = this.spriteArray[this.status];
            if (this.animationIndex / this.animationSpeed >= imageList.count) {
                //alert(this.animationIndex + ' / '+ this.animationSpeed)
                this.animationIndex = 0;
                if (this.status.indexOf('harvest') > -1) {
                    if (!this.tiberium) {
                        this.tiberium = 0;
                    }
                    this.tiberium++;
                    if (this.tiberium % 5 == 0) {
                        this.orders.to.stage--;
                    }
                }
                this.status = "";
            }
        }
    };
    Harvester.prototype.processOrders = function (speedAdjustmentFactor, units, buildings, turrets, allOverlays, buildingsFactory, fog, sounds, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen) {
        _super.prototype.processOrders.call(this, speedAdjustmentFactor, units, buildings, turrets, allOverlays, buildingsFactory, fog, sounds, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
        if (this.orders.type == 'harvest') {
            this.orders = this.processHarvestOrder(this.orders, allOverlays, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, speedAdjustmentFactor, debugMode, context, gridSize, screen, fog);
        }
        else if (this.orders.type == 'harvest-return') {
            this.orders = this.processHarvestReturnOrder(this.orders, allOverlays, units, buildings, curPlayerTeam, obstructionGrid, heroObstructionGrid, speedAdjustmentFactor, debugMode, context, gridSize, screen, fog);
        }
    };
    Harvester.prototype.processHarvestOrder = function (order, allOverlays, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, speedAdjustmentFactor, debugMode, context, gridSize, screen, fog) {
        var res;
        if (!order.to) {
            order.to = this.findTiberiumInRange(this, allOverlays, gridSize, fog);
        }
        if (!order.to) {
            if (this.tiberium) {
                res = { type: 'harvest-return' };
            }
            return res;
        }
        var distance = Math.pow(Math.pow(order.to.y + 0.5 - this.y, 2) + Math.pow(order.to.x + 0.5 - this.x, 2), 0.5);
        if (distance > 1.5 * this.softCollisionRadius / gridSize) {
            this.moveTo(this.orders.to, false, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
        }
        else {
            if (this.tiberium && this.tiberium >= 14) {
                res = { type: 'harvest-return', to: order.from, from: order.to };
                return res;
            }
            if (order.to.stage < 1) {
                order.to = this.findTiberiumInRange(this, allOverlays, gridSize, fog);
            }
            else {
                if (!this.tiberium || this.tiberium < 14) {
                    if (this.status == "") {
                        this.status = "harvest-" + ((Math.floor(this.moveDirection / 4) * 4) < 10 ? '0' : '') + (Math.floor(this.moveDirection / 4) * 4);
                    }
                }
            }
        }
        res = order;
        return res;
    };
    Harvester.prototype.processHarvestReturnOrder = function (orders, allOverlays, units, buildings, curPlayerTeam, obstructionGrid, heroObstructionGrid, speedAdjustmentFactor, debugMode, context, gridSize, screen, fog) {
        var res = this.orders;
        if (!orders.to) {
            orders.to = this.findRefineryInRange(buildings);
            if (!orders.to) {
                res = orders;
                return res;
            }
        }
        var destination = { x: orders.to.x, y: orders.to.y + 2 };
        var distance = Math.pow(Math.pow(destination.y - this.y, 2) + Math.pow(destination.x - this.x, 2), 0.5);
        //alert(distance)
        if (distance > 3 * this.softCollisionRadius / gridSize) {
            this.moveTo(destination, false, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
            //this.moveTo({x:10,y:10})
        }
        else if (orders.to.life != "ultra-damaged") {
            if (this.tiberium == 0) {
                res = { type: 'harvest', to: orders.from, from: orders.to };
                return res;
            }
            if (this.moveDirection != 14) {
                this.instructions.push({ type: 'turn', toDirection: 14 });
                return res;
            }
            if (orders.to.status == "") {
                this.status = 'destroy';
                //alert(orders.to.name)
                //alert (this.name)
                //alert(orders.from)
                orders.to.harvester = this;
                orders.to.status = 'unload';
                orders.to.animationIndex = 0;
            }
        }
        res = orders;
        return res;
    };
    Harvester.prototype.findTiberiumInRange = function (hero, allOverlays, gridSize, fog) {
        if (!hero) {
            hero = this;
        }
        var currentDistance;
        var currentOverlay;
        for (var i = 0; i < allOverlays.length; i++) {
            var overlay = allOverlays[i];
            if (overlay.name == 'tiberium' && overlay.stage > 0 && !fog.isOver(overlay.x * gridSize, overlay.y * gridSize)) {
                var distance = Math.pow(overlay.x - hero.x, 2) + Math.pow(overlay.y - hero.y, 2);
                if (!currentDistance || (currentDistance > distance)) {
                    currentOverlay = overlay;
                    currentDistance = distance;
                }
            }
        }
        ;
        return currentOverlay;
    };
    Harvester.prototype.findRefineryInRange = function (buildings) {
        var currentDistance;
        var currentRefinery;
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building.name == 'refinery' && building.team == this.team) {
                var distance = Math.pow(building.x - this.x, 2) + Math.pow(building.y - this.y, 2);
                if (!currentDistance || (currentDistance > distance)) {
                    currentRefinery = building;
                    currentDistance = distance;
                }
            }
        }
        ;
        return currentRefinery;
    };
    return Harvester;
}(Vehicle));
module.exports = Harvester;
//# sourceMappingURL=Harvester.js.map