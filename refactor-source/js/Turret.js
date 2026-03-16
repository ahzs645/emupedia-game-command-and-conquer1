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
var Building = require("./Building");
var Turret = /** @class */ (function (_super) {
    __extends(Turret, _super);
    function Turret(health) {
        var _this = _super.call(this) || this;
        _this.type = 'turret';
        _this.status = '';
        _this.animationSpeed = 4;
        _this.hitPoints = health;
        _this.pixelLeft = 0;
        _this.pixelTop = 0;
        _this.pixelOffsetX = 0;
        _this.pixelOffsetY = 0;
        _this.turretDirection = 0;
        return _this;
    }
    Turret.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy) {
        var teamYOffset = 0;
        if (this.team != curPlayerTeam) {
            teamYOffset = this.pixelHeight;
        }
        var life = this.getLife(), imageCategory;
        if (this.status == "build" || this.status == "sell") {
            imageCategory = 'build';
        }
        else if (this.status == "") {
            imageCategory = this.life;
            if (this.life == 'ultra-damaged') { // turrets don't have ultra damaged. :)
                imageCategory = 'damaged';
            }
        }
        var imageList = this.spriteArray[imageCategory];
        var imageWidth = this.gridShape[0].length * gridSize;
        var imageHeight = this.spriteImage.height;
        var x = this.x * gridSize + screen.viewportAdjust.x;
        var y = this.y * gridSize + screen.viewportAdjust.y;
        if (this.status == "") {
            var imageIndex = Math.floor(this.turretDirection);
            context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
        }
        else {
            if (!this.animationIndex) {
                this.animationIndex = 0;
            }
            if (imageList.count >= Math.floor(this.animationIndex / this.animationSpeed)) {
                var imageIndex = Math.floor(this.animationIndex / this.animationSpeed);
                if (this.status == 'sell') {
                    imageIndex = imageList.count - 1 - Math.floor(this.animationIndex / this.animationSpeed);
                }
                context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
            }
            this.animationIndex++;
            if (this.animationIndex / this.animationSpeed >= imageList.count) {
                //alert(this.animationIndex + ' / '+ this.animationSpeed)
                this.animationIndex = 0;
                this.status = "";
                if (this.status == 'sell') {
                    this.status = 'destroy';
                }
            }
        }
        if (this.turretDirection >= 0) {
            var turretList = this.spriteArray['turret'];
            if (turretList) {
                var imageIndex = Math.floor(this.turretDirection);
                context.drawImage(this.spriteImage, (turretList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
            }
        }
        this.drawSelection(context, gridSize, screen, sidebar);
    };
    Turret.prototype.processOrders = function (gridSize, units, buildings, turrets) {
        if (!this.orders) {
            this.orders = { type: 'guard' };
        }
        //this.orders = {type:'move',to:{x:11,y:12}}; //{type:patrol,from:{x:9,y:5},to:{x:11,y:5}} // {type:guard} // {type:move,to:{x:11,y:5}} // {type:attack} // {type:protect}
        if (this.orders.type == 'attack') {
            var attackOrder = this.orders;
            this.instructions = [];
            if (attackOrder.target.status == 'destroy') {
                this.orders = { type: 'guard' };
                return;
            }
            var start = [Math.floor(this.x), Math.floor(this.y)];
            //adjust to center of target for buildings
            var targetX = attackOrder.target.x;
            var targetY = attackOrder.target.y;
            if (attackOrder.target.type == 'turret') {
                targetX += attackOrder.target.pixelWidth / (2 * gridSize);
                targetY += attackOrder.target.pixelHeight / (2 * gridSize);
            }
            if (attackOrder.target.type == 'building') {
                targetX += attackOrder.target.gridWidth / 2;
                targetY += attackOrder.target.gridHeight / 2;
            }
            if (Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2) >= Math.pow(this.sight, 2)) {
                //alert('not attacking '+this.orders.target.name)
                this.orders = { type: 'guard' }; // out of range go back to guard mode.
            }
            else {
                if (this.orders.type == 'attack') {
                    var turretAngle = this.findAngle({ x: targetX, y: targetY }, this, 32);
                    if (this.turretDirection != turretAngle) {
                        this.instructions.push({ type: 'aim', toDirection: turretAngle });
                        //alert('pusing direction ' + turretAngle)
                    }
                    else {
                        // aiming turret at him and within range... FIRE!!!!!
                        //alert(turretAngle)
                        this.instructions.push({ type: 'fire' });
                        // this only processes if the guy has some ammo
                    }
                }
                // do nothing... wait...
            }
        }
        else if (this.orders.type == 'guard') {
            // first see if an evil unit is in sight and track it :)
            var enemiesInRange = this.findEnemiesInRange(this, 0, units, buildings, turrets);
            if (enemiesInRange.length > 0) {
                var enemy = enemiesInRange[0];
                this.orders = { type: 'attack', target: enemy };
            }
        }
    };
    Turret.prototype.move = function (sounds, bulletDrawer) {
        if (!this.instructions) {
            this.instructions = [];
        }
        if (this.instructions.length == 0) {
            return;
        }
        for (var i = 0; i < this.instructions.length; i++) {
            var instr = this.instructions[i];
            if (instr.type == 'aim') {
                var aimInstr = instr;
                //alert('aiming: ' + instr.toDirection + ' and turret is at '+this.turretDirection)
                if (aimInstr.toDirection == this.turretDirection) {
                    // instruction complete...
                    instr.type = 'done';
                    //return;
                }
                if ((aimInstr.toDirection > this.turretDirection && (aimInstr.toDirection - this.turretDirection) < 16)
                    || (aimInstr.toDirection < this.turretDirection && (this.turretDirection - aimInstr.toDirection) > 16)) {
                    //alert(this.turnSpeed*0.05)
                    this.turretDirection = this.turretDirection + this.turnSpeed * 0.1;
                    if ((this.turretDirection - aimInstr.toDirection) * (this.turretDirection + this.turnSpeed * 0.1 - aimInstr.toDirection) <= 0) {
                        this.turretDirection = aimInstr.toDirection;
                    }
                }
                else {
                    this.turretDirection = this.turretDirection - this.turnSpeed * 0.1;
                    if ((this.turretDirection - aimInstr.toDirection) * (this.turretDirection - this.turnSpeed * 0.1 - aimInstr.toDirection) <= 0) {
                        this.turretDirection = aimInstr.toDirection;
                    }
                }
                if (this.turretDirection > 31) {
                    this.turretDirection = 0;
                }
                else if (this.turretDirection < 0) {
                    this.turretDirection = 31;
                }
                //alert(this.turretDirection)   
            }
            if (instr.type == 'fire') {
                // alert(this.fireCounter)
                if (!this.bulletFiring) {
                    sounds.play('tank_fire');
                    this.bulletFiring = true;
                    var angle = (this.turretDirection / 32) * 2 * Math.PI;
                    bulletDrawer.fireBullet({
                        x: this.x + 0.5,
                        y: this.y + 0.5,
                        angle: angle,
                        range: this.sight,
                        source: this,
                        damage: 10
                    });
                }
            }
        }
        ;
    };
    return Turret;
}(Building));
module.exports = Turret;
//# sourceMappingURL=Turret.js.map