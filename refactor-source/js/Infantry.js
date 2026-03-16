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
var DestructibleObject = require("./DestructibleObject");
var Infantry = /** @class */ (function (_super) {
    __extends(Infantry, _super);
    function Infantry(health) {
        var _this = _super.call(this, 'infantry') || this;
        _this.hitPoints = health;
        _this.status = 'stand';
        _this.animationSpeed = 4;
        _this.pixelOffsetX = -50 / 2;
        _this.pixelOffsetY = -39 / 2;
        _this.pixelWidth = 16;
        _this.pixelHeight = 16;
        _this.pixelTop = 6;
        _this.pixelLeft = 16;
        return _this;
    }
    Infantry.prototype.collision = function (otherUnit, gridSize) {
        if (this == otherUnit) {
            return null;
        }
        //alert(otherUnit.x + ' ' + otherUnit.y)
        var distanceSquared = Math.pow(this.x - otherUnit.x, 2) + Math.pow(this.y - otherUnit.y, 2);
        var radiusSquared = Math.pow((this.collisionRadius + otherUnit.collisionRadius) / gridSize, 2);
        var softHardRadiusSquared = Math.pow((this.softCollisionRadius + otherUnit.collisionRadius) / gridSize, 2);
        var softRadiusSquared = Math.pow((this.softCollisionRadius + otherUnit.softCollisionRadius) / gridSize, 2);
        if (distanceSquared <= radiusSquared) {
            return { type: 'hard', distance: Math.pow(distanceSquared, 0.5) };
        }
        else if (distanceSquared < softHardRadiusSquared) {
            return { type: 'soft-hard', distance: Math.pow(distanceSquared, 0.5) };
        }
        else if (distanceSquared <= softRadiusSquared) {
            return { type: 'soft', distance: Math.pow(distanceSquared, 0.5) };
        }
        else {
            return null;
        }
    };
    Infantry.prototype.move = function () {
        if (!this.speedCounter) {
            this.speedCounter = 0;
        }
        this.speedCounter++;
        var angle = (this.moveDirection / 8) * 2 * Math.PI; //Math.round( (90+(unit.direction/32)*360)%360);
        ///alert(angle);
        if (this.status == 'walk') {
            this.x = this.x - 0.005 * this.speed * Math.sin(angle);
            this.y = this.y - 0.005 * this.speed * Math.cos(angle);
        }
        if (this.speedCounter >= 7) {
            this.speedCounter = 0;
            this.moveDirection = Math.floor(this.moveDirection + (Math.round((Math.random() - 0.5) * 10) * 1 / 10));
            if (this.moveDirection > 7) {
                this.moveDirection = 0;
            }
            else if (this.moveDirection < 0) {
                this.moveDirection = 7;
            }
            this.status = Math.random() > 0.7 ? 'fire' : Math.random() > 0.7 ? 'stand' : 'walk';
            /*if (this.status == 'fire'){
                sounds.play('machine_gun');
            }*/
        }
    };
    Infantry.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy) {
        //alert(this.status);
        //alert(this.imageArray[this.status][this.moveDirection])
        var imageList = this.imageArray[this.status][this.moveDirection];
        //alert(imageList.length)
        this.animationIndex++;
        if (this.animationIndex / this.animationSpeed >= imageList.length) {
            //alert(this.animationIndex + ' / '+ this.animationSpeed)
            this.animationIndex = 0;
        }
        var moveImage = imageList[Math.floor(this.animationIndex / this.animationSpeed)];
        //alert(this.moveOffsetX)
        var x = this.x * gridSize + screen.viewportAdjust.x + this.pixelOffsetX;
        var y = this.y * gridSize + screen.viewportAdjust.y + this.pixelOffsetY;
        context.drawImage(moveImage, x, y);
        ////context.fillRect(this.x*game.gridSize+game.viewportAdjustX+this.pixelWidth/2,this.y*game.gridSize+game.viewportAdjustY+this.pixelHeight/2,10,10);
        this.drawSelection(context, gridSize, screen, sidebar);
    };
    Infantry.prototype.processOrders = function (speedAdjustmentFactor, units, buildings, turrets, allOverlays, buildingsFactory, fog, sounds, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen) {
    };
    return Infantry;
}(DestructibleObject));
module.exports = Infantry;
//# sourceMappingURL=Infantry.js.map
