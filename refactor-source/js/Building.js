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
var Building = /** @class */ (function (_super) {
    __extends(Building, _super);
    function Building() {
        var _this = _super.call(this, 'building') || this;
        _this.primaryBuilding = false;
        _this.animationSpeed = 2;
        _this.status = '';
        return _this;
    }
    Building.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy) {
        var teamYOffset = 0;
        if (this.team != curPlayerTeam) {
            teamYOffset = this.pixelHeight;
        }
        //First draw the bottom grass
        context.drawImage(this.bibImage, this.x * gridSize + screen.viewportAdjust.x, (this.y + this.gridHeight - 1) * gridSize + screen.viewportAdjust.y);
        var life = this.getLife(), imageCategory;
        if (this.status == "build" || this.status == "sell") {
            imageCategory = 'build';
        }
        else if (this.status == "" || this.life == "ultra-damaged") {
            imageCategory = this.life;
        }
        else {
            imageCategory = this.life + "-" + this.status;
        }
        var imageWidth = this.gridShape[0].length * gridSize;
        var imageHeight = this.spriteImage.height;
        // Then draw the base with baseOffset
        var baseImage = this.spriteArray[this.life + "-base"];
        if (baseImage && this.status != 'build' && this.status != 'sell') {
            context.drawImage(this.spriteCanvas, baseImage.offset * imageWidth, teamYOffset, imageWidth, imageHeight, gridSize * (this.x) + screen.viewportAdjust.x, (this.y) * gridSize + screen.viewportAdjust.y, imageWidth, imageHeight);
        }
        // Finally draw the top part with appropriate animation
        var imageList = this.spriteArray[imageCategory];
        if (!this.animationIndex) {
            this.animationIndex = 0;
        }
        if (imageList.count >= Math.floor(this.animationIndex / this.animationSpeed)) {
            var imageIndex = Math.floor(this.animationIndex / this.animationSpeed);
            if (this.status == 'sell') {
                imageIndex = imageList.count - 1 - Math.floor(this.animationIndex / this.animationSpeed);
            }
            context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, gridSize * (this.x) + screen.viewportAdjust.x, (this.y) * gridSize + screen.viewportAdjust.y, imageWidth, imageHeight);
        }
        this.animationIndex++;
        if (this.animationIndex / this.animationSpeed >= imageList.count) {
            this.animationIndex = 0;
            this.applyStatusDuringDraw(curPlayerTeam, units, vehiclesFactory, sidebar, enemy);
        }
        this.drawSelection(context, gridSize, screen, sidebar);
        if (this.repairing) {
            //alert('repairing');
            context.globalAlpha = sidebar.textBrightness;
            context.drawImage(sidebar.repairImageBig, (this.x + this.gridShape[0].length / 2 - 1) * gridSize + screen.viewportAdjust.x, (this.y + this.gridShape.length / 2 - 1) * gridSize + screen.viewportAdjust.y);
            context.globalAlpha = 1;
            if (this.hitPoints >= this.maxHitPoints) {
                this.repairing = false;
                this.hitPoints = this.maxHitPoints;
            }
            else {
                var cashSpent = 1;
                if (sidebar.cash > cashSpent) {
                    sidebar.cash -= cashSpent;
                    this.hitPoints += (cashSpent * 2 * this.maxHitPoints / this.cost);
                    //console.log (this.health + " " +2*cashSpent*this.hitPoints/this.cost)     
                }
            }
        }
    };
    Building.prototype.drawSelection = function (context, gridSize, screen, sidebar) {
        _super.prototype.drawSelection.call(this, context, gridSize, screen, sidebar);
        if (this.selected) {
            if (this.primaryBuilding) {
                var bounds = this.getSelectionBounds(gridSize, screen);
                context.drawImage(sidebar.primaryBuildingImage, (bounds.left + bounds.right - sidebar.primaryBuildingImage.width) / 2, bounds.bottom - sidebar.primaryBuildingImage.height);
            }
        }
    };
    Building.prototype.applyStatusDuringDraw = function (curPlayerTeam, units, vehiclesFactory, sidebar, enemy) {
        if (this.status == "build" || this.status == "construct") {
            this.status = "";
        }
        else if (this.status == 'sell') {
            this.status = 'destroy';
        }
    };
    return Building;
}(DestructibleObject));
module.exports = Building;
//# sourceMappingURL=Building.js.map