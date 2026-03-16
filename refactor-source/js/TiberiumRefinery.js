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
var TiberiumRefinery = /** @class */ (function (_super) {
    __extends(TiberiumRefinery, _super);
    function TiberiumRefinery() {
        return _super.call(this) || this;
    }
    TiberiumRefinery.prototype.applyStatusDuringDraw = function (curPlayerTeam, units, vehiclesFactory, sidebar, enemy) {
        if (this.status == 'build') {
            units.push(vehiclesFactory.add({
                name: 'harvester',
                team: this.team,
                x: this.x + 0.5,
                y: this.y + 2,
                moveDirection: 14,
                orders: { type: 'harvest', from: this }
            }));
            this.status = "";
        }
        else if (this.status == 'unload') {
            if (this.harvester.tiberium) {
                var subtractAmount = this.harvester.tiberium > 4 ? 5 : this.harvester.tiberium;
                if (this.team == curPlayerTeam) {
                    sidebar.cash += subtractAmount * 50;
                }
                else {
                    enemy.cash += subtractAmount;
                }
                this.harvester.tiberium -= subtractAmount;
            }
            if (!this.harvester.tiberium) {
                units.push(vehiclesFactory.add({
                    name: 'harvester',
                    team: this.team,
                    x: this.x + 0.5,
                    y: this.y + 2,
                    hitPoints: this.harvester.hitPoints,
                    moveDirection: 14,
                    orders: { type: 'harvest', from: this, to: this.harvester.orders.from }
                }));
                this.harvester = null;
                this.status = "";
            }
        }
        _super.prototype.applyStatusDuringDraw.call(this, curPlayerTeam, units, vehiclesFactory, sidebar, enemy);
    };
    return TiberiumRefinery;
}(Building));
module.exports = TiberiumRefinery;
//# sourceMappingURL=TiberiumRefinery.js.map