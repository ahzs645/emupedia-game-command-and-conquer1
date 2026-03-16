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
var DestructibleObject = /** @class */ (function (_super) {
    __extends(DestructibleObject, _super);
    function DestructibleObject(type) {
        return _super.call(this, type) || this;
    }
    DestructibleObject.prototype.getLife = function () {
        var life = this.hitPoints / this.maxHitPoints;
        if (life > 0.7) {
            this.life = "healthy";
        }
        else if (life > 0.4) {
            this.life = "damaged";
        }
        else {
            this.life = "ultra-damaged";
        }
    };
    DestructibleObject.prototype.drawSelection = function (context, gridSize, screen, sidebar) {
        _super.prototype.drawSelection.call(this, context, gridSize, screen, sidebar);
        if (this.selected) {
            // Now draw the health bar
            this.getLife();
            var bounds = this.getSelectionBounds(gridSize, screen), healthBarHeight = 5;
            context.beginPath();
            context.rect(bounds.left, bounds.top - healthBarHeight - 2, this.pixelWidth * this.hitPoints / this.maxHitPoints, healthBarHeight);
            if (this.life == 'healthy') {
                context.fillStyle = 'lightgreen';
            }
            else if (this.life == 'damaged') {
                context.fillStyle = 'yellow';
            }
            else {
                context.fillStyle = 'red';
            }
            context.fill();
            context.beginPath();
            context.strokeStyle = 'black';
            context.rect(bounds.left, bounds.top - healthBarHeight - 2, this.pixelWidth, healthBarHeight);
            context.stroke();
        }
    };
    DestructibleObject.prototype.findEnemiesInRange = function (hero, increment, units, buildings, turrets) {
        if (!increment)
            increment = 0;
        if (!hero) {
            hero = this;
        }
        var enemies = [], test;
        for (var i = units.length - 1; i >= 0; i--) {
            test = units[i];
            if (test.team != hero.team && Math.pow(test.x - hero.x, 2) + Math.pow(test.y - hero.y, 2) <= Math.pow(hero.sight + increment, 2)) {
                enemies.push(test);
                //alert(hero.name + ':' +hero.x + ',' + hero.y+ ' too close to ' + test.name + ':' +test.x + ',' + test.y)      
            }
        }
        ;
        for (var i = buildings.length - 1; i >= 0; i--) {
            test = buildings[i];
            if (test.team != hero.team && Math.pow(test.x + test.gridWidth / 2 - hero.x, 2) + Math.pow(test.y + test.gridHeight / 2 - hero.y, 2) <= Math.pow(hero.sight + increment, 2)) {
                enemies.push(test);
            }
        }
        ;
        for (var i = turrets.length - 1; i >= 0; i--) {
            test = turrets[i];
            if (test.team != hero.team && Math.pow(test.x + test.gridWidth / 2 - hero.x, 2) + Math.pow(test.y + test.gridHeight / 2 - hero.y, 2) <= Math.pow(hero.sight + increment, 2)) {
                enemies.push(test);
            }
        }
        ;
        return enemies;
    };
    return DestructibleObject;
}(GameObject));
module.exports = DestructibleObject;
//# sourceMappingURL=DestructibleObject.js.map