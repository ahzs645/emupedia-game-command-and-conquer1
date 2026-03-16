(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 * A* (A-Star) algorithm for a path finder
 * @author  Andrea Giammarchi
 * @license Mit Style License
 */
function diagonalSuccessors($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    if ($N) {
        $E && !grid[N][E] && (result[i++] = { x: E, y: N });
        $W && !grid[N][W] && (result[i++] = { x: W, y: N });
    }
    if ($S) {
        $E && !grid[S][E] && (result[i++] = { x: E, y: S });
        $W && !grid[S][W] && (result[i++] = { x: W, y: S });
    }
    return result;
}
function diagonalSuccessorsFree($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    $N = N > -1;
    $S = S < rows;
    $E = E < cols;
    $W = W > -1;
    if ($E) {
        $N && !grid[N][E] && (result[i++] = { x: E, y: N });
        $S && !grid[S][E] && (result[i++] = { x: E, y: S });
    }
    if ($W) {
        $N && !grid[N][W] && (result[i++] = { x: W, y: N });
        $S && !grid[S][W] && (result[i++] = { x: W, y: S });
    }
    return result;
}
function nothingToDo($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    return result;
}
function successors(find, x, y, grid, rows, cols) {
    var N = y - 1, S = y + 1, E = x + 1, W = x - 1, $N = N > -1 && !grid[N][x], $S = S < rows && !grid[S][x], $E = E < cols && !grid[y][E], $W = W > -1 && !grid[y][W], result = [], i = 0;
    $N && (result[i++] = { x: x, y: N });
    $E && (result[i++] = { x: E, y: y });
    $S && (result[i++] = { x: x, y: S });
    $W && (result[i++] = { x: W, y: y });
    return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i);
}
function diagonal(start, end, f1, f2) {
    return f2(f1(start.x - end.x), f1(start.y - end.y));
}
function euclidean(start, end, f1, f2) {
    var x = start.x - end.x, y = start.y - end.y;
    return f2(x * x + y * y);
}
function manhattan(start, end, f1, f2) {
    return f1(start.x - end.x) + f1(start.y - end.y);
}
function AStar(grid, start, end, f) {
    var cols = grid[0].length, rows = grid.length, limit = cols * rows, f1 = Math.abs, f2 = Math.max, list = {}, result = [], open = [{ x: start[0], y: start[1], f: 0, g: 0, v: start[0] + start[1] * cols }], length = 1, newEnd = { x: end[0], y: end[1], v: end[0] + end[1] * cols }, fmax, adj, distance, find, i, j, max, min, current, next;
    switch (f) {
        case "Diagonal":
            find = diagonalSuccessors;
        case "DiagonalFree":
            distance = diagonal;
            break;
        case "Euclidean":
            find = diagonalSuccessors;
        case "EuclideanFree":
            f2 = Math.sqrt;
            distance = euclidean;
            break;
        default:
            distance = manhattan;
            find = nothingToDo;
            break;
    }
    find || (find = diagonalSuccessorsFree);
    do {
        max = limit;
        min = 0;
        for (i = 0; i < length; ++i) {
            if ((fmax = open[i].f) < max) {
                max = fmax;
                min = i;
            }
        }
        ;
        current = open.splice(min, 1)[0];
        if (current.v != newEnd.v) {
            --length;
            next = successors(find, current.x, current.y, grid, rows, cols);
            for (i = 0, j = next.length; i < j; ++i) {
                (adj = next[i]).p = current;
                adj.f = adj.g = 0;
                adj.v = adj.x + adj.y * cols;
                if (!(adj.v in list)) {
                    adj.f = (adj.g = current.g + distance(adj, current, f1, f2)) + distance(adj, newEnd, f1, f2);
                    open[length++] = adj;
                    list[adj.v] = 1;
                }
            }
        }
        else {
            i = length = 0;
            do {
                result[i++] = { x: current.x, y: current.y };
            } while (current = current.p);
            result.reverse();
        }
    } while (length);
    return result;
}
module.exports = AStar;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = require("./Game");
window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas'), game = new Game(canvas);
    // begin the game
    game.start();
    $('#debugger').toggle();
    $('#debug_mode').bind('change', function () {
        game.debugMode = !game.debugMode;
        $('#debugger').toggle();
    });
});

},{"./Game":7}],3:[function(require,module,exports){
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

},{"./DestructibleObject":5}],4:[function(require,module,exports){
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


},{"./Building":3,"./TiberiumRefinery":22,"./VisualObject":27}],5:[function(require,module,exports){
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

},{"./GameObject":8}],6:[function(require,module,exports){
"use strict";
var Fog = /** @class */ (function () {
    function Fog(mapImage) {
        var _this = this;
        this.initialized = false;
        this.fogCanvas = document.createElement('canvas');
        this.canvasWidth = 128;
        this.canvasHeight = 128;
        mapImage.addEventListener('load', function () {
            _this.mapWidth = mapImage.width;
            _this.mapHeight = mapImage.height;
            _this.initialized = true;
        });
    }
    Fog.prototype.isOver = function (x, y) {
        if (!this.initialized)
            return false;
        var fx = x * this.canvasWidth / this.mapWidth, fy = y * this.canvasHeight / this.mapHeight, pixel = this.fogContext.getImageData(fx, fy, 1, 1).data;
        //alert("fog "+x+","+y+" "+pixel[0]+" "+pixel[1]+" "+pixel[2]+" "+pixel[3]);
        return (pixel[3] == 255);
    };
    Fog.prototype.init = function (mapWidth, mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.fogContext = this.fogCanvas.getContext('2d', { willReadFrequently: true }),
            this.fogContext.fillStyle = 'rgba(0,0,0,1)';
        this.fogContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
    Fog.prototype.draw = function (context, units, gridSize, currentTeam, buildings, turrets, screen) {
        var fogCanvas = this.fogCanvas;
        var fogContext = this.fogContext;
        fogContext.save();
        fogContext.scale(this.canvasWidth / this.mapWidth, this.canvasHeight / this.mapHeight);
        fogContext.fillStyle = 'rgba(200,200,200,1)';
        for (var i = units.length - 1; i >= 0; i--) {
            var unit = units[i];
            if (unit.team == currentTeam || unit.bulletFiring) {
                fogContext.beginPath();
                fogContext.globalCompositeOperation = "destination-out";
                fogContext.arc((Math.floor(unit.x) + 0.5) * gridSize, (Math.floor(unit.y) + 0.5) * gridSize, 
                //fogContext.arc(((unit.x)+0.5)*game.gridSize,((unit.y)+0.5)*game.gridSize,
                (unit.sight + 0.5) * gridSize, 0, 2 * Math.PI, false);
                //fogContext.globalAlpha = 0.2;
                fogContext.fill();
            }
        }
        ;
        for (var i = buildings.length - 1; i >= 0; i--) {
            var build = buildings[i];
            if (build.team == currentTeam) {
                fogContext.beginPath();
                fogContext.globalCompositeOperation = "destination-out";
                fogContext.arc((Math.floor(build.x)) * gridSize + build.pixelWidth / 2, (Math.floor(build.y)) * gridSize + build.pixelHeight / 2, build.sight * gridSize, 0, 2 * Math.PI, false);
                fogContext.fill();
            }
        }
        ;
        for (var i = turrets.length - 1; i >= 0; i--) {
            var turret = turrets[i];
            if (turret.team == currentTeam || turret.bulletFiring) {
                fogContext.beginPath();
                fogContext.globalCompositeOperation = "destination-out";
                fogContext.arc((Math.floor(turret.x)) * gridSize + turret.pixelWidth / 2, (Math.floor(turret.y)) * gridSize + turret.pixelHeight / 2, turret.sight * gridSize, 0, 2 * Math.PI, false);
                fogContext.fill();
            }
        }
        ;
        fogContext.restore();
        context.drawImage(this.fogCanvas, 0 + screen.viewportOffset.x * this.canvasWidth / this.mapWidth, 0 + screen.viewportOffset.y * this.canvasHeight / this.mapHeight, screen.viewport.width * this.canvasWidth / this.mapWidth, screen.viewport.height * this.canvasHeight / this.mapHeight, screen.viewport.left, screen.viewport.top, screen.viewport.width, screen.viewport.height);
    };
    return Fog;
}());
module.exports = Fog;


},{}],7:[function(require,module,exports){
"use strict";
var GameScreen = require("./GameScreen");
var Sidebar = require("./Sidebar");
var Fog = require("./Fog");
var Mouse = require("./Mouse");
var Levels = require("./Levels");
var Buildings = require("./Buildings");
var TurretsFactory = require("./Turrets");
var Infantry = require("./InfantryFactory");
var Vehicles = require("./Vehicles");
var Sounds = require("./Sounds");
var OverlayFactory = require("./OverlayFactory");
var Player = require("./Player");
var Game = /** @class */ (function () {
    function Game(canvas) {
        this.obstructionGrid = [];
        this.buildingObstructionGrid = [];
        this.heroObstructionGrid = [];
        this.animationLoop = null;
        this.tiberiumLoop = null;
        this.statusLoop = null;
        this.controlGroups = [];
        this.units = [];
        this.buildings = [];
        this.turrets = [];
        this.overlay = [];
        this.bullets = [];
        this.messageVisible = true;
        this.messageHeadingVisible = true;
        this.messageText = '\nCreate a base by deploying your MCV. Build a power plant and weapons factory.\n\nUse your tanks to get rid of all enemy presence in the area.';
        this.selectedItems = [];
        this.selectedAttackers = [];
        this.selectedUnits = [];
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.spriteCanvas = canvas;
        this.spriteContext = canvas.getContext('2d');
        this.screen = new GameScreen(canvas.width, canvas.height);
        this.screen.viewport.top = 35;
        this.gridSize = 24;
        this.animationTimeout = 50;
        this.debugMode = false;
        this.speedAdjustmentFactor = 0.2;
        this.sidebar = new Sidebar();
        this.mouse = new Mouse();
        this.levels = new Levels();
        this.buildingsFactory = new Buildings;
        this.turretsFactory = new TurretsFactory();
        this.infantry = new Infantry();
        this.vehicles = new Vehicles();
        this.sounds = new Sounds();
        this.overlayFactory = new OverlayFactory();
    }
    Game.prototype.setViewport = function () {
        this.context.beginPath();
        this.screen.viewport.width = (this.sidebar.visible) ? (this.screen.width - this.sidebar.width) : this.screen.width;
        this.screen.viewport.height = 480;
        this.context.rect(this.screen.viewport.left, this.screen.viewport.top, this.screen.viewport.width - this.screen.viewport.left, this.screen.viewport.height);
        this.context.clip();
    };
    Game.prototype.drawMap = function () {
        //context.drawImage(this.currentLevel.mapImage,0,0);
        this.mouse.handlePanning(this.screen, this.currentLevel.mapImage, this.sidebar);
        this.context.drawImage(this.currentLevel.mapImage, this.screen.viewportOffset.x, this.screen.viewportOffset.y, this.screen.viewport.width, this.screen.viewport.height, this.screen.viewport.left, this.screen.viewport.top, this.screen.viewport.width, this.screen.viewport.height);
        // Create an obstruction grid from the level 
        this.obstructionGrid = []; // normal obstructions
        this.heroObstructionGrid = []; // Cannot see in fog, so pretend
        this.buildingObstructionGrid = []; // Cannot build on fog; Cannot build on bib
        for (var y = 0; y < this.currentLevel.obstructionGrid.length; y++) {
            this.obstructionGrid[y] = [];
            this.heroObstructionGrid[y] = [];
            this.buildingObstructionGrid[y] = [];
            for (var x = 0; x < this.currentLevel.obstructionGrid[y].length; x++) {
                this.obstructionGrid[y][x] = this.currentLevel.obstructionGrid[y][x];
                this.heroObstructionGrid[y][x] = this.currentLevel.obstructionGrid[y][x];
                this.buildingObstructionGrid[y][x] = this.currentLevel.obstructionGrid[y][x];
            }
        }
        for (var i = this.buildings.length - 1; i >= 0; i--) {
            var bldng = this.buildings[i];
            for (var y = 0; y < bldng.gridShape.length; y++) {
                for (var x = 0; x < bldng.gridShape[y].length; x++) {
                    if (bldng.gridShape[y][x] == 1) {
                        this.obstructionGrid[y + bldng.y][x + bldng.x] = 1;
                        this.heroObstructionGrid[y + bldng.y][x + bldng.x] = 1;
                        this.buildingObstructionGrid[y + bldng.y][x + bldng.x] = 1;
                        //include an extra row for bib as a no building zone
                        if (y == bldng.gridShape.length - 1) {
                            this.buildingObstructionGrid[y + 1 + bldng.y][x + bldng.x] = 1;
                        }
                    }
                }
            }
        }
        ;
        for (var i = this.turrets.length - 1; i >= 0; i--) {
            var turret = this.turrets[i];
            this.obstructionGrid[turret.y][turret.x] = 1;
            this.heroObstructionGrid[turret.y][turret.x] = 1;
            this.buildingObstructionGrid[turret.y][turret.x] = 1;
        }
        ;
        for (var i = this.units.length - 1; i >= 0; i--) {
            var unit = this.units[i];
            var x = unit.x;
            var y = unit.y;
            //var collisionRadius = unit.collisionRadius/this.gridSize;
            this.buildingObstructionGrid[Math.floor(y)][Math.floor(x)] = 1;
            //this.obstructionGrid[Math.floor(y-collisionRadius)][Math.floor(x-collisionRadius)] = 1;
            //this.obstructionGrid[Math.floor(y-collisionRadius)][Math.floor(x+collisionRadius)] = 1;
            //this.obstructionGrid[Math.floor(y+collisionRadius)][Math.floor(x-collisionRadius)] = 1;
            //this.obstructionGrid[Math.floor(y+collisionRadius)][Math.floor(x+collisionRadius)] = 1;
        }
        ;
        for (var i = this.overlay.length - 1; i >= 0; i--) {
            var over = this.overlay[i];
            if (over.name == 'tree') {
                this.obstructionGrid[over.y][over.x] = 1;
                this.heroObstructionGrid[over.y][over.x] = 1;
                this.buildingObstructionGrid[over.y][over.x] = 1;
            }
            else if (over.name == 'trees') {
                this.obstructionGrid[over.y][over.x] = 1;
                this.obstructionGrid[over.y][over.x + 1] = 1;
                this.heroObstructionGrid[over.y][over.x] = 1;
                this.heroObstructionGrid[over.y][over.x + 1] = 1;
                this.buildingObstructionGrid[over.y][over.x] = 1;
                this.buildingObstructionGrid[over.y][over.x + 1] = 1;
            }
            else if (over.name == 'tiberium') {
                this.buildingObstructionGrid[over.y][over.x] = 1;
            }
        }
        ;
        // If hero cannot see under fog, he assumes he can travel there... 
        // when he sees the building, he goes oops!!! and then starts avoiding it....
        // Buildings can't be built on fog either
        for (var y = 0; y < this.heroObstructionGrid.length; y++) {
            for (var x = 0; x < this.heroObstructionGrid[y].length; x++) {
                if (this.fog.isOver((x + 0.5) * this.gridSize, (y + 0.5) * this.gridSize)) {
                    //this.heroObstructionGrid[y][x] = 0;
                    this.buildingObstructionGrid[y][x] = 1;
                }
            }
        }
    };
    Game.prototype.keyPressed = function (ev) {
        var keyCode = ev.which;
        var ctrlPressed = ev.ctrlKey;
        //keys from 0 to 9 pressed
        if (keyCode >= 48 && keyCode <= 57) {
            var keyNumber = (keyCode - 48);
            if (ctrlPressed) {
                if (this.selectedItems.length > 0) {
                    this.controlGroups[keyNumber] = $.extend([], this.selectedItems);
                    //console.log(keyNumber + ' now has ' +this.controlGroups[keyNumber].length +' items');
                }
                //console.log ("Pressed Ctrl"+ (keyNumber-48));   
            }
            else {
                if (this.controlGroups[keyNumber]) {
                    this.clearSelection();
                    //console.log ("Pressed"+ (keyNumber));
                    //console.log(this.controlGroups[keyNumber].length)
                    for (var i = this.controlGroups[keyNumber].length - 1; i >= 0; i--) {
                        if (this.controlGroups[keyNumber][i].status == 'destroy') {
                            this.controlGroups[keyNumber].splice(i, 1);
                        }
                        else {
                            this.selectItem(this.controlGroups[keyNumber][i]);
                        }
                        //console.log ('selecting '+this.controlGroups[keyNumber][i].name)
                    }
                    ;
                }
            }
        }
    };
    Game.prototype.highlightGrid = function (i, j, width, height, optionalImage) {
        //alert('('+i+','+j+')');
        var gridSize = this.gridSize;
        var isImage = optionalImage instanceof HTMLImageElement || optionalImage instanceof HTMLCanvasElement;
        if (isImage) {
            this.context.drawImage(optionalImage, i * gridSize + this.screen.viewportAdjust.x, j * gridSize + this.screen.viewportAdjust.y, width * gridSize, height * gridSize);
        }
        else {
            if (optionalImage) {
                this.context.fillStyle = optionalImage;
            }
            else {
                this.context.fillStyle = 'rgba(225,225,225,0.5)';
            }
            this.context.fillRect(i * gridSize + this.screen.viewportAdjust.x, j * gridSize + this.screen.viewportAdjust.y, width * gridSize, height * gridSize);
        }
    };
    Game.prototype.drawGrid = function () {
        var gridSize = this.gridSize;
        var mapWidth = this.currentLevel.mapImage.width;
        var mapHeight = this.currentLevel.mapImage.height;
        var viewportX = this.screen.viewportOffset.x;
        var viewportY = this.screen.viewportOffset.y;
        var gridWidth = mapWidth / gridSize;
        var gridHeight = mapHeight / gridSize;
        this.context.beginPath();
        this.context.strokeStyle = 'rgba(30,0,0,.6)';
        for (var i = 0; i < gridWidth; i++) {
            this.context.moveTo(i * gridSize - viewportX + this.screen.viewport.left, 0 - viewportY + this.screen.viewport.top);
            this.context.lineTo(i * gridSize - viewportX + this.screen.viewport.left, mapHeight - viewportY + this.screen.viewport.top);
        }
        for (var i = 0; i < gridHeight; i++) {
            this.context.moveTo(0 - viewportX + this.screen.viewport.left, i * gridSize - viewportY + this.screen.viewport.top);
            this.context.lineTo(mapWidth - viewportX + this.screen.viewport.left, i * gridSize - viewportY + this.screen.viewport.top);
        }
        this.context.stroke();
        for (var i = this.obstructionGrid.length - 1; i >= 0; i--) {
            for (var j = this.obstructionGrid[i].length - 1; j >= 0; j--) {
                if (this.heroObstructionGrid[i][j] == 1) {
                    this.highlightGrid(j, i, 1, 1, 'rgba(100,0,0,0.5)');
                }
            }
            ;
        }
        ;
    };
    Game.prototype.fireBullet = function (bullet) {
        bullet.x = bullet.x - 0.5 * Math.sin(bullet.angle);
        bullet.y = bullet.y - 0.5 * Math.cos(bullet.angle);
        bullet.range = bullet.range - 0.5;
        //alert(bullet.x +' '+bullet.y)
        this.bullets.push(bullet);
        setTimeout(function () { bullet.source.bulletFiring = false; }, bullet.source.reloadTime);
    };
    Game.prototype.drawBullets = function () {
        for (var j = this.bullets.length - 1; j >= 0; j--) {
            var bullet = this.bullets[j];
            bullet.speed = 5;
            bullet.range = bullet.range - 0.1 * bullet.speed;
            bullet.x = bullet.x - 0.1 * bullet.speed * Math.sin(bullet.angle);
            bullet.y = bullet.y - 0.1 * bullet.speed * Math.cos(bullet.angle);
            var x = (bullet.x * this.gridSize);
            var y = (bullet.y * this.gridSize);
            //alert(x + ' ' + y)
            if (!bullet.dead) {
                var overObject;
                for (var i = this.units.length - 1; i >= 0; i--) {
                    if (this.units[i].underPoint && this.units[i].underPoint(x, y, this.gridSize) && this.units[i].team != bullet.source.team) {
                        overObject = this.units[i];
                        break;
                    }
                }
                ;
                for (var i = this.buildings.length - 1; i >= 0; i--) {
                    if (this.buildings[i].underPoint(x, y, this.gridSize)) {
                        overObject = this.buildings[i];
                        break;
                    }
                }
                ;
                for (var i = this.turrets.length - 1; i >= 0; i--) {
                    if (this.turrets[i].underPoint(x, y, this.gridSize)) {
                        overObject = this.turrets[i];
                        break;
                    }
                }
                ;
                if (overObject) {
                    bullet.dead = true;
                    //alert(overObject.health);
                    overObject.hitPoints = overObject.hitPoints - Math.floor((bullet.damage ? bullet.damage : 10) + 10 * Math.random());
                    if (overObject.hitPoints <= 0) {
                        overObject.status = 'destroy';
                    }
                }
                this.context.fillStyle = 'red';
                this.context.fillRect(x + this.screen.viewportAdjust.x, y + this.screen.viewportAdjust.y, 2, 2);
            }
            //alert(x +' '+y)
            if (bullet.range <= 0) {
                //bullet.source.bulletFiring = false;
                this.bullets.splice(j, 1);
            }
        }
        ;
    };
    Game.prototype.drawObjects = function () {
        var objects = [];
        for (var i = this.buildings.length - 1; i >= 0; i--) {
            if (this.buildings[i].status == 'destroy') {
                this.buildings.splice(i, 1);
            }
        }
        ;
        for (var i = this.units.length - 1; i >= 0; i--) {
            if (this.units[i].status == 'destroy') {
                this.units.splice(i, 1);
            }
        }
        ;
        for (var i = this.turrets.length - 1; i >= 0; i--) {
            if (this.turrets[i].status == 'destroy') {
                this.turrets.splice(i, 1);
            }
        }
        ;
        for (var i = this.selectedItems.length - 1; i >= 0; i--) {
            if (this.selectedItems[i].status == 'destroy') {
                this.selectedItems.splice(i, 1);
            }
        }
        ;
        for (var i = this.selectedAttackers.length - 1; i >= 0; i--) {
            if (this.selectedAttackers[i].status == 'destroy') {
                this.selectedAttackers.splice(i, 1);
            }
        }
        ;
        for (var i = this.selectedUnits.length - 1; i >= 0; i--) {
            if (this.selectedUnits[i].status == 'destroy') {
                this.selectedUnits.splice(i, 1);
            }
        }
        ;
        $.merge(objects, this.units);
        $.merge(objects, this.buildings);
        $.merge(objects, this.overlay);
        $.merge(objects, this.turrets);
        var cgY = function (obj) {
            if (obj.type == "building") {
                return obj.y + obj.gridShape.length / 2;
            }
            return obj.y;
        };
        objects.sort(function (a, b) {
            return cgY(b) - cgY(a);
            //return b.y - a.y;
        });
        for (var i = this.overlay.length - 1; i >= 0; i--) {
            var overlay = this.overlay[i];
            if (overlay.name == 'tiberium') {
                overlay.draw(this.context, this.currentPlayer.team, this.gridSize, this.screen, this.units, this.vehicles, this.sidebar, this.enemyPlayer, this.debugMode);
            }
        }
        ;
        for (var i = objects.length - 1; i >= 0; i--) {
            if (objects[i].name != 'tiberium') {
                objects[i].draw(this.context, this.currentPlayer.team, this.gridSize, this.screen, this.units, this.vehicles, this.sidebar, this.enemyPlayer, this.debugMode);
            }
        }
        ;
        /*for (var i = this.units.length - 1; i >= 0; i--){
           this.units[i].draw();
        };
        
        for (var i = this.buildings.length - 1; i >= 0; i--){
           this.buildings[i].draw();
        };*/
    };
    Game.prototype.moveObjects = function () {
        for (var i = this.units.length - 1; i >= 0; i--) {
            if (this.units[i]['processOrders']) {
                this.units[i].processOrders(this.speedAdjustmentFactor, this.units, this.buildings, this.turrets, this.overlay, this.buildingsFactory, this.fog, this.sounds, this.currentPlayer.team, this.obstructionGrid, this.heroObstructionGrid, this.debugMode, this.context, this.gridSize, this.screen);
            }
            this.units[i].move(this.speedAdjustmentFactor, this.gridSize, this.sounds, this);
        }
        ;
        for (var i = this.turrets.length - 1; i >= 0; i--) {
            if (this.turrets[i].processOrders) {
                this.turrets[i].processOrders(this.gridSize, this.units, this.buildings, this.turrets);
            }
            this.turrets[i].move(this.sounds, this);
        }
        ;
    };
    Game.prototype.showDebugger = function () {
        var getKeys = function (item) {
            var html = '<ul>';
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    var o = item[key];
                    if (typeof o != "function" || o === null) {
                        if (typeof o == "object") {
                            html += "<li>" + key + " : ";
                            if (o instanceof HTMLImageElement) {
                                html += (o.src).replace(/^.+images\//, '');
                            }
                            else if (o instanceof Array) {
                                html += 'Array[' + o.length + ']';
                            }
                            else {
                                html += 'Object'; //getKeys(o);
                            }
                        }
                        else {
                            html += "<li>" + key + " : " + o + "</li>";
                        }
                    }
                }
            }
            html += "</ul>";
            return html;
        };
        var html = "";
        html += "Level";
        html += getKeys(this.levels);
        html += "Mouse";
        html += getKeys(this.mouse);
        if (this.selectedItems.length == 1) {
            html += "Selected Item";
            html += getKeys(this.selectedItems[0]);
        }
        html += "Game";
        html += getKeys(this);
        html += "Sidebar";
        html += getKeys(this.sidebar);
        html += "Vehicles";
        html += getKeys(this.vehicles);
        html += "Buildings";
        html += getKeys(this.buildings);
        html += "Infantry";
        html += getKeys(this.infantry);
        $('#debugger').html(html);
    };
    Game.prototype.animate = function () {
        var _this = this;
        // main animation loop once game has started
        if (this.debugMode) {
            this.showDebugger();
        }
        if (!this.levels.loaded || !this.sidebar.loaded
            || !this.vehicles.loaded || !this.infantry.loaded || !this.buildingsFactory.loaded) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        this.context.save();
        // Draw the top panels
        // Draw sidebar if appropriate
        // set viewport
        this.sidebar.draw(this.units, this.buildings, this.infantry, this.vehicles, this.context, this.sounds, this.spriteContext, this.spriteCanvas, this.screen, this.currentPlayer.team);
        this.setViewport();
        this.drawMap();
        if (this.debugMode) {
            this.drawGrid();
        }
        // Draw the map
        //////////////
        // Test scripted events and handle
        // Draw the overlay
        // Draw the buildings
        // Any animation if necessary
        this.moveObjects();
        // Draw the units
        this.drawObjects();
        //
        this.drawBullets();
        if (!this.debugMode) {
            this.fog.draw(this.context, this.units, this.gridSize, this.currentPlayer.team, this.buildings, this.turrets, this.screen);
        }
        this.context.restore();
        this.drawMessage();
        // show appropriate mouse cursor
        this.mouse.draw(this.context, this.screen, this.currentLevel, this.overlay, this.sidebar, this.buildingsFactory, this.buildings, this.turretsFactory, this.turrets, this.vehicles, this.infantry, this.units, this.selectedUnits, this.selectedAttackers, this.buildingObstructionGrid, this.obstructionGrid, this.gridSize, function (i, j, w, h, img) { return _this.highlightGrid(i, j, w, h, img); });
        ///this.missionStatus();
        //
    };
    Game.prototype.drawMessage = function () {
        if (!this.messageVisible) {
            return;
        }
        this.context.drawImage(this.sidebar.messageBox, this.screen.viewport.left + 22, this.screen.viewport.top + 150);
        if (!this.messageHeadingVisible) {
            this.context.fillStyle = 'black';
            this.context.fillRect(265, 198, 120, 20);
        }
        this.context.fillStyle = 'green';
        this.context.font = '16px "Command and Conquer"';
        var msgs = this.messageText.split('\n');
        for (var i = 0; i < msgs.length; i++) {
            this.context.fillText(msgs[i], this.screen.viewport.left + 80, this.screen.viewport.top + 200 + i * 18);
        }
        ;
    };
    Game.prototype.displayMessage = function (text, displayHeader) {
        this.messageText = text;
        this.messageVisible = true;
        this.messageHeadingVisible = !!displayHeader;
    };
    Game.prototype.missionStatus = function () {
        var item, heroUnits = [], heroBuildings = [], heroTurrets = [], villainBuildings = [], villainUnits = [], villainTurrets = [];
        for (var i = this.units.length - 1; i >= 0; i--) {
            item = this.units[i];
            if (item.team == this.currentLevel.team) {
                heroUnits.push(item);
            }
            else {
                villainUnits.push(item);
            }
        }
        ;
        for (var i = this.buildings.length - 1; i >= 0; i--) {
            item = this.buildings[i];
            if (item.team == this.currentLevel.team) {
                heroBuildings.push(item);
            }
            else {
                villainBuildings.push(item);
            }
        }
        ;
        for (var i = this.turrets.length - 1; i >= 0; i--) {
            item = this.turrets[i];
            if (item.team == this.currentLevel.team) {
                heroTurrets.push(item);
            }
            else {
                villainTurrets.push(item);
            }
        }
        ;
        //alert(heroBuildings.length)
        if (heroUnits.length == 0 && heroBuildings.length == 0) {
            //mission failed;
            this.sounds.play('mission_failure');
            this.end();
            //alert('Game over \n If you liked this, please share with your friends using the Like button and leave me a comment');
        }
        if (villainTurrets.length == 0 && villainBuildings.length == 0 && villainUnits.length == 0) {
            //mission accomplished
            this.sounds.play('mission_accomplished');
            this.end();
            //alert('Game over \n If you liked this, please share with your friends using the Like button and leave me a comment');
        }
    };
    Game.prototype.clearSelection = function () {
        for (var i = this.selectedItems.length - 1; i >= 0; i--) {
            this.selectedItems[i].selected = false;
            this.selectedItems.splice(i, 1);
        }
        ;
        this.selectedAttackers = [];
        this.selectedUnits = [];
    };
    Game.prototype.selectItem = function (item, shiftPressed) {
        if (shiftPressed && item.selected) {
            // deselect item
            item.selected = false;
            var i = this.selectedItems.indexOf(item);
            if (i >= 0)
                this.selectedItems.splice(i, 1);
            else if ((i = this.selectedUnits.indexOf(item)) >= 0)
                this.selectedUnits.splice(i, 1);
            else if ((i = this.selectedAttackers.indexOf(item)) >= 0)
                this.selectedAttackers.splice(i, 1);
            return;
        }
        item.selected = true;
        this.selectedItems.push(item);
        //alert(1)
        if (item.type != 'building' && item.team == this.currentLevel.team) {
            this.selectedUnits.push(item);
            this.sounds.play(item.type + '_select');
            if (item.primaryWeapon) {
                this.selectedAttackers.push(item);
            }
        }
    };
    Game.prototype.click = function (ev, rightClick) {
        if (this.messageVisible) {
            if (this.mouse.x >= 290 && this.mouse.x <= 350 && this.mouse.y >= 310 && this.mouse.y <= 325) {
                this.messageVisible = false;
                return;
            }
        }
        var selectedObject = this.mouse.checkOverObject(this.overlay, this.buildings, this.turrets, this.units, this.gridSize);
        if (rightClick) {
            this.clearSelection();
            this.sidebar.repairMode = false;
            this.sidebar.deployMode = false;
            this.sidebar.sellMode = false;
            return;
        }
        if (this.sidebar.repairMode) {
            if (selectedObject && selectedObject.team == this.currentLevel.team
                && (selectedObject.type == 'building' || selectedObject.type == 'turret') && (selectedObject.hitPoints < selectedObject.maxHitPoints)) {
                // do repair
                //alert('repairing')
                selectedObject.repairing = true;
            }
        }
        else if (this.sidebar.deployMode) {
            //if (buildings.canConstruct(sidebar.deployBuilding,mouse.gridX,mouse.gridY)){
            var buildingType = this.buildingsFactory.types[this.sidebar.deployBuilding] || this.turretsFactory.types[this.sidebar.deployBuilding];
            var grid = $.extend([], buildingType.gridShape);
            grid.push(grid[grid.length - 1]);
            //grid.push(grid[1]);
            for (var y = 0; y < grid.length; y++) {
                for (var x = 0; x < grid[y].length; x++) {
                    if (grid[y][x] == 1) {
                        //console.log("mouse.gridX+x"+(mouse.gridX+x)+"mouse.gridY+y:"+(mouse.gridY+y))
                        if (this.mouse.gridY + y < 0 || this.mouse.gridY + y >= this.buildingObstructionGrid.length || this.mouse.gridX + x < 0 || this.mouse.gridX + x >= this.buildingObstructionGrid[this.mouse.gridY + y].length || this.buildingObstructionGrid[this.mouse.gridY + y][this.mouse.gridX + x] == 1) {
                            this.sounds.play('cannot_deploy_here');
                            return;
                        }
                    }
                }
            }
            this.sidebar.finishDeployingBuilding(this.buildings, this.buildingsFactory, this.turrets, this.turretsFactory, this.sounds, this.mouse, this.currentPlayer.team);
            //} else {
            //    sounds.play('cannot_deploy_here');
            //}
        }
        else if (this.sidebar.sellMode) {
            if (selectedObject && selectedObject.team == this.currentLevel.team
                && (selectedObject.type == 'building' || selectedObject.type == 'turret')) {
                if (selectedObject.name == 'refinery' && selectedObject.status == 'unload') {
                    this.units.push(this.vehicles.add({
                        name: 'harvester',
                        team: selectedObject.team,
                        x: selectedObject.x + 0.5,
                        y: selectedObject.y + 2,
                        hitPoints: selectedObject.harvester.hitPoints,
                        moveDirection: 14,
                        orders: { type: 'guard' }
                    }));
                    selectedObject.harvester = null;
                }
                selectedObject.status = 'sell';
                this.sounds.play('sell');
                this.sidebar.cash += selectedObject.cost / 2;
            }
        }
        else if (!rightClick && !this.mouse.dragSelect) {
            if (selectedObject) {
                if (this.selectedUnits.length == 1 && selectedObject.selected && selectedObject.team == this.currentLevel.team) {
                    if (selectedObject.name == 'mcv') {
                        // check building deployment
                        this.clearSelection();
                        selectedObject.orders = { type: 'build' };
                        //alert('put a building here')
                    }
                }
                else if (this.selectedUnits.length == 1 && this.selectedUnits[0].name == 'harvester'
                    && this.selectedUnits[0].team == this.currentLevel.team
                    && (selectedObject.name == 'tiberium' || selectedObject.name == 'refinery') && !this.mouse.isOverFog) {
                    //My team's harvester is selected alone
                    if (selectedObject.name == 'tiberium') {
                        this.selectedUnits[0].orders = { type: 'harvest', to: { x: selectedObject.x, y: selectedObject.y } };
                        this.sounds.play('vehicle_move');
                    }
                    if (selectedObject.name == 'refinery' && selectedObject.team == this.currentLevel.team) {
                        this.selectedUnits[0].orders = { type: 'harvest-return', to: selectedObject };
                        this.sounds.play('vehicle_move');
                    }
                }
                else if (selectedObject.team == this.currentLevel.team) {
                    if (!ev.shiftKey) {
                        this.clearSelection();
                    }
                    this.selectItem(selectedObject, ev.shiftKey);
                }
                else if (this.selectedAttackers.length > 0 && selectedObject.name != 'tiberium' && !this.mouse.isOverFog) {
                    for (var i = this.selectedAttackers.length - 1; i >= 0; i--) {
                        if (this.selectedAttackers[i].primaryWeapon) {
                            this.selectedAttackers[i].orders = { type: 'attack', target: selectedObject };
                            this.sounds.play(this.selectedAttackers[i].type + '_move');
                        }
                    }
                    ;
                }
                else if (selectedObject.name == 'tiberium') {
                    if (this.selectedUnits.length > 0) {
                        if (this.obstructionGrid[this.mouse.gridY] && this.obstructionGrid[this.mouse.gridY][this.mouse.gridX] == 1 && !this.mouse.isOverFog) {
                            // Don't do anything
                        }
                        else {
                            for (var i = this.selectedUnits.length - 1; i >= 0; i--) {
                                this.selectedUnits[i].orders = { type: 'move', to: { x: this.mouse.gridX, y: this.mouse.gridY } };
                                this.sounds.play(this.selectedUnits[i].type + '_move');
                            }
                            ;
                        }
                    }
                }
                else {
                    if (!ev.shiftKey) {
                        this.clearSelection();
                    }
                    this.selectItem(selectedObject, ev.shiftKey);
                }
            }
            else { // no object under mouse
                if (this.selectedUnits.length > 0) {
                    if (this.obstructionGrid[this.mouse.gridY] && this.obstructionGrid[this.mouse.gridY][this.mouse.gridX] == 1 && !this.mouse.isOverFog) {
                        // Don't do anything
                    }
                    else {
                        for (var i = this.selectedUnits.length - 1; i >= 0; i--) {
                            this.selectedUnits[i].orders = { type: 'move', to: { x: this.mouse.gridX, y: this.mouse.gridY } };
                            this.sounds.play(this.selectedUnits[i].type + '_move');
                        }
                        ;
                    }
                }
            }
        }
    };
    Game.prototype.start = function () {
        var _this = this;
        // Show main menu screen
        // Wait for level click
        //$(canvas).css("cursor", "cursor:url(cursors/blank.png),none !important;");
        // load all sounds
        // load level
        this.mouse.loadAllCursors();
        this.sounds.loadAll();
        this.overlayFactory.loadAll();
        this.currentLevel = this.levels.load('gdi1', this.buildingsFactory, this.turretsFactory, this.vehicles, this.infantry, this.overlayFactory, this.gridSize);
        this.currentPlayer = new Player(this.currentLevel.team, this.currentLevel.startingCash);
        this.enemyPlayer = new Player(this.currentLevel.enemyTeam, this.currentLevel.startingEnemyCash);
        this.overlay = this.currentLevel.overlay;
        //this.team = this.currentLevel.team;
        this.fog = new Fog(this.currentLevel.mapImage);
        this.sidebar.load(this.currentPlayer.cash, this.screen, this.canvas.width);
        this.listenEvents();
        this.fog.init(this.currentLevel.mapImage.width, this.currentLevel.mapImage.height);
        this.screen.viewportOffset.x = 96;
        this.screen.viewportOffset.y = 264;
        this.sidebar.visible = false;
        // Enemy Stuff
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 8, y: 6, turretDirection: 16, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 9, y: 3, turretDirection: 16, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 7, y: 5, turretDirection: 16, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 8, y: 2, turretDirection: 16, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 16, y: 25, turretDirection: 24, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 13, y: 26, turretDirection: 24, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 11, y: 23, turretDirection: 18, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 10, y: 24, turretDirection: 20, team: 'nod' }));
        this.turrets.push(this.turretsFactory.add({ name: 'gun-turret', x: 9, y: 25, turretDirection: 24, team: 'nod' }));
        //this.turrets.push(this.turretsFactory.add({name:'gun-turret',x:9,y:26,turretDirection:26,team:'nod'}));
        this.buildings.push(this.buildingsFactory.add({ name: 'refinery', team: 'nod', x: 26, y: 8, status: 'build', hitPoints: 200 }));
        //this.units.push(this.vehicles.add({name:'harvester',team:'nod',x:24,y:18,moveDirection:0}));
        //this.units.push(this.vehicles.add({name:'harvester',x:25,y:18,moveDirection:0}));
        this.buildings.push(this.buildingsFactory.add({ name: 'construction-yard', x: 1, y: 14, team: 'nod' }));
        this.buildings.push(this.buildingsFactory.add({ name: 'power-plant', x: 5, y: 14, team: 'nod' }));
        this.buildings.push(this.buildingsFactory.add({ name: 'hand-of-nod', x: 5, y: 19, team: 'nod' }));
        //this.buildings.push(this.buildingsFactory.add({name:'barracks',x:4,y:14,team:'nod'}));             
        //this.buildings.push(this.buildingsFactory.add({name:'power-plant',x:18,y:10,health:200,team:'nod'})); 
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 7, y: 6, team: 'nod', orders: { type: 'patrol', from: { x: 9, y: 24 }, to: { x: 12, y: 8 } } }));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 2, y: 20, team: 'nod', orders: { type: 'patrol', from: { x: 2, y: 5 }, to: { x: 6, y: 20 } } }));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 5, y: 10, team: 'nod', orders: { type: 'patrol', from: { x: 17, y: 12 }, to: { x: 22, y: 2 } } }));
        //this.units.push(this.vehicles.add({name:'light-tank',x:2,y:2,team:'nod',orders:{type:'patrol',from:{x:25,y:5},to:{x:17,y:25}}}));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 4, y: 23, team: 'nod', orders: { type: 'patrol', from: { x: 4, y: 23 }, to: { x: 22, y: 25 } } }));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 2, y: 10, team: 'nod', orders: { type: 'protect', target: this.units[0] } }));
        this.units.push(this.vehicles.add({ name: 'mcv', x: 23.5, y: 23.5, team: 'gdi', moveDirection: 0, orders: { type: 'move', to: { x: 23, y: 21 } } }));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 23, y: 27, team: 'gdi', moveDirection: 0, orders: { type: 'move', to: { x: 22, y: 23 } } }));
        this.units.push(this.vehicles.add({ name: 'light-tank', x: 24, y: 27, team: 'gdi', moveDirection: 0, orders: { type: 'move', to: { x: 24, y: 23 } } }));
        //this.buildings.push(this.buildingsFactory.add({name:'weapons-factory',x:18,y:6}));
        //this.buildings.push(this.buildingsFactory.add({name:'weapons-factory',x:24,y:18}));
        //this.units.push(this.vehicles.add({name:'mcv',x:7,y:4,moveDirection:8}));
        //this.units.push(this.infantry.add({name:'minigunner',x:27,y:12,team:'nod'}));
        //this.units.push(this.infantry.add({name:'minigunner',x:6,y:22,team:'nod'}));
        //this.units.push(this.infantry.add({name:'minigunner',x:5,y:22,team:'nod'}));
        //this.units.push(this.infantry.add({name:'minigunner',x:28,y:12,team:'nod'}));
        //this.units.push(this.vehicles.add({name:'light-tank',x:23,y:25,moveDirection:0}));
        //sounds.play('reinforcements_have_arrived');
        //this.units.push(this.infantry.add({name:'minigunner',x:8,y:13}));
        //this.units.push(this.vehicles.add({name:'light-tank',x:5,y:13,orders:{type:'patrol',from:{x:5,y:13},to:{x:4,y:4}},team:'nod'})); 
        //this.units.push(this.vehicles.add({name:'light-tank',x:16,y:8,orders:{type:'protect',target:this.units[3]}}));
        /*
        this.units.push(this.infantry.add({name:'minigunner',x:7,y:13,team:'nod'}));
        this.units.push(this.vehicles.add({name:'light-tank',x:5,y:13,orders:{type:'patrol',from:{x:5,y:13},to:{x:4,y:4}},team:'nod'}));
        this.units.push(this.vehicles.add({name:'light-tank',x:16,y:8,orders:{type:'protect',target:this.units[3]}}));
        this.units.push(this.vehicles.add({name:'light-tank',x:10,y:10,orders:{type:'protect',target:this.units[0]},team:'nod'}));
        
        this.units.push(this.turrets.add({name:'gun-turret',x:12,y:13,moveDirection:9,team:'nod'}));
        
        */
        //this.buildings.push(this.buildingsFactory.add({name:'power-plant',x:12,y:8,health:100,primaryBuilding:true})); 
        //this.buildings.push(this.buildingsFactory.add({name:'construction-yard',x:9,y:4,primaryBuilding:true})); 
        //this.buildings.push(this.buildingsFactory.add({name:'barracks',x:12,y:4,status:'build'}));
        //this.buildings.push(this.buildingsFactory.add({name:'weapons-factory',x:15,y:12})); 
        /*this.buildings.push(this.buildingsFactory.add({name:'construction-yard',x:3,y:9,status:'build',team:'nod'}));
        
        
        this.buildings.push(this.buildingsFactory.add({name:'barracks',x:12,y:4}));
        this.buildings.push(this.buildingsFactory.add({name:'barracks',x:14,y:4,team:'nod'}));
        
        this.buildings.push(this.buildingsFactory.add({name:'power-plant',x:12,y:8,status:'build',health:100,primaryBuilding:true}));
        
        this.buildings.push(this.buildingsFactory.add({name:'power-plant',x:18,y:10,status:'build',health:200,team:'nod'}));
        
        this.buildings.push(this.buildingsFactory.add({name:'weapons-factory',x:15,y:12,status:'construct',health:200}));
        
        
        this.buildings.push(this.buildingsFactory.add({name:'weapons-factory',x:13,y:16,status:'build',health:200,team:'nod'}));
        
        */
        this.animationLoop = setInterval(function () { return _this.animate(); }, this.animationTimeout);
        this.tiberiumLoop = setInterval(function () {
            for (var i = 0; i < _this.overlay.length; i++) {
                var overlay = _this.overlay[i];
                if (overlay.name == 'tiberium' && overlay.stage < 11) {
                    overlay.stage++;
                }
            }
            ;
        }, this.animationTimeout * 40 * 600);
        this.statusLoop = setInterval(function () { return _this.missionStatus(); }, 3000);
    };
    Game.prototype.end = function () {
        //clearInterval(this.animationLoop);
        clearInterval(this.statusLoop);
        clearInterval(this.tiberiumLoop);
        this.sidebar.visible = false;
        this.displayMessage('Thank you for trying this demo.'
            + 'This is still a work in progress. \nAny comments, feedback (including bugs), and advice is appreciated.\n\nIf you liked this demo, please share this page with all your friends. ');
    };
    Game.prototype.listenEvents = function () {
        var _this = this;
        this.canvas.addEventListener('mousemove', function (ev) {
            var offset = $(_this.canvas).offset();
            _this.mouse.x = ev.pageX - offset.left;
            _this.mouse.y = ev.pageY - offset.top;
            _this.mouse.gridX = Math.floor((_this.mouse.gameX) / _this.gridSize);
            _this.mouse.gridY = Math.floor((_this.mouse.gameY) / _this.gridSize);
            _this.mouse.isOverFog = _this.fog.isOver(_this.mouse.gameX, _this.mouse.gameY);
            //this.panDirection = this.handlePanning();
            //this.showAppropriateCursor();
            if (_this.mouse.buttonPressed) {
                if (Math.abs(_this.mouse.dragX - _this.mouse.gameX) > 5 ||
                    Math.abs(_this.mouse.dragY - _this.mouse.gameY) > 5) {
                    _this.mouse.dragSelect = true;
                }
            }
            else {
                _this.mouse.dragSelect = false;
            }
        });
        this.canvas.addEventListener('click', function (ev) {
            //Handle click hotspots
            _this.mouse.click(ev, false, _this.sidebar, _this.screen, _this.sounds, function (e, r) { return _this.click(e, r); });
            _this.mouse.dragSelect = false;
            return false;
        });
        this.canvas.addEventListener('mousedown', function (ev) {
            if (ev.which == 1) {
                _this.mouse.buttonPressed = true;
                _this.mouse.dragX = _this.mouse.gameX;
                _this.mouse.dragY = _this.mouse.gameY;
                ev.preventDefault();
            }
            return false;
        });
        this.canvas.addEventListener('contextmenu', function (ev) {
            _this.mouse.click(ev, true, _this.sidebar, _this.screen, _this.sounds, function (e, r) { return _this.click(e, r); });
            ev.preventDefault();
            return false;
        });
        this.canvas.addEventListener('mouseup', function (ev) {
            if (ev.which == 1) {
                if (_this.mouse.dragSelect) {
                    if (!ev.shiftKey) {
                        _this.clearSelection();
                    }
                    var x1 = Math.min(_this.mouse.gameX, _this.mouse.dragX);
                    var y1 = Math.min(_this.mouse.gameY, _this.mouse.dragY);
                    var x2 = Math.max(_this.mouse.gameX, _this.mouse.dragX);
                    var y2 = Math.max(_this.mouse.gameY, _this.mouse.dragY);
                    for (var i = _this.units.length - 1; i >= 0; i--) {
                        var unit = _this.units[i];
                        if (!unit.selected && unit.team == _this.currentLevel.team && x1 <= unit.x * _this.gridSize && x2 >= unit.x * _this.gridSize
                            && y1 <= unit.y * _this.gridSize && y2 >= unit.y * _this.gridSize) {
                            _this.selectItem(unit, ev.shiftKey);
                        }
                    }
                    ;
                    //this.dragSelect = false;
                }
                _this.mouse.buttonPressed = false;
            }
            return false;
        });
        this.canvas.addEventListener('mouseleave', function (ev) {
            _this.mouse.insideCanvas = false;
        });
        this.canvas.addEventListener('mouseenter', function (ev) {
            _this.mouse.buttonPressed = false;
            _this.mouse.insideCanvas = true;
        });
        this.canvas.addEventListener('keypress', function (ev) {
            _this.keyPressed(ev);
        });
    };
    return Game;
}());
module.exports = Game;


},{"./Buildings":4,"./Fog":6,"./GameScreen":9,"./InfantryFactory":12,"./Levels":13,"./Mouse":14,"./OverlayFactory":16,"./Player":17,"./Sidebar":20,"./Sounds":21,"./Turrets":24,"./Vehicles":26}],8:[function(require,module,exports){
"use strict";
var Rectangle = require("./Rectangle");
var GameObject = /** @class */ (function () {
    function GameObject(type) {
        this.type = type;
    }
    GameObject.prototype.underPoint = function (x, y, gridSize) {
        var xo = this.x * gridSize + this.pixelOffsetX;
        var yo = this.y * gridSize + this.pixelOffsetY;
        var x1 = xo + this.pixelLeft;
        var y1 = yo + this.pixelTop;
        var x2 = x1 + this.pixelWidth;
        var y2 = y1 + this.pixelHeight;
        //
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    };
    GameObject.prototype.drawSelection = function (context, gridSize, screen, sidebar) {
        if (this.selected) {
            context.strokeStyle = 'white';
            //context.strokeWidth = 4;
            var selectBarSize = 5;
            var bounds = this.getSelectionBounds(gridSize, screen);
            // First draw the white bracket
            context.beginPath();
            //alert(x1);
            context.moveTo(bounds.left, bounds.top + selectBarSize);
            context.lineTo(bounds.left, bounds.top);
            context.lineTo(bounds.left + selectBarSize, bounds.top);
            context.moveTo(bounds.right - selectBarSize, bounds.top);
            context.lineTo(bounds.right, bounds.top);
            context.lineTo(bounds.right, bounds.top + selectBarSize);
            context.moveTo(bounds.right, bounds.bottom - selectBarSize);
            context.lineTo(bounds.right, bounds.bottom);
            context.lineTo(bounds.right - selectBarSize, bounds.bottom);
            context.moveTo(bounds.left + selectBarSize, bounds.bottom);
            context.lineTo(bounds.left, bounds.bottom);
            context.lineTo(bounds.left, bounds.bottom - selectBarSize);
            context.stroke();
        }
    };
    GameObject.prototype.getSelectionBounds = function (gridSize, screen) {
        var x = this.x * gridSize + screen.viewportAdjust.x + this.pixelOffsetX;
        var y = this.y * gridSize + screen.viewportAdjust.y + this.pixelOffsetY;
        var x1 = x + this.pixelLeft;
        var y1 = y + this.pixelTop;
        return new Rectangle(x1, y1, this.pixelWidth, this.pixelHeight);
    };
    GameObject.prototype.findAngle = function (object, unit, base) {
        if (unit === void 0) { unit = this; }
        if (base === void 0) { base = 32; }
        var dy = object.y - unit.y;
        var dx = object.x - unit.x;
        if (unit.type == 'turret') {
            dy = dy - 0.5;
            dx = dx - 0.5;
        }
        var angle = base / 2 + Math.round(Math.atan2(dx, dy) * base / (2 * Math.PI));
        if (angle < 0) {
            angle += base;
        }
        if (angle >= base) {
            angle -= base;
        }
        return angle;
    };
    GameObject.prototype.addAngle = function (angle, increment, base) {
        angle = Math.round(angle) + increment;
        if (angle > base - 1) {
            angle -= base;
        }
        if (angle < 0) {
            angle += base;
        }
        return angle;
    };
    GameObject.prototype.angleDiff = function (angle1, angle2, base) {
        angle1 = Math.floor(angle1);
        angle2 = Math.floor(angle2);
        if (angle1 >= base / 2) {
            angle1 = angle1 - base;
        }
        if (angle2 >= base / 2) {
            angle2 = angle2 - base;
        }
        var diff = angle2 - angle1;
        if (diff < -base / 2) {
            diff += base;
        }
        if (diff > base / 2) {
            diff -= base;
        }
        return diff;
    };
    return GameObject;
}());
module.exports = GameObject;

},{"./Rectangle":19}],9:[function(require,module,exports){
"use strict";
var Point = require("./Point");
var Rectangle = require("./Rectangle");
var GameScreen = /** @class */ (function () {
    function GameScreen(width, height) {
        this.mapImageSize = {
            width: 0, height: 0
        };
        this.width = width;
        this.height = height;
        this.viewport = new Rectangle(0, 0, 0, 0);
        this.viewportOffset = new Point(0, 0);
        this.viewportDelta = new Point(0, 0);
        this.viewportAdjust = new Point(0, 0);
    }
    return GameScreen;
}());
module.exports = GameScreen;

},{"./Point":18,"./Rectangle":19}],10:[function(require,module,exports){
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

},{"./Vehicle":25}],11:[function(require,module,exports){
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


},{"./DestructibleObject":5}],12:[function(require,module,exports){
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


},{"./Infantry":11,"./VisualObject":27}],13:[function(require,module,exports){
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
var Levels = /** @class */ (function (_super) {
    __extends(Levels, _super);
    function Levels() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.levelDetails = {
            "gdi1": {
                mapUrl: 'maps/gdi/map01.jpeg', // The background map to load
                startingCash: 3000,
                startingEnemyCash: 3000,
                terrain: [
                    { x1: 0, y1: 27, x2: 30, y2: 30, type: 'water' },
                    { x1: 0, y1: 26, x2: 6, y2: 26, type: 'water' },
                    { x1: 0, y1: 25, x2: 5, y2: 25, type: 'water' },
                    { x1: 0, y1: 24, x2: 4, y2: 24, type: 'water' },
                    //{x1:11,y1:26,x2:11,y2:26,type:'water'},
                    { x1: 29, y1: 17, x2: 30, y2: 22, type: 'mountain' },
                    { x1: 7, y1: 6, x2: 8, y2: 9, type: 'mountain' },
                    { x1: 8, y1: 10, x2: 9, y2: 11, type: 'mountain' },
                    { x1: 9, y1: 11, x2: 10, y2: 15, type: 'mountain' },
                    { x1: 10, y1: 15, x2: 11, y2: 19, type: 'mountain' },
                    { x1: 11, y1: 19, x2: 12, y2: 21, type: 'mountain' },
                    { x1: 12, y1: 21, x2: 14, y2: 23, type: 'mountain' },
                    { x1: 12, y1: 24, x2: 13, y2: 24, type: 'mountain' },
                    { x1: 14, y1: 21, x2: 17, y2: 22, type: 'mountain' },
                    { x1: 16, y1: 23, x2: 16, y2: 23, type: 'mountain' }
                ], // full size grid, defines water and mountains
                overlay: [
                    { x: 10, y: 10, name: 'tree' },
                    { x: 16, y: 3, name: 'tree' },
                    { x: 14, y: 2, name: 'trees' },
                    { x: 9, y: 2, name: 'trees' },
                    { x: 19, y: 12, name: 'trees' },
                    { x: 15, y: 13, name: 'trees' },
                    { x: 0, y: 1, name: 'trees' },
                    { x: 2, y: 1, name: 'trees' },
                    { x: 4, y: 1, name: 'trees' },
                    { x: 8, y: 1, name: 'tree' },
                    { x: 6, y: 0, name: 'tree' },
                    { x: 7, y: 0, name: 'tree' },
                    //{x:12,y:15,name:'tiberium',stage:11},
                    //{x:13,y:15,name:'tiberium',stage:8},
                    { x: 28, y: 11, name: 'tiberium', stage: 9 },
                    { x: 29, y: 11, name: 'tiberium', stage: 7 },
                    { x: 28, y: 12, name: 'tiberium', stage: 9 },
                    { x: 29, y: 12, name: 'tiberium', stage: 5 },
                    { x: 28, y: 13, name: 'tiberium', stage: 10 },
                    { x: 29, y: 13, name: 'tiberium', stage: 4 },
                    { x: 28, y: 14, name: 'tiberium', stage: 8 },
                    { x: 29, y: 14, name: 'tiberium', stage: 6 },
                    { x: 28, y: 15, name: 'tiberium', stage: 3 },
                    { x: 27, y: 15, name: 'tiberium', stage: 11 },
                    { x: 27, y: 14, name: 'tiberium', stage: 1 },
                    { x: 27, y: 13, name: 'tiberium', stage: 5 },
                    { x: 13, y: 16, name: 'tiberium', stage: 1 },
                    { x: 14, y: 16, name: 'tiberium', stage: 5 },
                    { x: 15, y: 17, name: 'tiberium', stage: 8 },
                    { x: 14, y: 17, name: 'tiberium', stage: 3 },
                    { x: 16, y: 17, name: 'tiberium', stage: 6 }
                    // {x1:8,y1:8,x2:10,y2:10,type:'tree-1'},
                    //{x1:8,y1:8,x2:10,y2:10,type:'tiberium-1'}
                ], //the trees and tiberium .. can terrain and overlay be in the same?
                gridWidth: 31,
                gridHeight: 31,
                team: 'gdi',
                enemyTeam: 'nod',
                briefing: 'This is a warning \n for all of you \n Kill enemy troops and have some fun',
                items: {
                    infantry: [], // ['minigunner'],
                    buildings: ['construction-yard', 'power-plant', 'refinery', 'weapons-factory', 'advanced-power-plant', 'tiberium-silo', 'hand-of-nod'],
                    vehicles: ['mcv', 'light-tank', 'harvester'],
                    ships: ['bigboat'],
                    turrets: ['gun-turret']
                },
                scriptedEvents: [
                    {
                        id: 'trigger1', description: 'Initial four reinforcement troops land on beach',
                        actions: [
                            { action: 'wait', tigger: 'time', time: 100 }, //time in milliseconds
                            { action: "sound", sound: 'reinforcements_have_arrived' },
                            {
                                action: 'addUnit',
                                unit: {
                                    name: 'hovercraft', type: 'vehicle', unselectable: true, id: 'hovercraft1',
                                    x: 30, y: 30, direction: 'up', carrying: [{ name: 'gunner' }]
                                }
                            },
                            { action: 'move', id: 'hovercraft1', x: 30, y: 27 },
                            { action: 'unload', id: 'hovercraft1', x: 30, y: 28 },
                            { action: 'move', id: 'hovercraft1', x: 30, y: 30 },
                            { action: 'removeUnit', id: 'hovercraft1' }
                        ]
                    },
                    {
                        id: 'trigger2', description: 'Blow up enemy powerplant when the time comes',
                        actions: [
                            { action: 'wait', trigger: 'condition', condition: function () { return true; } },
                            { action: 'sound', sound: 'low_power' },
                            { action: 'destroyBuilding', id: 'powerplant1' }
                        ]
                    },
                    {
                        id: 'wintrigger',
                        actions: [
                            { action: 'wait', trigger: 'condition', condition: function () { return false; } },
                            { action: 'endLevel', type: 'success' }
                        ]
                    }
                ]
            }
        };
        _this.loaded = true;
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    Levels.prototype.load = function (id, buildings, turrets, vehicles, infantry, overlay, gridSize) {
        var level;
        //level.mapImage = new Image();
        var details = this.levelDetails[id];
        for (var item in details.items) {
            if (item == "vehicles") {
                for (var i = details.items[item].length - 1; i >= 0; i--) {
                    vehicles.load(this.levelDetails[id].items[item][i]);
                }
                ;
            }
            if (item == "buildings") {
                for (var i = details.items[item].length - 1; i >= 0; i--) {
                    buildings.load(details.items[item][i], gridSize);
                }
                ;
            }
            if (item == "infantry") {
                for (var i = details.items[item].length - 1; i >= 0; i--) {
                    infantry.load(details.items[item][i]);
                }
                ;
            }
            if (item == "turrets") {
                for (var i = details.items[item].length - 1; i >= 0; i--) {
                    turrets.load(details.items[item][i]);
                }
                ;
            }
        }
        var obstructionGrid = new Array();
        var mapGrid = new Array();
        for (var y = 0; y < details.gridHeight; y++) {
            obstructionGrid[y] = new Array();
            mapGrid[y] = new Array();
            for (var x = 0; x < details.gridWidth; x++) {
                obstructionGrid[y][x] = 0;
            }
            ;
        }
        ;
        for (var i = details.terrain.length - 1; i >= 0; i--) {
            var terrain = details.terrain[i];
            for (var x = terrain.x1; x <= terrain.x2; x++) {
                for (var y = terrain.y1; y <= terrain.y2; y++) {
                    obstructionGrid[y][x] = 1;
                    mapGrid[y][x] = terrain.type;
                }
            }
        }
        ;
        var overlayArray = [];
        for (var i = details.overlay.length - 1; i >= 0; i--) {
            overlayArray.push(overlay.add(details.overlay[i]));
        }
        ;
        level = {
            id: id,
            mapImage: this.preloadImage(this.levelDetails[id].mapUrl),
            mapGrid: mapGrid,
            obstructionGrid: obstructionGrid,
            overlay: overlayArray,
            team: details.team,
            enemyTeam: details.enemyTeam,
            startingCash: details.startingCash,
            startingEnemyCash: details.startingEnemyCash,
        };
        return level;
    };
    return Levels;
}(VisualObject));
module.exports = Levels;


},{"./VisualObject":27}],14:[function(require,module,exports){
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
var Cursor = /** @class */ (function () {
    function Cursor() {
    }
    return Cursor;
}());
var Mouse = /** @class */ (function (_super) {
    __extends(Mouse, _super);
    function Mouse() {
        var _this = _super.call(this) || this;
        _this.panningThreshold = 48;
        _this.panningVelocity = 24;
        _this.loaded = false;
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        _this.spriteImage = null;
        _this.cursors = {};
        _this.cursorCount = 0;
        _this.x = 0;
        _this.y = 0;
        _this.cursorLoop = 0;
        return _this;
    }
    Mouse.prototype.handlePanning = function (screen, mapImageSize, sidebar) {
        var panDirection = "";
        if (this.insideCanvas) {
            if (this.y <= screen.viewport.top + this.panningThreshold && this.y >= screen.viewport.top) {
                screen.viewportDelta.y = -this.panningVelocity;
                panDirection += "_top";
            }
            else if (this.y >= screen.viewport.top + screen.viewport.height - this.panningThreshold && this.y <= screen.viewport.top + screen.viewport.height) {
                screen.viewportDelta.y = this.panningVelocity;
                panDirection += "_bottom";
            }
            else {
                screen.viewportDelta.y = 0;
                panDirection += "";
            }
            if (this.x < this.panningThreshold && this.y >= screen.viewport.top && this.y <= screen.viewport.top + screen.viewport.height) {
                screen.viewportDelta.x = -this.panningVelocity;
                panDirection += "_left";
            }
            else if (this.x > screen.width - this.panningThreshold && this.y >= screen.viewport.top && this.y <= screen.viewport.top + screen.viewport.height) {
                screen.viewportDelta.x = this.panningVelocity;
                panDirection += "_right";
            }
            else {
                screen.viewportDelta.x = 0;
                panDirection += "";
            }
        }
        if ((screen.viewportOffset.x + screen.viewportDelta.x < 0)
            || (screen.viewportOffset.x + screen.viewportDelta.x + screen.width + (sidebar.visible ? -sidebar.width : 0) > mapImageSize.width)) {
            screen.viewportDelta.x = 0;
            //console.log (screen.viewportOffset.x+screen.viewportDelta.y +screen.width+(this.sidebar.visible?-this.sidebar.width:0));
            //console.log (this.game.currentLevel.mapImage.width);
        }
        if (!sidebar.visible && (screen.viewportOffset.x + screen.width > mapImageSize.width)) {
            screen.viewportOffset.x = mapImageSize.width - screen.width;
            screen.viewportDelta.x = 0;
        }
        if ((screen.viewportOffset.y + screen.viewportDelta.y < 0)
            || (screen.viewportOffset.y + screen.viewportDelta.y + screen.viewport.height > mapImageSize.height)) {
            screen.viewportDelta.y = 0;
        }
        if (panDirection != "") {
            if (screen.viewportDelta.x == 0 && screen.viewportDelta.y == 0) {
                panDirection = "no_pan" + panDirection;
            }
            else {
                panDirection = "pan" + panDirection;
            }
        }
        this.panDirection = panDirection;
        screen.viewportOffset.x += screen.viewportDelta.x;
        screen.viewportOffset.y += screen.viewportDelta.y;
        this.gameX = this.x + screen.viewportOffset.x - screen.viewport.left;
        this.gameY = this.y + screen.viewportOffset.y - screen.viewport.top;
        screen.viewportAdjust.x = screen.viewport.left - screen.viewportOffset.x;
        screen.viewportAdjust.y = screen.viewport.top - screen.viewportOffset.y;
    };
    Mouse.prototype.drawCursor = function (context, screen) {
        if (!this.insideCanvas) {
            return;
        }
        this.cursorLoop++;
        if (this.cursorLoop >= this.cursor.cursorSpeed * this.cursor.count) {
            this.cursorLoop = 0;
        }
        //alert(this.spriteImage)
        // If drag selecting, draw a white selection rectangle
        if (this.dragSelect) {
            var x = Math.min(this.gameX, this.dragX);
            var y = Math.min(this.gameY, this.dragY);
            var width = Math.abs(this.gameX - this.dragX);
            var height = Math.abs(this.gameY - this.dragY);
            context.strokeStyle = 'white';
            context.strokeRect(x + screen.viewportAdjust.x, y + screen.viewportAdjust.y, width, height);
        }
        //var image = this.cursor.images[Math.floor(this.cursorLoop/this.cursor.cursorSpeed)];
        var imageNumber = this.cursor.spriteOffset + Math.floor(this.cursorLoop / this.cursor.cursorSpeed);
        context.drawImage(this.spriteImage, 30 * (imageNumber), 0, 30, 24, this.x - this.cursor.x, this.y - this.cursor.y, 30, 24);
    };
    Mouse.prototype.checkOverObject = function (overlayObjects, buildings, turrets, units, gridSize) {
        var overObject = null;
        for (var i = overlayObjects.length - 1; i >= 0; i--) {
            var overlay = overlayObjects[i];
            if (overlay.name == 'tiberium' && this.gridX == overlay.x && this.gridY == overlay.y) {
                //
                //console.log(overlay.name + ' ' +overlay.x + ' ' +overlay.y + ' '+this.gridX + ' '+this.gridY )
                overObject = overlay;
                //alert('overlay')
            }
        }
        ;
        for (var i = buildings.length - 1; i >= 0; i--) {
            if (buildings[i].underPoint(this.gameX, this.gameY, gridSize)) {
                overObject = buildings[i];
                break;
            }
        }
        ;
        for (var i = turrets.length - 1; i >= 0; i--) {
            if (turrets[i].underPoint(this.gameX, this.gameY, gridSize)) {
                overObject = turrets[i];
                break;
            }
        }
        ;
        for (var i = units.length - 1; i >= 0; i--) {
            if (units[i]['underPoint'] && units[i].underPoint(this.gameX, this.gameY, gridSize)) {
                overObject = units[i];
                break;
            }
        }
        ;
        return overObject;
    };
    Mouse.prototype.draw = function (context, screen, currentLevel, overlayObjects, sidebar, buildingsFactory, buildings, turretsFactory, turrets, vehicles, infantry, units, selectedUnits, selectedAttackers, buildingObstructionGrid, obstructionGrid, gridSize, highlightGrid) {
        this.cursor = this.cursors['default'];
        var selectedObject = this.checkOverObject(overlayObjects, buildings, turrets, units, gridSize);
        if (this.y < screen.viewport.top || this.y > screen.viewport.top + screen.viewport.height) {
            // default cursor if too much to the top
        }
        else if (sidebar.deployMode) {
            var buildingType = buildingsFactory.types[sidebar.deployBuilding] || turretsFactory.types[sidebar.deployBuilding];
            var grid = $.extend([], buildingType.gridShape);
            grid.push(grid[grid.length - 1]);
            //grid.push(grid[1]);
            for (var y = 0; y < grid.length; y++) {
                for (var x = 0; x < grid[y].length; x++) {
                    if (grid[y][x] == 1) {
                        if (this.gridY + y < 0 || this.gridY + y >= buildingObstructionGrid.length || this.gridX + x < 0 || this.gridX + x >= buildingObstructionGrid[this.gridY + y].length || buildingObstructionGrid[this.gridY + y][this.gridX + x] == 1) {
                            //if (this.game.buildingObstructionGrid[this.gridY+y][this.gridX+x] == 1){
                            highlightGrid(this.gridX + x, this.gridY + y, 1, 1, sidebar.placementRedImage);
                        }
                        else {
                            highlightGrid(this.gridX + x, this.gridY + y, 1, 1, sidebar.placementWhiteImage);
                        }
                    }
                }
            }
        }
        else if (sidebar.repairMode) {
            if (selectedObject && selectedObject.team == currentLevel.team
                && (selectedObject.type == 'building' || selectedObject.type == 'turret') && (selectedObject.hitPoints < selectedObject.maxHitPoints)) {
                this.cursor = this.cursors['repair'];
            }
            else {
                this.cursor = this.cursors['no_repair'];
            }
        }
        else if (sidebar.sellMode) {
            if (selectedObject && selectedObject.team == currentLevel.team
                && (selectedObject.type == 'building' || selectedObject.type == 'turret')) {
                this.cursor = this.cursors['sell'];
            }
            else {
                this.cursor = this.cursors['no_sell'];
            }
        }
        else if (sidebar.visible && this.x > sidebar.left) {
            //over a button
            var hovButton = sidebar.hoveredButton(this);
            if (hovButton) {
                var tooltipName = hovButton.type;
                switch (hovButton.type) {
                    case 'infantry':
                        tooltipName = infantry.types[hovButton.name].label;
                        break;
                    case 'building':
                        tooltipName = buildingsFactory.types[hovButton.name].label;
                        break;
                    case 'turret':
                        tooltipName = turretsFactory.types[hovButton.name].label;
                        break;
                    case 'vehicle':
                        tooltipName = vehicles.types[hovButton.name].label;
                        break;
                }
                var tooltipCost = "$" + hovButton.cost;
                //context.fillRect()
                context.fillStyle = 'black';
                context.fillRect(Math.round(this.x), Math.round(this.y + 16), tooltipName.length * 5.5 + 8, 32);
                context.strokeStyle = 'darkgreen';
                context.strokeRect(Math.round(this.x), Math.round(this.y + 16), tooltipName.length * 5.5 + 8, 32);
                context.fillStyle = 'darkgreen';
                context.font = '12px "Command and Conquer"';
                context.fillText(tooltipName, Math.round(this.x + 4), Math.round(this.y + 30));
                context.fillText(tooltipCost, Math.round(this.x + 4), Math.round(this.y + 44));
            }
        }
        else if (this.dragSelect) {
            this.cursor = this.cursors['default'];
        }
        else if (selectedObject && !this.isOverFog) {
            if (selectedObject.team && selectedObject.team != currentLevel.team && selectedAttackers.length > 0) {
                this.cursor = this.cursors['attack'];
            }
            else if (selectedUnits.length == 1 && selectedUnits[0].name == 'harvester'
                && selectedUnits[0].team == currentLevel.team
                && (selectedObject.name == 'tiberium' || selectedObject.name == 'refinery')) {
                //My team's harvester is selected alone
                if (selectedObject.name == 'tiberium') {
                    this.cursor = this.cursors['attack']; // Harvester attacks tiberium 
                }
                if (selectedObject.name == 'refinery' && selectedObject.team == currentLevel.team) {
                    this.cursor = this.cursors['load_vehicle']; // Harvester enters my refinery
                }
            }
            else if (selectedUnits.length == 1 && selectedObject.selected && selectedObject.team == currentLevel.team) {
                if (selectedObject.name == 'mcv') {
                    this.cursor = this.cursors['build_command'];
                }
            }
            else if (!selectedObject.selected && selectedObject.name != 'tiberium') {
                this.cursor = this.cursors['select'];
            }
            else if (selectedObject.name == 'tiberium') {
                if (obstructionGrid[this.gridY] && obstructionGrid[this.gridY][this.gridX] == 1) {
                    this.cursor = this.cursors['no_move'];
                }
                else {
                    this.cursor = this.cursors['move'];
                }
            }
        }
        else if (this.panDirection && this.panDirection != "") {
            this.cursor = this.cursors[this.panDirection];
        }
        else if (selectedUnits.length > 0) {
            if (obstructionGrid[this.gridY] && obstructionGrid[this.gridY][this.gridX] == 1 && !this.isOverFog) {
                this.cursor = this.cursors['no_move'];
            }
            else {
                this.cursor = this.cursors['move'];
            }
        }
        if (this.insideCanvas) {
            this.drawCursor(context, screen);
        }
    };
    Mouse.prototype.click = function (ev, rightClick, sidebar, screen, soundsManager, onClick) {
        if (this.y <= screen.viewport.top && this.y > screen.viewport.top - 15) {
            // Tab Area Clicked    
            if (this.x >= 0 && this.x < 160) {
                // Options button clicked
                //alert ('No Options yet.');
            }
            else if (this.x >= 320 && this.x < 480) {
                // Score button clicked
                //alert ('Score button clicked');
            }
            else if (this.x >= 480 && this.x < 640) {
                // Sidebar button clicked
                //alert ('Sidebar button clicked');
                sidebar.visible = !sidebar.visible;
            }
        }
        else if (this.y >= screen.viewport.top && this.y <= screen.viewport.top + screen.viewport.height) {
            //Game Area Clicked
            if (sidebar.visible && this.x > sidebar.left) {
                //alert ('sidebar clicked');
                sidebar.click(ev, rightClick, this, soundsManager);
            }
            else {
                onClick(ev, rightClick);
                //alert('game area clicked');
            }
        }
    };
    Mouse.prototype.loadCursor = function (name, x, y, imageCount, cursorSpeed) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (imageCount === void 0) { imageCount = 1; }
        if (cursorSpeed === void 0) { cursorSpeed = 1; }
        this.cursors[name] = { x: x, y: y, name: name, count: imageCount, spriteOffset: this.cursorCount, cursorSpeed: cursorSpeed };
        this.cursorCount += imageCount;
    };
    ;
    Mouse.prototype.loadAllCursors = function () {
        this.spriteImage = this.preloadImage('cursors.png');
        this.loadCursor('attack', 15, 12, 8);
        this.loadCursor('big_detonate', 15, 12, 3);
        this.loadCursor('build_command', 15, 12, 9);
        this.loadCursor('default');
        this.loadCursor('detonate', 15, 12, 3);
        this.loadCursor('load_vehicle', 15, 12, 3, 2);
        this.loadCursor('unknown');
        this.loadCursor('unknown');
        this.loadCursor('move', 15, 12);
        this.loadCursor('no_default');
        this.loadCursor('no_move', 15, 12);
        this.loadCursor('no_pan_bottom', 15, 24);
        this.loadCursor('no_pan_bottom_left', 0, 24);
        this.loadCursor('no_pan_bottom_right', 30, 24);
        this.loadCursor('no_pan_left', 0, 12);
        this.loadCursor('no_pan_right', 30, 12);
        this.loadCursor('no_pan_top', 15, 0);
        this.loadCursor('no_pan_top_left', 0, 0);
        this.loadCursor('no_pan_top_right', 30, 0);
        this.loadCursor('no_repair', 15, 0);
        this.loadCursor('no_sell', 15, 12);
        this.loadCursor('pan_bottom', 15, 24);
        this.loadCursor('pan_bottom_left', 0, 24);
        this.loadCursor('pan_bottom_right', 30, 24);
        this.loadCursor('pan_left', 0, 12);
        this.loadCursor('pan_right', 30, 12);
        this.loadCursor('pan_top', 15, 0);
        this.loadCursor('pan_top_left', 0, 0);
        this.loadCursor('pan_top_right', 30, 0);
        this.loadCursor('repair', 15, 0, 24);
        this.loadCursor('select', 15, 12, 6, 2);
        this.loadCursor('sell', 15, 12, 24);
    };
    return Mouse;
}(VisualObject));
module.exports = Mouse;


},{"./VisualObject":27}],15:[function(require,module,exports){
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
var Overlay = /** @class */ (function (_super) {
    __extends(Overlay, _super);
    function Overlay(name) {
        var _this = _super.call(this, 'overlay') || this;
        _this.name = name;
        return _this;
    }
    Overlay.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy, debugMode) {
        // Finally draw the top part with appropriate animation
        var imageWidth = this.pixelWidth;
        var imageHeight = this.pixelHeight;
        var x = Math.round((this.x + this.gridOffsetX) * gridSize + screen.viewportAdjust.x);
        var y = Math.round((this.y + this.gridOffsetY) * gridSize + screen.viewportAdjust.y);
        var imageList = this.spriteArray[this.type];
        var imageIndex = this.stage;
        context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, 0, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
        return;
    };
    return Overlay;
}(GameObject));
module.exports = Overlay;

},{"./GameObject":8}],16:[function(require,module,exports){
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
var Overlay = require("./Overlay");
var OverlayFactory = /** @class */ (function (_super) {
    __extends(OverlayFactory, _super);
    function OverlayFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = [];
        _this.overlayDetails = {
            'tiberium': {
                name: 'tiberium',
                count: 2,
                pixelWidth: 24,
                pixelHeight: 24,
                stageCount: 12,
                gridOffsetX: 0,
                gridOffsetY: 0,
                imagesToLoad: [
                    { name: '0', count: 12 },
                    { name: '1', count: 12 }
                ]
            },
            'tree': {
                name: 'tree',
                count: 1,
                stageCount: 10,
                pixelWidth: 48,
                pixelHeight: 48,
                gridOffsetX: 0,
                gridOffsetY: -1,
                imagesToLoad: [
                    { name: '0', count: 10 },
                    { name: '1', count: 10 },
                    { name: '2', count: 10 }
                ]
            },
            'trees': {
                name: 'trees',
                count: 1,
                stageCount: 10,
                gridOffsetX: 0,
                gridOffsetY: -1,
                pixelWidth: 72,
                pixelHeight: 48,
                imagesToLoad: [
                    { name: '0', count: 10 }
                ]
            }
        };
        _this.loaded = true;
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        return _this;
    }
    OverlayFactory.prototype.load = function (name) {
        var overlay = new Overlay(name);
        var details = this.overlayDetails[name];
        this.loadSpriteSheet(overlay, details, 'tiles/temperate');
        /*
        var imageArray = [];
        for(i=0;i<details.count;i++){
            imageArray[i] = this.loadImageArray('tiles/temperate/'+name+'/'+name+'-'+i,details.stageCount,'.gif');
        }
        overlayType.imageArray = imageArray;
        */
        $.extend(overlay, details);
        this.types[name] = overlay;
    };
    OverlayFactory.prototype.loadAll = function () {
        this.load('tiberium');
        this.load('tree');
        this.load('trees');
    };
    OverlayFactory.prototype.add = function (details) {
        var name = details.name;
        var newOverlay = new Overlay(name);
        newOverlay.stage = 0;
        $.extend(newOverlay, this.types[name]);
        $.extend(newOverlay, details);
        newOverlay.type = '0';
        return newOverlay;
    };
    return OverlayFactory;
}(VisualObject));
module.exports = OverlayFactory;

},{"./Overlay":15,"./VisualObject":27}],17:[function(require,module,exports){
"use strict";
var Player = /** @class */ (function () {
    function Player(team, startingCash) {
        this.team = team;
        this.cash = startingCash;
    }
    return Player;
}());
module.exports = Player;

},{}],18:[function(require,module,exports){
"use strict";
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
module.exports = Point;

},{}],19:[function(require,module,exports){
"use strict";
var Rectangle = /** @class */ (function () {
    function Rectangle(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () {
            return this.left + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () {
            return this.top + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Rectangle.prototype.intersect = function (other) {
        var x = Math.max(this.left, other.left), num1 = Math.min(this.left + this.width, other.left + other.width), y = Math.max(this.top, other.top), num2 = Math.min(this.top + this.height, other.top + other.height);
        if (num1 >= x && num2 >= y)
            return new Rectangle(x, y, num1 - x, num2 - y);
        else
            return Rectangle.empty;
    };
    Object.defineProperty(Rectangle, "empty", {
        get: function () {
            return this._empty;
        },
        enumerable: false,
        configurable: true
    });
    Rectangle._empty = new Rectangle(0, 0, 0, 0);
    return Rectangle;
}());
module.exports = Rectangle;

},{}],20:[function(require,module,exports){
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
var Sidebar = /** @class */ (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loaded = true;
        _this.preloadCount = 0;
        _this.loadedCount = 0;
        _this.repairImageBig = null;
        _this.primaryBuildingImage = null;
        _this.tabsImage = null;
        _this.width = 160;
        _this.left = 0;
        _this.top = 0;
        _this.visible = true;
        _this.cash = 0;
        _this.deployMode = false;
        _this.repairMode = false;
        _this.sellMode = false;
        _this.messageBox = null;
        _this.allButtons = [];
        _this.leftButtons = [];
        _this.rightButtons = [];
        _this.textBrightness = 0;
        _this.textBrightnessDelta = -0.1;
        _this.iconWidth = 64;
        _this.iconHeight = 48;
        _this.leftButtonOffset = 0;
        _this.rightButtonOffset = 0;
        _this.buildSpeedMultiplier = 300;
        _this.powerOut = 0;
        _this.powerIn = 0;
        _this.lowPowerMode = false;
        _this.powerScale = 4;
        return _this;
    }
    Sidebar.prototype.finishDeployingBuilding = function (buildings, buildingsFactory, turrets, turretsFactory, soundsManager, mouse, curPlayerTeam) {
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].name == 'construction-yard' && buildings[i].team == curPlayerTeam) {
                buildings[i].status = 'construct';
                break;
            }
        }
        ;
        if (buildingsFactory.types[this.deployBuilding]) {
            buildings.push(buildingsFactory.add({ name: this.deployBuilding, x: mouse.gridX, y: mouse.gridY, status: 'build', team: curPlayerTeam }));
        }
        else {
            turrets.push(turretsFactory.add({ name: this.deployBuilding, x: mouse.gridX, y: mouse.gridY, team: curPlayerTeam, status: 'build' }));
        }
        soundsManager.play('construction');
        this.deployMode = false;
        for (var i = this.leftButtons.length - 1; i >= 0; i--) {
            this.leftButtons[i].status = '';
        }
        this.deployBuilding = null;
    };
    Sidebar.prototype.finishDeployingUnit = function (unitButton, buildings, units, infantryFactory, vehiclesFactory, curPlayerTeam) {
        var constructedAt;
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].name == unitButton.dependency[0]) {
                constructedAt = buildings[i];
                //game.buildings[i].status='construct';
                break;
            }
        }
        ;
        if (unitButton.type == 'infantry') {
            units.push(infantryFactory.add({
                name: unitButton.name,
                team: curPlayerTeam,
                x: constructedAt.x + constructedAt.gridWidth / 2,
                y: constructedAt.y + constructedAt.gridHeight,
                moveDirection: 4,
                instructions: [{ type: 'move', distance: 2 }],
            }));
        }
        else if (unitButton.type == 'vehicle') {
            constructedAt.status = 'construct';
            var vehicle = vehiclesFactory.add({
                name: unitButton.name,
                team: curPlayerTeam,
                x: constructedAt.x + 1,
                y: constructedAt.y + 3,
                moveDirection: 16,
                turretDirection: 16,
                orders: {
                    type: 'move', to: {
                        x: Math.floor(constructedAt.x - 1 + (Math.random() * 4)),
                        //    orders:{type:'move',to:{x:Math.floor(constructedAt.x-1),
                        y: Math.floor(constructedAt.y + 5)
                    }
                }
            });
            units.push(vehicle);
            //alert(vehicle.orders.to.x + ' '+vehicle.orders.to.y)
        }
        //game.buildings.push(buildings.add({name:this.deployBuilding,x:mouse.gridX,y:mouse.gridY,status:'build'}));
        //sounds.play('construction')
        //this.deployMode = false;
        for (var i = this.rightButtons.length - 1; i >= 0; i--) {
            if (this.rightButtons[i].dependency[0] == unitButton.dependency[0]) {
                this.rightButtons[i].status = '';
            }
        }
        this.deployBuilding = null;
    };
    Sidebar.prototype.hoveredButton = function (mouse) {
        var clickY = mouse.y - this.top;
        var clickX = mouse.x;
        if (clickY >= 165 && clickY <= 455) {
            var buttonPosition = 0;
            for (var i = 0; i < 6; i++) {
                if (clickY >= 165 + i * 48 && clickY <= 165 + i * 48 + 48) {
                    buttonPosition = i;
                    break;
                }
            }
            var buttonSide, buttonPressedIndex, buttons;
            if (clickX >= 500 && clickX <= 564) {
                buttonSide = 'left';
                buttonPressedIndex = this.leftButtonOffset + buttonPosition;
                buttons = this.leftButtons;
            }
            else if (clickX >= 570 && clickX <= 634) {
                buttonSide = 'right';
                buttonPressedIndex = this.rightButtonOffset + buttonPosition;
                buttons = this.rightButtons;
            }
            if (buttons && buttons.length > buttonPressedIndex) {
                var buttonPressed = buttons[buttonPressedIndex];
                return buttonPressed;
            }
        }
    };
    Sidebar.prototype.click = function (ev, rightClick, mouse, soundsManager) {
        var clickY = mouse.y - this.top;
        var clickX = mouse.x;
        //alert(2)
        // press a top button
        if (clickY >= 146 && clickY <= 160) {
            if (clickX >= 485 && clickX <= 530) {
                this.repairMode = !this.repairMode;
                this.sellMode = this.mapMode = this.deployMode = false;
                //alert('repair')
            }
            else if (clickX >= 538 && clickX <= 582) {
                this.sellMode = !this.sellMode;
                this.repairMode = this.mapMode = this.deployMode = false;
                //alert('map')
            }
            else if (clickX >= 590 && clickX <= 635) {
                this.mapMode = !this.mapMode;
                this.repairMode = this.sellMode = this.deployMode = false;
            }
            // press a scroll button
        }
        else if (clickY >= 455 && clickY <= 480) {
            if (clickX >= 500 && clickX <= 530) {
                if (this.leftButtonOffset > 0) {
                    this.leftButtonOffset--;
                    soundsManager.play('button');
                }
            }
            else if (clickX >= 532 && clickX <= 562) {
                if (this.leftButtonOffset + 6 < this.leftButtons.length) {
                    this.leftButtonOffset++;
                    soundsManager.play('button');
                }
            }
            else if (clickX >= 570 && clickX <= 600) {
                if (this.rightButtonOffset > 0) {
                    this.rightButtonOffset--;
                    soundsManager.play('button');
                }
            }
            else if (clickX >= 602 && clickX <= 632) {
                if (this.rightButtonOffset + 6 < this.rightButtons.length) {
                    this.rightButtonOffset++;
                    soundsManager.play('button');
                }
            }
            // Press a unit icon
        }
        else if (clickY >= 165 && clickY <= 455) {
            var buttonPosition = 0;
            for (var i = 0; i < 6; i++) {
                if (clickY >= 165 + i * 48 && clickY <= 165 + i * 48 + 48) {
                    buttonPosition = i;
                    break;
                }
            }
            var buttonSide, buttonPressedIndex, buttons;
            if (clickX >= 500 && clickX <= 564) {
                buttonSide = 'left';
                buttonPressedIndex = this.leftButtonOffset + buttonPosition;
                buttons = this.leftButtons;
            }
            else if (clickX >= 570 && clickX <= 634) {
                buttonSide = 'right';
                buttonPressedIndex = this.rightButtonOffset + buttonPosition;
                buttons = this.rightButtons;
            }
            if (buttons && buttons.length > buttonPressedIndex) {
                var buttonPressed = buttons[buttonPressedIndex];
                if (buttonPressed.status == '' && !rightClick) {
                    //this.buildList.push ({side:'left',counter:0,name:this.leftButtons[buttonPressed].name,buttonPressed:buttonPressed});        
                    // Disable all other buttons with same dependency
                    // if(buttonPressed.cost <= this.cash) {
                    for (var i = buttons.length - 1; i >= 0; i--) {
                        if (buttons[i].dependency[0] == buttonPressed.dependency[0]) {
                            buttons[i].status = 'disabled';
                        }
                    }
                    ;
                    buttonPressed.status = 'building';
                    buttonPressed.counter = 0;
                    buttonPressed.spent = buttonPressed.cost;
                    soundsManager.play('building');
                    //} else {
                    //    sounds.play('insufficient_funds');
                    //}
                }
                else if (buttonPressed.status == 'building' && !rightClick) {
                    soundsManager.play('not_ready');
                }
                else if (buttonPressed.status == 'building' && rightClick) {
                    buttonPressed.status = 'hold';
                    soundsManager.play('on_hold');
                }
                else if (buttonPressed.status == 'hold' && !rightClick) {
                    buttonPressed.status = 'building';
                    soundsManager.play('building');
                }
                else if ((buttonPressed.status == 'hold' || buttonPressed.status == 'ready') && rightClick) {
                    buttonPressed.status = '';
                    soundsManager.play('cancelled');
                    this.cash += buttonPressed.cost - buttonPressed.spent;
                    for (var i = buttons.length - 1; i >= 0; i--) {
                        buttons[i].status = '';
                    }
                    ;
                }
                else if (buttonPressed.status == 'ready' && !rightClick) {
                    if (buttonPressed.type == 'building') {
                        this.deployMode = true;
                        //alert('deploy')
                        this.repairMode = this.sellMode = this.mapMode = false;
                        this.deployBuilding = buttonPressed.name;
                    }
                }
                else if (buttonPressed.status == 'disabled') {
                    soundsManager.play('building_in_progress');
                }
            }
        }
    };
    Sidebar.prototype.checkDependency = function (buildings, soundsManager, curPlayerTeam) {
        //alert(this.allButtons.length);
        for (var i = 0; i < this.allButtons.length; i++) {
            var button = this.allButtons[i];
            var dependenciesSatisfied = true;
            //alert(button.dependency.length);
            for (var j = button.dependency.length - 1; j >= 0; j--) {
                var found = false;
                var dependency = button.dependency[j];
                for (var k = buildings.length - 1; k >= 0; k--) {
                    var building = buildings[k];
                    if (building.name == dependency
                        && building.status != 'build'
                        && building.life != 'ultra-damaged'
                        && building.team == curPlayerTeam) {
                        found = true;
                        //alert(building.name)
                        break;
                    }
                }
                ;
                if (!found) {
                    dependenciesSatisfied = false;
                    break;
                }
            }
            ;
            if (button.type == 'building') {
                //check left side
                var buttonFound = false;
                var foundIndex;
                for (var j = this.leftButtons.length - 1; j >= 0; j--) {
                    if (this.leftButtons[j].name == button.name) {
                        buttonFound = true;
                        foundIndex = j;
                        break;
                    }
                    else {
                        //alert(button.name + ",lb="+this.leftButtons[j].name)
                    }
                }
                ;
                //alert(dependenciesSatisfied +" " + buttonFound + '  '+button.name + ' at index' + foundIndex)
                if (dependenciesSatisfied && !buttonFound) {
                    this.leftButtons.push(button);
                    button.status = '';
                    button.counter = 0;
                    //button.cost = buildings.types[button.name].cost;
                    button.speed = this.buildSpeedMultiplier / button.cost;
                    soundsManager.play('new_construction_options');
                    this.visible = true;
                }
                else if (buttonFound && !dependenciesSatisfied) {
                    if (this.leftButtons[foundIndex].status == 'building'
                        || this.leftButtons[foundIndex].status == 'hold'
                        || this.leftButtons[foundIndex].status == 'ready') {
                        for (var j = this.leftButtons.length - 1; j >= 0; j--) {
                            this.leftButtons[j].status = '';
                        }
                    }
                    this.leftButtons.splice(foundIndex, 1);
                    this.leftButtonOffset = 0;
                }
            }
            else if (button.type == 'infantry' || button.type == 'vehicle') {
                //check right side buttons
                var buttonFound = false;
                var foundIndex;
                for (var j = this.rightButtons.length - 1; j >= 0; j--) {
                    if (this.rightButtons[j].name == button.name) {
                        buttonFound = true;
                        foundIndex = j;
                        break;
                    }
                }
                ;
                if (dependenciesSatisfied && !buttonFound) {
                    this.rightButtons.push(button);
                    button.status = '';
                    button.counter = 0;
                    /*switch (button.type){
                        case 'infantry':
                            button.cost = 100;//infantry.types[button.name].cost;
                            break;
                        default:
                            button.cost = 0;
                            break;
                    }
                    */
                    button.speed = this.buildSpeedMultiplier / button.cost;
                    soundsManager.play('new_construction_options');
                }
                else if (buttonFound && !dependenciesSatisfied) {
                    if (this.rightButtons[foundIndex].status == 'building'
                        || this.rightButtons[foundIndex].status == 'hold'
                        || this.rightButtons[foundIndex].status == 'ready') {
                        for (var j = this.rightButtons.length - 1; j >= 0; j--) {
                            if (this.rightButtons[j].dependency[0] == this.rightButtons[foundIndex].dependency[0])
                                this.rightButtons[j].status = '';
                        }
                    }
                    this.rightButtons.splice(foundIndex, 1);
                    this.rightButtonOffset = 0;
                }
            }
        }
        ;
    };
    Sidebar.prototype.load = function (startingCash, screen, canvasWidth) {
        this.cash = startingCash;
        this.tabsImage = this.preloadImage('sidebar/tabs.png');
        this.sidebarImage = this.preloadImage('sidebar/sidebar.png');
        this.primaryBuildingImage = this.preloadImage('sidebar/primary.png');
        this.readyImage = this.preloadImage('sidebar/ready.png');
        this.holdImage = this.preloadImage('sidebar/hold.png');
        this.placementWhiteImage = this.preloadImage('sidebar/placement-white.gif');
        this.placementRedImage = this.preloadImage('sidebar/placement-red.gif');
        this.powerIndicator = this.preloadImage('sidebar/power/power_indicator2.png');
        this.messageBox = this.preloadImage('sidebar/message_box.jpg');
        this.repairButtonPressed = this.preloadImage('sidebar/buttons/repair-pressed.png');
        this.sellButtonPressed = this.preloadImage('sidebar/buttons/sell-pressed.png');
        this.repairImageBig = this.preloadImage('sidebar/repair-big.png');
        this.repairImageSmall = this.preloadImage('sidebar/repair-small.png');
        this.top = screen.viewport.top - 2;
        this.left = canvasWidth - this.width;
        var buttonList = [
            { name: 'power-plant', type: 'building', cost: 300, dependency: ['construction-yard'] },
            { name: 'advanced-power-plant', type: 'building', cost: 700, dependency: ['construction-yard', 'power-plant'] },
            //{name:'barracks',type:'building',cost:300,dependency:['construction-yard','power-plant']},
            //{name:'guard-tower',type:'building',cost:500,dependency: ['construction-yard','barracks']},
            { name: 'refinery', type: 'building', cost: 2000, dependency: ['construction-yard', 'power-plant'] },
            { name: 'tiberium-silo', type: 'building', cost: 150, dependency: ['construction-yard', 'refinery'] },
            { name: 'weapons-factory', type: 'building', cost: 2000, dependency: ['construction-yard', 'power-plant', 'refinery'] },
            //{name:'minigunner',type:'infantry',cost:100,dependency:['barracks']},
            { name: 'harvester', type: 'vehicle', cost: 1400, dependency: ['weapons-factory', 'refinery'] },
            //{name:'jeep',type:'vehicle',cost:400,dependency:['weapons-factory']},
            { name: 'light-tank', type: 'vehicle', cost: 600, dependency: ['weapons-factory'] }
        ];
        this.allButtons = [];
        for (var i = 0; i < buttonList.length; i++) {
            var button = buttonList[i];
            this.allButtons.push({
                name: button.name,
                image: this.preloadImage('sidebar/icons/' + button.name + '-icon.png'),
                type: button.type,
                status: '',
                cost: button.cost,
                dependency: button.dependency
            });
        }
    };
    Sidebar.prototype.drawButtonLabel = function (labelImage, x, y, context) {
        var labelOffsetX = this.iconWidth / 2 - labelImage.width / 2;
        var labelOffsetY = this.iconHeight / 2;
        //context.fillStyle = 'rgba(255,255,255,'+this.textBrightness+')';
        //context.fillText(label,x+ labelOffsetX,y+labelOffsetY);
        //asdf
        context.globalAlpha = this.textBrightness;
        context.drawImage(labelImage, x + labelOffsetX, y + labelOffsetY);
        context.globalAlpha = 1;
    };
    Sidebar.prototype.drawButtonCost = function (cost, x, y, context) {
        var costOffsetX = 35;
        var costOffsetY = 10;
        context.fillStyle = 'white';
        context.fillText(" " + cost, x + costOffsetX, y + costOffsetY);
        //alert(cost+","+(x+costOffsetX)+","+(y+costOffsetY));
    };
    Sidebar.prototype.drawButton = function (side, index, context, spriteContext, spriteCanvas) {
        var buttons = (side == 'left') ? this.leftButtons : this.rightButtons;
        var offset = (side == 'left') ? this.leftButtonOffset : this.rightButtonOffset;
        var button = buttons[index + offset];
        var xOffset = (side == 'left') ? 500 : 570;
        var yOffset = 165 + this.top + index * this.iconHeight;
        context.drawImage(button.image, xOffset, yOffset);
        if (button.status == 'ready') {
            this.drawButtonLabel(this.readyImage, xOffset, yOffset, context);
        }
        else if (button.status == 'disabled') {
            context.fillStyle = 'rgba(200,200,200,0.6)';
            context.fillRect(xOffset, yOffset, this.iconWidth, this.iconHeight);
        }
        else if (button.status == 'building') {
            spriteContext.clearRect(0, 0, this.iconWidth, this.iconHeight);
            spriteContext.fillStyle = 'rgba(200,200,200,0.6)';
            spriteContext.beginPath();
            spriteContext.moveTo(this.iconWidth / 2, this.iconHeight / 2);
            spriteContext.arc(this.iconWidth / 2, this.iconHeight / 2, 40, Math.PI * 2 * button.counter / 100 - Math.PI / 2, -Math.PI / 2);
            spriteContext.moveTo(this.iconWidth / 2, this.iconHeight / 2);
            spriteContext.fill();
            context.drawImage(spriteCanvas, 0, 0, this.iconWidth, this.iconHeight, xOffset, yOffset, this.iconWidth, this.iconHeight);
            //alert(button.speed) 
        }
        else if (button.status == 'hold') {
            spriteContext.clearRect(0, 0, this.iconWidth, this.iconHeight);
            spriteContext.fillStyle = 'rgba(100,100,100,0.6)';
            spriteContext.beginPath();
            spriteContext.moveTo(this.iconWidth / 2, this.iconHeight / 2);
            spriteContext.arc(this.iconWidth / 2, this.iconHeight / 2, 40, Math.PI * 2 * button.counter / 100 - Math.PI / 2, -Math.PI / 2);
            spriteContext.moveTo(this.iconWidth / 2, this.iconHeight / 2);
            spriteContext.fill();
            context.drawImage(spriteCanvas, 0, 0, this.iconWidth, this.iconHeight, xOffset, yOffset, this.iconWidth, this.iconHeight);
            this.drawButtonLabel(this.holdImage, xOffset, yOffset, context);
        }
    };
    Sidebar.prototype.processButton = function (side, index, soundsManager, buildings, units, infantryFactory, vehiclesFactory, curPlayerTeam) {
        var buttons = (side == 'left') ? this.leftButtons : this.rightButtons;
        var offset = 0; // (side=='left')?this.leftButtonOffset:this.rightButtonOffset;
        var button = buttons[index + offset];
        var xOffset = (side == 'left') ? 500 : 570;
        var yOffset = 165 + this.top + index * this.iconHeight;
        if (button.status == 'building') {
            if (this.cash == 0) {
                if (!this.insufficientFunds) {
                    soundsManager.play('insufficient_funds');
                    this.insufficientFunds = true;
                }
                return;
            }
            this.insufficientFunds = false;
            if (this.cash < Math.round(button.cost * button.speed / 100)) {
                button.counter += button.speed * this.cash / Math.round(button.cost * button.speed / 100);
                button.spent -= this.cash;
                this.cash = 0;
                return;
            }
            button.counter += button.speed;
            button.spent -= Math.round(button.cost * button.speed / 100);
            this.cash -= Math.round(button.cost * button.speed / 100);
            if (button.counter > 99) {
                this.cash -= button.spent;
                button.status = 'ready';
                if (side == 'left') {
                    soundsManager.play('construction_complete');
                }
                else {
                    if (button.type == 'infantry' || button.type == 'vehicle') {
                        soundsManager.play('unit_ready');
                        this.finishDeployingUnit(button, buildings, units, infantryFactory, vehiclesFactory, curPlayerTeam);
                    }
                }
            }
        }
    };
    Sidebar.prototype.checkPower = function (buildings, context, soundsManager, curPlayerTeam) {
        var offsetX = this.left;
        var offsetY = this.top + 160;
        var barHeight = 320;
        var barWidth = 20;
        this.powerOut = 0;
        this.powerIn = 0;
        for (var k = buildings.length - 1; k >= 0; k--) {
            var building = buildings[k];
            if (building.powerIn && building.team == curPlayerTeam) {
                this.powerIn += building.powerIn;
            }
            if (building.powerOut && building.team == curPlayerTeam) {
                this.powerOut += building.powerOut;
            }
        }
        ;
        //alert(this.powerGreen);
        var red = 'rgba(174,52,28,0.7)';
        //var red = 'rgba(240,75,35,0.6)';
        var orange = 'rgba(250,100,0,0.6)';
        //var green = 'rgba(48,85,44,0.6)';
        var green = 'rgba(84,252,84,0.3)';
        //context.drawImage(this.powerRed,offsetX,offsetY+barHeight-this.powerOut/this.powerScale);
        if (this.powerOut / this.powerIn >= 1.1) {
            context.fillStyle = green; //'rgba(100,200,0,0.3)';
            this.lowPowerMode = false;
        }
        else if (this.powerOut / this.powerIn >= 1) {
            context.fillStyle = orange;
            this.lowPowerMode = false;
        }
        else if (this.powerOut < this.powerIn) {
            context.fillStyle = red;
            if (this.lowPowerMode == false) {
                soundsManager.play('low_power');
            }
            this.lowPowerMode = true;
        }
        context.fillRect(offsetX + 8, offsetY + barHeight - this.powerOut / this.powerScale, barWidth - 14, this.powerOut / this.powerScale);
        context.drawImage(this.powerIndicator, offsetX, offsetY + barHeight - this.powerIn / this.powerScale);
    };
    Sidebar.prototype.draw = function (units, buildings, infantryFactory, vehiclesFactory, context, soundsManager, spriteContext, spriteCanvas, screen, curPlayerTeam) {
        context.drawImage(this.tabsImage, 0, this.top - this.tabsImage.height + 2);
        context.fillStyle = 'lightgreen';
        context.font = '12px "Command and Conquer"';
        // convert the cash score to a string and space separate to pirnt it proerly
        var c = (this.cash + '').split('').join(' ');
        context.fillText(c, 400 - c.length * 5 / 2, 31);
        this.checkDependency(buildings, soundsManager, curPlayerTeam);
        this.textBrightness = this.textBrightness + this.textBrightnessDelta;
        if (this.textBrightness < 0) {
            this.textBrightness = 1;
        }
        for (var i = 0; i < this.leftButtons.length; i++) {
            this.processButton('left', i, soundsManager, buildings, units, infantryFactory, vehiclesFactory, curPlayerTeam);
        }
        for (var i = 0; i < this.rightButtons.length; i++) {
            this.processButton('right', i, soundsManager, buildings, units, infantryFactory, vehiclesFactory, curPlayerTeam);
        }
        if (this.visible) {
            context.drawImage(this.sidebarImage, this.left, this.top);
            if (this.repairMode) {
                context.drawImage(this.repairButtonPressed, this.left + 4, this.top + 145);
            }
            if (this.sellMode) {
                context.drawImage(this.sellButtonPressed, this.left + 57, this.top + 145);
            }
            this.checkPower(buildings, context, soundsManager, curPlayerTeam);
            var maxLeft = this.leftButtons.length > 6 ? 6 : this.leftButtons.length;
            for (var i = 0; i < maxLeft; i++) {
                this.drawButton('left', i, context, spriteContext, spriteCanvas);
            }
            var maxRight = this.rightButtons.length > 6 ? 6 : this.rightButtons.length;
            for (var i = 0; i < maxRight; i++) {
                this.drawButton('right', i, context, spriteContext, spriteCanvas);
            }
        }
        context.clearRect(0, screen.viewport.top + screen.viewport.height, context.canvas.width, 30);
    };
    return Sidebar;
}(VisualObject));
module.exports = Sidebar;

},{"./VisualObject":27}],21:[function(require,module,exports){
"use strict";
var Sounds = /** @class */ (function () {
    function Sounds() {
        this.sound_list = [];
        this.loaded = true;
    }
    Sounds.prototype.load = function (name, path) {
        var sound = new Audio('audio/' + path + '/' + name + '.ogg');
        sound.load();
        //alert(sound.src);
        return sound;
    };
    Sounds.prototype.play = function (name) {
        var options = this.sound_list[name];
        //alert(name)
        if (options.length == 1) {
            options[0].play();
        }
        else {
            var i = Math.floor(options.length * Math.random());
            //alert(i +" " +options.length);
            options[i].play();
        }
    };
    Sounds.prototype.loadAll = function () {
        this.sound_list['building_in_progress'] = [this.load('building_in_progress', 'voice')];
        this.sound_list['insufficient_funds'] = [this.load('insufficient_funds', 'voice')];
        this.sound_list['building'] = [this.load('building', 'voice')];
        this.sound_list['on_hold'] = [this.load('on_hold', 'voice')];
        this.sound_list['cancelled'] = [this.load('cancelled', 'voice')];
        this.sound_list['cannot_deploy_here'] = [this.load('cannot_deploy_here', 'voice')];
        this.sound_list['new_construction_options'] = [this.load('new_construction_options', 'voice')];
        this.sound_list['construction_complete'] = [this.load('construction_complete', 'voice')];
        this.sound_list['not_ready'] = [this.load('not_ready', 'voice')];
        //this.sound_list['reinforcements_have_arrived'] = [this.load('reinforcements_have_arrived','voice')];
        this.sound_list['low_power'] = [this.load('low_power', 'voice')];
        this.sound_list['unit_ready'] = [this.load('unit_ready', 'voice')];
        this.sound_list['mission_accomplished'] = [this.load('mission_accomplished', 'voice')];
        this.sound_list['mission_failure'] = [this.load('mission_failure', 'voice')];
        this.sound_list['construction'] = [this.load('construction', 'sounds')];
        this.sound_list['crumble'] = [this.load('crumble', 'sounds')];
        this.sound_list['sell'] = [this.load('sell', 'sounds')];
        this.sound_list['button'] = [this.load('button', 'sounds')];
        //this.sound_list['clock'] = [this.load('clock','sounds')];
        this.sound_list['machine_gun'] = [this.load('machine_gun-0', 'sounds'), this.load('machine_gun-1', 'sounds')];
        this.sound_list['tank_fire'] = [this.load('tank-fire-0', 'sounds'), this.load('tank-fire-1', 'sounds'), this.load('tank-fire-2', 'sounds'), this.load('tank-fire-3', 'sounds')];
        //this.sound_list['tank_fire'] = [this.load('tank-fire-0','sounds')];
        this.sound_list['vehicle_select'] = [this.load('ready_and_waiting', 'talk'), this.load('vehicle_reporting', 'talk'), this.load('awaiting_orders', 'talk')];
        this.sound_list['vehicle_move'] = [this.load('affirmative', 'talk'), this.load('moving_out', 'talk'), this.load('acknowledged', 'talk'), this.load('over_and_out', 'talk')];
        this.sound_list['infantry_select'] = [this.load('reporting', 'talk'), this.load('unit_reporting', 'talk'), this.load('awaiting_orders', 'talk')];
        this.sound_list['infantry_move'] = [this.load('affirmative', 'talk'), this.load('yes_sir', 'talk'), this.load('acknowledged', 'talk'), this.load('right_away', 'talk')];
    };
    return Sounds;
}());
module.exports = Sounds;

},{}],22:[function(require,module,exports){
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

},{"./Building":3}],23:[function(require,module,exports){
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

},{"./Building":3}],24:[function(require,module,exports){
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


},{"./Turret":23,"./VisualObject":27}],25:[function(require,module,exports){
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
var AStar = require("./AStar");
var Vehicle = /** @class */ (function (_super) {
    __extends(Vehicle, _super);
    function Vehicle() {
        var _this = _super.call(this, 'vehicle') || this;
        _this.animationSpeed = 4;
        _this.pixelLeft = 0;
        _this.pixelTop = 0;
        _this.pixelOffsetX = 0;
        _this.pixelOffsetY = 0;
        _this.moveDirection = 0;
        _this.turretDirection = 0;
        _this.status = '';
        return _this;
    }
    Vehicle.prototype.draw = function (context, curPlayerTeam, gridSize, screen, units, vehiclesFactory, sidebar, enemy, debugMode) {
        // Finally draw the top part with appropriate animation
        var imageWidth = this.pixelWidth;
        var imageHeight = this.pixelHeight;
        var x = Math.round(this.x * gridSize + this.pixelOffsetX + screen.viewportAdjust.x);
        var y = Math.round(this.y * gridSize + this.pixelOffsetY + screen.viewportAdjust.y);
        var teamYOffset = 0;
        if (this.team != curPlayerTeam) {
            teamYOffset = this.pixelHeight;
        }
        if (this.status == "") {
            var imageList = this.spriteArray["move"];
            var imageIndex = Math.floor(this.moveDirection);
            context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
        }
        else {
            if (!this.animationIndex) {
                this.animationIndex = 0;
            }
            var imageList = this.spriteArray[this.status];
            if (imageList.count >= Math.floor(this.animationIndex / this.animationSpeed)) {
                var imageIndex = Math.floor(this.animationIndex / this.animationSpeed);
                context.drawImage(this.spriteCanvas, (imageList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
            }
            this.animationIndex++;
        }
        if (this.turretDirection >= 0) {
            var turretList = this.spriteArray['turret'];
            if (turretList) {
                var imageIndex = Math.floor(this.turretDirection);
                context.drawImage(this.spriteCanvas, (turretList.offset + imageIndex) * imageWidth, teamYOffset, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
            }
        }
        this.drawSelection(context, gridSize, screen, sidebar);
        if (debugMode) {
            context.fillStyle = 'white';
            context.fillText(this.orders.type, x, y);
            context.fillText(Math.floor(this.x) + ',' + Math.floor(this.y), x, y + 10);
            this.orders.to && context.fillText(this.orders.to.x + ',' + this.orders.to.y, x, y + 20);
        }
        if (debugMode) {
            context.fillStyle = 'rgba(100,200,100,0.4)';
            context.beginPath();
            context.arc(this.x * gridSize + screen.viewportAdjust.x, this.y * gridSize + screen.viewportAdjust.y, this.softCollisionRadius, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = 'rgba(200,0,0,0.4)';
            context.beginPath();
            context.arc(this.x * gridSize + screen.viewportAdjust.x, this.y * gridSize + screen.viewportAdjust.y, this.collisionRadius, 0, Math.PI * 2);
            context.fill();
        }
    };
    Vehicle.prototype.processOrders = function (speedAdjustmentFactor, units, buildings, turrets, allOverlays, buildingsFactory, fog, sounds, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen) {
        this.colliding = false;
        this.collisionType = '';
        this.collisionDistance = this.softCollisionRadius + 1;
        this.collisionWith = null;
        this.movementSpeed = 0;
        this.instructions = [];
        if (!this.orders) {
            this.orders = { type: 'guard' };
        }
        if (this.orders.type == 'make-way') {
            //alert('Make way for '+this.orders.for)
            //this.orders = {type:'move',to:{x:Math.round(this.orders.for.x+2),y:Math.round(this.orders.for.y+1)}};
            var collDirection = this.findAngle(this.orders.for, this, 32);
            //var dTurn = angleDiff(this.moveDirection,collDirection,32);
            if (Math.abs(collDirection) > 16) {
                this.instructions.push({ type: 'move', distance: 0.25 });
            }
            else {
                this.instructions.push({ type: 'move', distance: -0.25 });
            }
            this.movementSpeed = this.speed;
            this.orders = { type: 'guard' };
        }
        else if (this.orders.type == 'move') {
            //alert(this.processOrders)
            var moveOrder = this.orders;
            this.moveTo(moveOrder.to, false, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
            //alert(this.collisionRadius/game.gridSize)
            var distance = Math.pow(Math.pow(moveOrder.to.y + 0.5 - this.y, 2) + Math.pow(moveOrder.to.x + 0.5 - this.x, 2), 0.5);
            //console.log(distance + ' '+1.5*2*this.softCollisionRadius/game.gridSize)
            var reachedThreshold = this.softCollisionRadius / gridSize < 0.5 ? 0.5 + this.softCollisionRadius / gridSize : this.softCollisionRadius / gridSize;
            if ((distance <= reachedThreshold)
                //(this.path.length <= 1) 
                || (this.colliding && this.collisionType == 'soft' && distance <= reachedThreshold + this.collisionRadius / gridSize)
                || (this.colliding && this.collisionType == 'soft-hard' && distance <= reachedThreshold + 2 * this.collisionRadius / gridSize)
                || (this.colliding && this.collisionType == 'hard' && distance <= reachedThreshold + 3 * this.collisionRadius / gridSize)) {
                this.orders = { type: 'guard' };
                //alert(this.collisionType + ' '+distance)
                /*if (this.name == 'harvester'){
                    if (this.tiberium && this.tiberium >= 10) {
                        this.orders = {type:'harvest-return'};
                    } else {
                        this.orders = {type:'harvest'};
                    }
                    
                }*/
            }
        }
        else if (this.orders.type == 'patrol') {
            // if i see enemy while patrolling, go jump to the first enemy :)
            var patrolOrder = this.orders;
            var enemiesInRange = this.findEnemiesInRange(this, 2, units, buildings, turrets);
            if (enemiesInRange.length > 0) {
                var enemy = enemiesInRange[0];
                this.orders = { type: 'attack', target: enemy, lastOrders: this.orders };
                return;
            }
            this.moveTo(patrolOrder.to, false, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
            var distance = Math.pow(Math.pow(patrolOrder.to.y - this.y, 2) + Math.pow(patrolOrder.to.x - this.x, 2), 0.5);
            if (distance < 4 * this.softCollisionRadius / gridSize) {
                this.orders = { type: 'patrol', to: patrolOrder.from, from: patrolOrder.to };
            }
        }
        else if (this.orders.type == 'protect' || this.orders.type == 'attack') {
            var protectOrder = this.orders;
            if (protectOrder.target.status == 'destroy') {
                var enemiesInRange = this.findEnemiesInRange(this, 2, units, buildings, turrets);
                if (enemiesInRange.length > 0) {
                    var enemy = enemiesInRange[0];
                    this.orders = { type: 'attack', target: enemy, lastOrders: this.orders };
                    return;
                }
                else {
                    if (this.orders['lastOrders']) {
                        this.orders = this.orders['lastOrders'];
                    }
                    else {
                        this.orders = { type: 'guard' };
                    }
                    return;
                }
            }
            if (this.orders.type == 'protect') {
                var enemiesInRange = this.findEnemiesInRange(this, 2, units, buildings, turrets);
                if (enemiesInRange.length > 0) {
                    var enemy = enemiesInRange[0];
                    this.orders = { type: 'attack', target: enemy, lastOrders: this.orders };
                    return;
                }
            }
            //var start = [Math.floor(this.x),Math.floor(this.y)];
            //adjust to center of target for buildings
            var targetX = protectOrder.target.x;
            var targetY = protectOrder.target.y;
            var targetCGX = protectOrder.target.x;
            var targetCGY = protectOrder.target.y;
            if (protectOrder.target.type == 'turret') {
                targetX += protectOrder.target.pixelWidth / (2 * gridSize);
                targetY += protectOrder.target.pixelHeight / (2 * gridSize);
                targetCGX = targetX;
                targetCGY = targetY;
            }
            if (protectOrder.target.type == 'building') {
                targetX += protectOrder.target.gridWidth / 2;
                targetY += protectOrder.target.gridHeight;
                targetCGX = targetX;
                targetCGY += protectOrder.target.gridHeight / 2;
            }
            if (Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2) > Math.pow(this.sight - 1, 2)) {
                this.moveTo({ x: Math.floor(targetX), y: Math.floor(targetY) }, true, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
            }
            if (Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2) <= Math.pow(this.sight, 2)) {
                if (this.orders.type == 'attack') {
                    var turretAngle = this.findAngle({ x: targetCGX, y: targetCGY }, this, 32);
                    if (this.turretDirection == turretAngle) {
                        // aiming turret at him and within range... FIRE!!!!!
                        this.instructions.push({ type: 'fire' });
                        //this.instructions=[{type:'fire'}];
                    }
                    else {
                        this.instructions.push({ type: 'aim', toDirection: turretAngle });
                        //console.log('turret '+this.turretDirection +'  -> '+turretAngle)
                    }
                }
                // do nothing... wait...
            }
        }
        else if (this.orders.type == 'build') {
            if (this.moveDirection != 15) {
                this.instructions.push({ type: 'turn', toDirection: 15 });
            }
            else {
                this.status = 'destroy';
                sounds.play('construction');
                buildings.push(buildingsFactory.add({ name: 'construction-yard', x: Math.floor(this.x) - 1, y: Math.floor(this.y) - 1, status: 'build', team: curPlayerTeam }));
            }
        }
        else if (this.orders.type == 'guard') {
            // first see if an evil unit is in sight and track it :)
            var enemiesInRange = this.findEnemiesInRange(this, 2, units, buildings, turrets);
            if (this.primaryWeapon && enemiesInRange.length > 0) {
                var enemy = enemiesInRange[0];
                this.orders = { type: 'attack', target: enemy };
            }
        }
    };
    Vehicle.prototype.moveTo = function (destination, turretAtTarget, speedAdjustmentFactor, units, curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen) {
        var start = [Math.floor(this.x), Math.floor(this.y)];
        var end = [destination.x, destination.y];
        this.path = this.findPath(start, end, this.team == curPlayerTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen);
        //this.path = [];
        //this.path = [{x:start[0],y:start[1]},{x:end[0],y:end[1]}];
        this.instructions = [];
        if (this.path.length <= 1) {
            if (Math.abs(this.x - destination.x) < 1 && Math.abs(this.y - destination.y) < 1) {
                if (this.x == end[0] && this.y == end[1]) {
                    //reached
                }
                else {
                    this.path = [{ x: start[0], y: start[1] }, { x: end[0], y: end[1] }];
                }
            }
        }
        if (this.path.length > 1) {
            var newAngle = this.findAngle(this.path[1], this.path[0], 32);
            var movement = this.movementSpeed * speedAdjustmentFactor / gridSize;
            var angleRadians = (this.moveDirection / 32) * 2 * Math.PI;
            this.x = (this.x - movement * Math.sin(angleRadians));
            this.y = (this.y - movement * Math.cos(angleRadians));
            this.colliding = false;
            var collision;
            for (var k = units.length - 1; k >= 0; k--) {
                if (collision = this.collision(units[k], gridSize)) {
                    if (collision.distance < this.collisionDistance) {
                        this.collisionType = collision.type;
                        this.collisionDistance = collision.distance;
                        this.collisionWith = units[k];
                        this.colliding = true;
                        //alert('colliding' + this.collisionType)
                    }
                }
            }
            ;
            for (var k = 0; k < obstructionGrid.length; k++) {
                for (var l = 0; l < obstructionGrid[k].length; l++) {
                    if (obstructionGrid[k][l] > 0) {
                        //alert((k+0.5)*game.gridSize +' '+(l+0.5)*game.gridSize + ' game.gridSize*0.5')
                        var tile = {
                            x: (l + 0.5), y: (k + 0.5),
                            collisionRadius: gridSize * 0.5, softCollisionRadius: gridSize * 0.7
                        };
                        if (collision = this.collision(tile, gridSize)) {
                            if (collision.distance < this.collisionDistance) {
                                this.collisionType = collision.type;
                                this.collisionDistance = collision.distance;
                                this.collisionWith = tile;
                                this.colliding = true;
                                //alert('colliding' + this.collisionType)
                            }
                        }
                    }
                }
            }
            this.x = (this.x + movement * Math.sin(angleRadians));
            this.y = (this.y + movement * Math.cos(angleRadians));
            //this.movementSpeed = this.speed;
            if (this.colliding) {
                //his.movementSpeed = 0;
                var collDirection = this.findAngle(this.collisionWith, this, 32);
                var dTurn = this.angleDiff(this.moveDirection, collDirection, 32);
                var dTurnDestination = this.angleDiff(newAngle, collDirection, 32);
                /*if(this.collisionWith && this.collisionWith.type=='vehicle' && this.collisionType.indexOf('hard')>-1 && Math.abs(dTurn)<9){
                      if(this.collisionWith.instructions.length==0 && this.collisionWith.orders.type == 'guard'){
                          this.collisionWith.orders = {type:'make-way',for:this};

                      }
                 }*/
                switch (this.collisionType) {
                    case 'hard':
                        //alert('collDirection'+collDirection + 'moveDirection '+this.moveDirection + ' dTurn ' +dTurn);
                        /**/
                        this.movementSpeed = 0;
                        if (Math.abs(dTurn) == 0) { // Bumping into something ahead
                            if (Math.abs(dTurnDestination) > 0) {
                                newAngle = this.addAngle(this.moveDirection, -1 * dTurnDestination / Math.abs(dTurnDestination), 32);
                            }
                            else {
                                newAngle = this.addAngle(this.moveDirection, -1, 32);
                            }
                            ////console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) <= 2) { // Bumping into something ahead
                            //if (Math.abs(dTurn)<Math.abs(dTurnDestination)){
                            newAngle = this.addAngle(this.moveDirection, -1 * dTurn / Math.abs(dTurn), 32);
                            ////console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                            //}
                            //newAngle = this.moveDirection;
                            //addAngle(this.moveDirection,-dTurn*1,32);
                        }
                        else if (Math.abs(dTurn) < 4) {
                            //this.movementSpeed -= this.speed/2;
                            //if (this.movementSpeed < -this.speed){
                            //      this.movementSpeed = -this.speed;
                            //}
                            //if (Math.abs(dTurn)<Math.abs(dTurnDestination)){
                            newAngle = this.addAngle(this.moveDirection, -1 * dTurn / Math.abs(dTurn), 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //}
                            this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) < 9) {
                            newAngle = this.addAngle(this.moveDirection, -dTurn / Math.abs(dTurn), 32);
                            this.moveDirection = newAngle;
                        }
                        else {
                            this.movementSpeed = this.speed;
                        }
                        break;
                    case 'soft-hard':
                        /*if(this.collisionWith && this.collisionWith.type=='vehicle' && Math.abs(dTurn)<2 ){
                             if(this.collisionWith.instructions.length==0 && this.collisionWith.orders.type == 'guard'){
                                 this.collisionWith.orders = {type:'make-way',for:this};

                             }
                        }*/
                        if (Math.abs(dTurn) == 0) { // Bumping into something ahead
                            this.movementSpeed = 0;
                            if (Math.abs(dTurnDestination) > 0) {
                                newAngle = this.addAngle(this.moveDirection, -1 * dTurnDestination / Math.abs(dTurnDestination), 32);
                            }
                            else {
                                newAngle = this.addAngle(this.moveDirection, -1, 32);
                            }
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) <= 2) { // Bumping into something ahead
                            this.movementSpeed = 0;
                            /*this.movementSpeed = this.speed*(this.collisionDistance-this.collisionRadius)/(this.softCollisionRadius - this.collisionRadius);
                            if (this.movementSpeed<0) {
                                this.movementSpeed = 0;
                            }*/
                            //this.movementSpeed  =this.speed/3;//-= this.speed*1/3;
                            newAngle = this.addAngle(this.moveDirection, -1 * dTurn / Math.abs(dTurn), 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) < 4) {
                            this.movementSpeed = 0;
                            //if (Math.abs(dTurn)<Math.abs(dTurnDestination)){
                            newAngle = this.addAngle(this.moveDirection, -1 * dTurn / Math.abs(dTurn), 32);
                            //}
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) < 9) {
                            //this.movementSpeed = this.speed*(this.collisionDistance-this.collisionRadius)/(this.softCollisionRadius - this.collisionRadius);
                            //if (this.movementSpeed<0) {
                            this.movementSpeed = 0;
                            //}
                            //this.movementSpeed =this.speed/2;//-= this.speed/3;
                            newAngle = this.addAngle(this.moveDirection, -1 * dTurn / Math.abs(dTurn), 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            this.moveDirection = newAngle;
                        }
                        else {
                            this.movementSpeed = this.speed;
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //newAngle = this.moveDirection;
                        }
                        break;
                    case 'soft':
                        if (Math.abs(dTurn) == 0) { // Bumping into something ahead
                            this.movementSpeed = this.speed * (this.collisionDistance - this.collisionRadius) / (this.softCollisionRadius - this.collisionRadius);
                            if (this.movementSpeed < 0) {
                                this.movementSpeed = 0;
                            }
                            if (Math.abs(dTurnDestination) > 0) {
                                newAngle = this.addAngle(this.moveDirection, -1 * dTurnDestination / Math.abs(dTurnDestination), 32);
                            }
                            else {
                                newAngle = this.addAngle(this.moveDirection, -1, 32);
                            }
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //this.moveDirection = newAngle;
                            //this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) <= 2) { // Bumping into something ahead
                            this.movementSpeed = this.speed * (this.collisionDistance - this.collisionRadius) / (this.softCollisionRadius - this.collisionRadius);
                            if (this.movementSpeed < 0) {
                                this.movementSpeed = 0;
                            }
                            newAngle = this.addAngle(this.moveDirection, -dTurn * 1, 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) < 4) {
                            this.movementSpeed = this.speed * (this.collisionDistance - this.collisionRadius) / (this.softCollisionRadius - this.collisionRadius);
                            if (this.movementSpeed < 0) {
                                this.movementSpeed = 0;
                            }
                            newAngle = this.addAngle(this.moveDirection, -dTurn * 1, 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //this.moveDirection = newAngle;
                        }
                        else if (Math.abs(dTurn) < 9) {
                            this.movementSpeed = this.speed;
                            newAngle = this.addAngle(this.moveDirection, -dTurn * 1, 32);
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //this.moveDirection = newAngle;
                        }
                        else {
                            this.movementSpeed = this.speed;
                            //console.log('moving:' + this.moveDirection +' coll: '+this.collisionType+' '+collDirection + ' dTurn:' +dTurn + ' RESULT: newAngle:' +newAngle +' speed:'+this.movementSpeed);
                            //newAngle = this.moveDirection;
                        }
                        break;
                }
            }
            else {
                this.movementSpeed = this.speed;
            }
            if (this.movementSpeed > this.speed) {
                this.movementSpeed = this.speed;
            }
            else if (this.movementSpeed < -this.speed) {
                this.movementSpeed = -this.speed;
            }
            if (this.moveDirection != newAngle) {
                this.instructions.push({ type: 'turn', toDirection: newAngle });
            }
            var magTurn = Math.abs(this.angleDiff(this.moveDirection, newAngle, 32));
            //if (magTurn<2 || this.colliding){
            var collision2;
            for (var k = 0; k < obstructionGrid.length; k++) {
                for (var l = 0; l < obstructionGrid[k].length; l++) {
                    if (obstructionGrid[k][l] > 0) {
                        //alert((k+0.5)*game.gridSize +' '+(l+0.5)*game.gridSize + ' game.gridSize*0.5')
                        var tile = {
                            x: (l + 0.5),
                            y: (k + 0.5),
                            collisionRadius: gridSize * 0.5,
                            softCollisionRadius: gridSize * 0.7
                        };
                        if (collision2 = this.collision(tile, gridSize)) {
                            break;
                        }
                    }
                }
            }
            ;
            if (magTurn < 3 || this.colliding) {
                this.instructions.push({ type: 'move', distance: 1 });
            }
            var turretAngle;
            if (turretAtTarget) {
                turretAngle = this.findAngle(destination, this, 32);
            }
            else {
                //turretAngle = this.moveDirection;
                //if (this.path.length>0)
                turretAngle = this.findAngle(this.path[1], this.path[0], 32);
                // turretAngle = findAngle({x:targetX,y:targetY},this,32);
                //this.turretDirection = newAngle;
            }
            if (this.turretDirection != turretAngle) {
                this.instructions.push({ type: 'aim', toDirection: turretAngle });
            }
        }
    };
    Vehicle.prototype.move = function (speedAdjustmentFactor, gridSize, sounds, bulletDrawer) {
        this.moving = false;
        this.attacking = false;
        if (!this.instructions) {
            this.instructions = [];
        }
        if (this.instructions.length == 0) {
            return;
        }
        for (var i = 0; i < this.instructions.length; i++) {
            var instr = this.instructions[i];
            if (instr.type == 'turn') {
                var turnInstr = instr;
                if (turnInstr.toDirection == this.moveDirection) {
                    // instruction complete...
                    instr.type = 'done';
                    //return;
                }
                if ((turnInstr.toDirection > this.moveDirection && (turnInstr.toDirection - this.moveDirection) < 16)
                    || (turnInstr.toDirection < this.moveDirection && (this.moveDirection - turnInstr.toDirection) > 16)) {
                    //alert(this.turnSpeed*0.05)
                    this.moveDirection = this.moveDirection + this.turnSpeed * 0.1;
                    if ((this.moveDirection - turnInstr.toDirection) * (this.moveDirection + this.turnSpeed * 0.1 - turnInstr.toDirection) <= 0) {
                        this.moveDirection = turnInstr.toDirection;
                    }
                }
                else {
                    this.moveDirection = this.moveDirection - this.turnSpeed * 0.1;
                    if ((this.moveDirection - turnInstr.toDirection) * (this.moveDirection - this.turnSpeed * 0.1 - turnInstr.toDirection) <= 0) {
                        this.moveDirection = turnInstr.toDirection;
                    }
                }
                if (this.moveDirection > 31) {
                    this.moveDirection = 0;
                }
                else if (this.moveDirection < 0) {
                    this.moveDirection = 31;
                }
            }
            if (instr.type == 'move') {
                //alert(1);
                var moveInstr = instr;
                if (moveInstr.distance <= 0) {
                    //this.instructions.splice(0,1);
                    //return;
                    instr.type = 'done';
                    return;
                }
                this.moving = true;
                //alert(this.movementSpeed)
                var movement = this.movementSpeed * speedAdjustmentFactor / gridSize;
                moveInstr.distance -= movement;
                var angle = (this.moveDirection / 32) * 2 * Math.PI;
                this.x = (this.x - movement * Math.sin(angle));
                this.y = (this.y - movement * Math.cos(angle));
            }
            if (instr.type == 'aim') {
                var aimInstr = instr;
                //alert('aiming: ' + instr.toDirection + ' and turret is at '+this.turretDirection)
                if (aimInstr.toDirection == this.turretDirection) {
                    // instruction complete...
                    instr.type = 'done';
                    //return;
                }
                else {
                    var delta = this.angleDiff(Math.floor(this.turretDirection), Math.floor(aimInstr.toDirection), 32);
                    if (Math.abs(delta) < 1) {
                        //this.turretDirection = instr.toDirection
                        this.turretDirection = aimInstr.toDirection;
                        instr.type = 'done';
                    }
                    else {
                        this.turretDirection = this.addAngle(this.turretDirection, delta / Math.abs(delta), 32);
                    }
                }
            }
            if (instr.type == 'fire') {
                // alert(this.fireCounter)
                if (!this.bulletFiring) {
                    sounds.play('tank_fire');
                    this.bulletFiring = true;
                    var angle = (this.turretDirection / 32) * 2 * Math.PI;
                    bulletDrawer.fireBullet({ x: this.x, y: this.y, angle: angle, range: this.sight, source: this });
                }
            }
        }
        ;
    };
    Vehicle.prototype.findPath = function (start, end, isHeroTeam, obstructionGrid, heroObstructionGrid, debugMode, context, gridSize, screen) {
        var g = isHeroTeam ? heroObstructionGrid : obstructionGrid;
        // hack to find path to buildings
        try {
            g[end[1]][end[0]] = 0;
            g[start[1]][start[0]];
            //alert(end.y)
        }
        catch (err) {
            return [{ x: start[0], y: start[1] }, { x: end[0], y: end[1] }];
        }
        var path = AStar(g, start, end, 'Euclidean');
        this.shortenPath(path, g);
        if (path.length > 1 && debugMode) {
            for (var k = 0; k < path.length; k++) {
                //game.highlightGrid(path[k].x,path[k].y,1,1,'rgba(100,100,100,0.3)');
                context.beginPath();
                context.fillStyle = 'rgba(150,50,100,0.5)';
                context.arc((path[k].x + 0.5) * gridSize + screen.viewportAdjust.x, (path[k].y + 0.5) * gridSize + screen.viewportAdjust.y, 5, 0, 2 * Math.PI);
                context.fill();
            }
        }
        return path;
    };
    Vehicle.prototype.shortenPath = function (path, grid) {
        //alert(1);
        //return;
        var nextCellVisible = true;
        var start = path[0];
        //alert(0)
        while (nextCellVisible && path.length > 2) {
            //alert(0.5)
            var next = path[2];
            if (Math.abs(next.y - start.y) > Math.abs(next.x - start.x)) {
                //along y
                var slope = (next.x - start.x) / (next.y - start.y);
                var deltaY = 0.4 * (next.y - start.y) / Math.abs((next.y - start.y));
                var y = deltaY;
                var test = { x: start.x + y * slope, y: start.y + y };
                while (nextCellVisible && Math.abs(test.y - next.y) > 0.3) {
                    //alert(test.y)
                    if (grid[Math.floor(test.y)][Math.floor(test.x)] > 0) {
                        nextCellVisible = false;
                    }
                    y += deltaY;
                    test = { x: start.x + y * slope, y: start.y + y };
                }
                //nextCellVisible = false;
            }
            else {
                //alert(2);
                var slope = (next.y - start.y) / (next.x - start.x);
                var deltaX = 0.4 * (next.x - start.x) / Math.abs(next.x - start.x);
                var x = deltaX;
                var test = { x: start.x + x, y: start.y + slope * x };
                while (nextCellVisible && Math.abs(test.x - next.x) >= 0.3) {
                    if (grid[Math.floor(test.y)][Math.floor(test.x)] > 0) {
                        nextCellVisible = false;
                    }
                    x += deltaX;
                    test = { x: start.x + x, y: start.y + slope * x };
                }
                //along x
                //nextCellVisible = false;
            }
            if (nextCellVisible) {
                path.splice(1, 1);
                //alert(path.length)
            }
        }
    };
    Vehicle.prototype.collision = function (otherUnit, gridSize) {
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
    return Vehicle;
}(DestructibleObject));
module.exports = Vehicle;


},{"./AStar":1,"./DestructibleObject":5}],26:[function(require,module,exports){
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


},{"./Harvester":10,"./Vehicle":25,"./VisualObject":27}],27:[function(require,module,exports){
"use strict";
var VisualObject = /** @class */ (function () {
    function VisualObject() {
    }
    VisualObject.prototype.preloadImage = function (imgUrl, callbackFunction) {
        var _this = this;
        this.loaded = false;
        var image = new Image();
        image.src = 'images/' + imgUrl;
        this.preloadCount++;
        $(image).bind('load', function () {
            _this.loadedCount++;
            if (_this.loadedCount == _this.preloadCount) {
                _this.loaded = true;
            }
            if (callbackFunction) {
                callbackFunction();
            }
        });
        return image;
    };
    VisualObject.prototype.loadImageArray = function (imgName, count, extn) {
        if (!extn) {
            extn = '.png';
        }
        var imageArray = [];
        for (var i = 0; i < count; i++) {
            imageArray.push(this.preloadImage(imgName + '-' + (i < 10 ? '0' : '') + i + extn));
        }
        ;
        return imageArray;
    };
    VisualObject.prototype.loadSpriteSheet = function (forObject, details, from) {
        var _this = this;
        forObject.spriteCanvas = document.createElement('canvas');
        forObject.spriteImage = this.preloadImage(from + '/' + details.name + '-sprite-sheet.png', function () {
            _this.transformSpriteSheet(forObject, details);
        });
        forObject.spriteArray = [];
        forObject.spriteCount = 0;
        for (var i = 0; i < details.imagesToLoad.length; i++) {
            var constructImageCount = details.imagesToLoad[i].count;
            var constructImageName = details.imagesToLoad[i].name;
            forObject.spriteArray[constructImageName] =
                { name: constructImageName, count: constructImageCount, offset: forObject.spriteCount };
            forObject.spriteCount += constructImageCount;
        }
    };
    VisualObject.prototype.transformSpriteSheet = function (forObject, details) {
        forObject.spriteCanvas.width = forObject.spriteImage.width;
        forObject.spriteCanvas.height = forObject.spriteImage.height * 2;
        //document.body.appendChild(forObject.spriteCanvas);
        var spriteContext = forObject.spriteCanvas.getContext('2d', { willReadFrequently: true });
        spriteContext.drawImage(forObject.spriteImage, 0, 0);
        spriteContext.drawImage(forObject.spriteImage, 0, forObject.spriteImage.height);
        var colorMap = [
            // gun turret
            { gdi: [198, 170, 93], nod: [218, 0, 0] },
            { gdi: [178, 149, 80], nod: [191, 26, 7] },
            { gdi: [97, 76, 36], nod: [108, 0, 0] },
            //power plant
            { gdi: [145, 137, 76], nod: [169, 27, 26] },
            { gdi: [125, 117, 64], nod: [133, 39, 30] },
            { gdi: [109, 101, 56], nod: [125, 1, 0] },
            { gdi: [89, 85, 44], nod: [96, 41, 24] },
            { gdi: [170, 153, 85], nod: [190, 26, 7] },
            { gdi: [194, 174, 97], nod: [220, 0, 0] },
            { gdi: [246, 214, 121], nod: [255, 0, 1] },
            { gdi: [222, 190, 105], nod: [246, 1, 0] },
        ];
        var imgData = spriteContext.getImageData(0, 0, forObject.spriteCanvas.width, forObject.spriteCanvas.height);
        var imgDataArray = imgData.data;
        var size = imgDataArray.length / 4;
        for (var p = size / 2; p < size; p++) {
            //console.log(p)
            var r = imgDataArray[p * 4];
            var g = imgDataArray[p * 4 + 1];
            var b = imgDataArray[p * 4 + 2];
            var a = imgDataArray[p * 4 + 2];
            if (details.type == 'turret' || details.type == 'building' || details.name == 'mcv' || details.name == 'harvester') {
                // long color map convert each yellow to re
                for (var i = colorMap.length - 1; i >= 0; i--) {
                    //alert(1)
                    if (r == colorMap[i].gdi[0] && g == colorMap[i].gdi[1] && b == colorMap[i].gdi[2]) {
                        imgDataArray[p * 4 + 0] = colorMap[i].nod[0];
                        imgDataArray[p * 4 + 1] = colorMap[i].nod[1];
                        imgDataArray[p * 4 + 2] = colorMap[i].nod[2];
                        break;
                    }
                }
                ;
            }
            else if (details.type == 'vehicle' || details.type == 'infantry') {
                // quick hack. Just make it grayscale
                imgDataArray[p * 4 + 0] = (r + g + b) / 3;
                imgDataArray[p * 4 + 1] = (r + g + b) / 3;
                imgDataArray[p * 4 + 2] = (r + g + b) / 3;
            }
        }
        ;
        for (var p = 0; p < size; p++) {
            var r = imgDataArray[p * 4];
            var g = imgDataArray[p * 4 + 1];
            var b = imgDataArray[p * 4 + 2];
            var a = imgDataArray[p * 4 + 2];
            // convert to transparent shadow
            if (g == 255 && (b == 96 || b == 89 || b == 85) && (r == 0 || r == 85)) {
                imgDataArray[p * 4] = 0;
                imgDataArray[p * 4 + 1] = 0;
                imgDataArray[p * 4 + 2] = 0;
                imgData.data[p * 4 + 3] = 0.8;
            }
        }
        ;
        spriteContext.putImageData(imgData, 0, 0);
    };
    return VisualObject;
}());
module.exports = VisualObject;


},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5ucG0vX25weC81MGE3OWNjNWYyNDA3MmRiL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9BU3Rhci5qcyIsImpzL0FwcC5qcyIsImpzL0J1aWxkaW5nLmpzIiwianMvQnVpbGRpbmdzLmpzIiwianMvRGVzdHJ1Y3RpYmxlT2JqZWN0LmpzIiwianMvRm9nLmpzIiwianMvR2FtZS5qcyIsImpzL0dhbWVPYmplY3QuanMiLCJqcy9HYW1lU2NyZWVuLmpzIiwianMvSGFydmVzdGVyLmpzIiwianMvSW5mYW50cnkuanMiLCJqcy9JbmZhbnRyeUZhY3RvcnkuanMiLCJqcy9MZXZlbHMuanMiLCJqcy9Nb3VzZS5qcyIsImpzL092ZXJsYXkuanMiLCJqcy9PdmVybGF5RmFjdG9yeS5qcyIsImpzL1BsYXllci5qcyIsImpzL1BvaW50LmpzIiwianMvUmVjdGFuZ2xlLmpzIiwianMvU2lkZWJhci5qcyIsImpzL1NvdW5kcy5qcyIsImpzL1RpYmVyaXVtUmVmaW5lcnkuanMiLCJqcy9UdXJyZXQuanMiLCJqcy9UdXJyZXRzLmpzIiwianMvVmVoaWNsZS5qcyIsImpzL1ZlaGljbGVzLmpzIiwianMvVmlzdWFsT2JqZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaDRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDenFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEEqIChBLVN0YXIpIGFsZ29yaXRobSBmb3IgYSBwYXRoIGZpbmRlclxuICogQGF1dGhvciAgQW5kcmVhIEdpYW1tYXJjaGlcbiAqIEBsaWNlbnNlIE1pdCBTdHlsZSBMaWNlbnNlXG4gKi9cbmZ1bmN0aW9uIGRpYWdvbmFsU3VjY2Vzc29ycygkTiwgJFMsICRFLCAkVywgTiwgUywgRSwgVywgZ3JpZCwgcm93cywgY29scywgcmVzdWx0LCBpKSB7XG4gICAgaWYgKCROKSB7XG4gICAgICAgICRFICYmICFncmlkW05dW0VdICYmIChyZXN1bHRbaSsrXSA9IHsgeDogRSwgeTogTiB9KTtcbiAgICAgICAgJFcgJiYgIWdyaWRbTl1bV10gJiYgKHJlc3VsdFtpKytdID0geyB4OiBXLCB5OiBOIH0pO1xuICAgIH1cbiAgICBpZiAoJFMpIHtcbiAgICAgICAgJEUgJiYgIWdyaWRbU11bRV0gJiYgKHJlc3VsdFtpKytdID0geyB4OiBFLCB5OiBTIH0pO1xuICAgICAgICAkVyAmJiAhZ3JpZFtTXVtXXSAmJiAocmVzdWx0W2krK10gPSB7IHg6IFcsIHk6IFMgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBkaWFnb25hbFN1Y2Nlc3NvcnNGcmVlKCROLCAkUywgJEUsICRXLCBOLCBTLCBFLCBXLCBncmlkLCByb3dzLCBjb2xzLCByZXN1bHQsIGkpIHtcbiAgICAkTiA9IE4gPiAtMTtcbiAgICAkUyA9IFMgPCByb3dzO1xuICAgICRFID0gRSA8IGNvbHM7XG4gICAgJFcgPSBXID4gLTE7XG4gICAgaWYgKCRFKSB7XG4gICAgICAgICROICYmICFncmlkW05dW0VdICYmIChyZXN1bHRbaSsrXSA9IHsgeDogRSwgeTogTiB9KTtcbiAgICAgICAgJFMgJiYgIWdyaWRbU11bRV0gJiYgKHJlc3VsdFtpKytdID0geyB4OiBFLCB5OiBTIH0pO1xuICAgIH1cbiAgICBpZiAoJFcpIHtcbiAgICAgICAgJE4gJiYgIWdyaWRbTl1bV10gJiYgKHJlc3VsdFtpKytdID0geyB4OiBXLCB5OiBOIH0pO1xuICAgICAgICAkUyAmJiAhZ3JpZFtTXVtXXSAmJiAocmVzdWx0W2krK10gPSB7IHg6IFcsIHk6IFMgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBub3RoaW5nVG9EbygkTiwgJFMsICRFLCAkVywgTiwgUywgRSwgVywgZ3JpZCwgcm93cywgY29scywgcmVzdWx0LCBpKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHN1Y2Nlc3NvcnMoZmluZCwgeCwgeSwgZ3JpZCwgcm93cywgY29scykge1xuICAgIHZhciBOID0geSAtIDEsIFMgPSB5ICsgMSwgRSA9IHggKyAxLCBXID0geCAtIDEsICROID0gTiA+IC0xICYmICFncmlkW05dW3hdLCAkUyA9IFMgPCByb3dzICYmICFncmlkW1NdW3hdLCAkRSA9IEUgPCBjb2xzICYmICFncmlkW3ldW0VdLCAkVyA9IFcgPiAtMSAmJiAhZ3JpZFt5XVtXXSwgcmVzdWx0ID0gW10sIGkgPSAwO1xuICAgICROICYmIChyZXN1bHRbaSsrXSA9IHsgeDogeCwgeTogTiB9KTtcbiAgICAkRSAmJiAocmVzdWx0W2krK10gPSB7IHg6IEUsIHk6IHkgfSk7XG4gICAgJFMgJiYgKHJlc3VsdFtpKytdID0geyB4OiB4LCB5OiBTIH0pO1xuICAgICRXICYmIChyZXN1bHRbaSsrXSA9IHsgeDogVywgeTogeSB9KTtcbiAgICByZXR1cm4gZmluZCgkTiwgJFMsICRFLCAkVywgTiwgUywgRSwgVywgZ3JpZCwgcm93cywgY29scywgcmVzdWx0LCBpKTtcbn1cbmZ1bmN0aW9uIGRpYWdvbmFsKHN0YXJ0LCBlbmQsIGYxLCBmMikge1xuICAgIHJldHVybiBmMihmMShzdGFydC54IC0gZW5kLngpLCBmMShzdGFydC55IC0gZW5kLnkpKTtcbn1cbmZ1bmN0aW9uIGV1Y2xpZGVhbihzdGFydCwgZW5kLCBmMSwgZjIpIHtcbiAgICB2YXIgeCA9IHN0YXJ0LnggLSBlbmQueCwgeSA9IHN0YXJ0LnkgLSBlbmQueTtcbiAgICByZXR1cm4gZjIoeCAqIHggKyB5ICogeSk7XG59XG5mdW5jdGlvbiBtYW5oYXR0YW4oc3RhcnQsIGVuZCwgZjEsIGYyKSB7XG4gICAgcmV0dXJuIGYxKHN0YXJ0LnggLSBlbmQueCkgKyBmMShzdGFydC55IC0gZW5kLnkpO1xufVxuZnVuY3Rpb24gQVN0YXIoZ3JpZCwgc3RhcnQsIGVuZCwgZikge1xuICAgIHZhciBjb2xzID0gZ3JpZFswXS5sZW5ndGgsIHJvd3MgPSBncmlkLmxlbmd0aCwgbGltaXQgPSBjb2xzICogcm93cywgZjEgPSBNYXRoLmFicywgZjIgPSBNYXRoLm1heCwgbGlzdCA9IHt9LCByZXN1bHQgPSBbXSwgb3BlbiA9IFt7IHg6IHN0YXJ0WzBdLCB5OiBzdGFydFsxXSwgZjogMCwgZzogMCwgdjogc3RhcnRbMF0gKyBzdGFydFsxXSAqIGNvbHMgfV0sIGxlbmd0aCA9IDEsIG5ld0VuZCA9IHsgeDogZW5kWzBdLCB5OiBlbmRbMV0sIHY6IGVuZFswXSArIGVuZFsxXSAqIGNvbHMgfSwgZm1heCwgYWRqLCBkaXN0YW5jZSwgZmluZCwgaSwgaiwgbWF4LCBtaW4sIGN1cnJlbnQsIG5leHQ7XG4gICAgc3dpdGNoIChmKSB7XG4gICAgICAgIGNhc2UgXCJEaWFnb25hbFwiOlxuICAgICAgICAgICAgZmluZCA9IGRpYWdvbmFsU3VjY2Vzc29ycztcbiAgICAgICAgY2FzZSBcIkRpYWdvbmFsRnJlZVwiOlxuICAgICAgICAgICAgZGlzdGFuY2UgPSBkaWFnb25hbDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiRXVjbGlkZWFuXCI6XG4gICAgICAgICAgICBmaW5kID0gZGlhZ29uYWxTdWNjZXNzb3JzO1xuICAgICAgICBjYXNlIFwiRXVjbGlkZWFuRnJlZVwiOlxuICAgICAgICAgICAgZjIgPSBNYXRoLnNxcnQ7XG4gICAgICAgICAgICBkaXN0YW5jZSA9IGV1Y2xpZGVhbjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZGlzdGFuY2UgPSBtYW5oYXR0YW47XG4gICAgICAgICAgICBmaW5kID0gbm90aGluZ1RvRG87XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZmluZCB8fCAoZmluZCA9IGRpYWdvbmFsU3VjY2Vzc29yc0ZyZWUpO1xuICAgIGRvIHtcbiAgICAgICAgbWF4ID0gbGltaXQ7XG4gICAgICAgIG1pbiA9IDA7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKChmbWF4ID0gb3BlbltpXS5mKSA8IG1heCkge1xuICAgICAgICAgICAgICAgIG1heCA9IGZtYXg7XG4gICAgICAgICAgICAgICAgbWluID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGN1cnJlbnQgPSBvcGVuLnNwbGljZShtaW4sIDEpWzBdO1xuICAgICAgICBpZiAoY3VycmVudC52ICE9IG5ld0VuZC52KSB7XG4gICAgICAgICAgICAtLWxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBzdWNjZXNzb3JzKGZpbmQsIGN1cnJlbnQueCwgY3VycmVudC55LCBncmlkLCByb3dzLCBjb2xzKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSBuZXh0Lmxlbmd0aDsgaSA8IGo7ICsraSkge1xuICAgICAgICAgICAgICAgIChhZGogPSBuZXh0W2ldKS5wID0gY3VycmVudDtcbiAgICAgICAgICAgICAgICBhZGouZiA9IGFkai5nID0gMDtcbiAgICAgICAgICAgICAgICBhZGoudiA9IGFkai54ICsgYWRqLnkgKiBjb2xzO1xuICAgICAgICAgICAgICAgIGlmICghKGFkai52IGluIGxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkai5mID0gKGFkai5nID0gY3VycmVudC5nICsgZGlzdGFuY2UoYWRqLCBjdXJyZW50LCBmMSwgZjIpKSArIGRpc3RhbmNlKGFkaiwgbmV3RW5kLCBmMSwgZjIpO1xuICAgICAgICAgICAgICAgICAgICBvcGVuW2xlbmd0aCsrXSA9IGFkajtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFthZGoudl0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGkgPSBsZW5ndGggPSAwO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpKytdID0geyB4OiBjdXJyZW50LngsIHk6IGN1cnJlbnQueSB9O1xuICAgICAgICAgICAgfSB3aGlsZSAoY3VycmVudCA9IGN1cnJlbnQucCk7XG4gICAgICAgICAgICByZXN1bHQucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgfSB3aGlsZSAobGVuZ3RoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxubW9kdWxlLmV4cG9ydHMgPSBBU3Rhcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFTdGFyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEdhbWUgPSByZXF1aXJlKFwiLi9HYW1lXCIpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSwgZ2FtZSA9IG5ldyBHYW1lKGNhbnZhcyk7XG4gICAgLy8gYmVnaW4gdGhlIGdhbWVcbiAgICBnYW1lLnN0YXJ0KCk7XG4gICAgJCgnI2RlYnVnZ2VyJykudG9nZ2xlKCk7XG4gICAgJCgnI2RlYnVnX21vZGUnKS5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdhbWUuZGVidWdNb2RlID0gIWdhbWUuZGVidWdNb2RlO1xuICAgICAgICAkKCcjZGVidWdnZXInKS50b2dnbGUoKTtcbiAgICB9KTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBEZXN0cnVjdGlibGVPYmplY3QgPSByZXF1aXJlKFwiLi9EZXN0cnVjdGlibGVPYmplY3RcIik7XG52YXIgQnVpbGRpbmcgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEJ1aWxkaW5nLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEJ1aWxkaW5nKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnYnVpbGRpbmcnKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5wcmltYXJ5QnVpbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uU3BlZWQgPSAyO1xuICAgICAgICBfdGhpcy5zdGF0dXMgPSAnJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBCdWlsZGluZy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjb250ZXh0LCBjdXJQbGF5ZXJUZWFtLCBncmlkU2l6ZSwgc2NyZWVuLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSkge1xuICAgICAgICB2YXIgdGVhbVlPZmZzZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy50ZWFtICE9IGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgICAgIHRlYW1ZT2Zmc2V0ID0gdGhpcy5waXhlbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICAvL0ZpcnN0IGRyYXcgdGhlIGJvdHRvbSBncmFzc1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLmJpYkltYWdlLCB0aGlzLnggKiBncmlkU2l6ZSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC54LCAodGhpcy55ICsgdGhpcy5ncmlkSGVpZ2h0IC0gMSkgKiBncmlkU2l6ZSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC55KTtcbiAgICAgICAgdmFyIGxpZmUgPSB0aGlzLmdldExpZmUoKSwgaW1hZ2VDYXRlZ29yeTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09IFwiYnVpbGRcIiB8fCB0aGlzLnN0YXR1cyA9PSBcInNlbGxcIikge1xuICAgICAgICAgICAgaW1hZ2VDYXRlZ29yeSA9ICdidWlsZCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0dXMgPT0gXCJcIiB8fCB0aGlzLmxpZmUgPT0gXCJ1bHRyYS1kYW1hZ2VkXCIpIHtcbiAgICAgICAgICAgIGltYWdlQ2F0ZWdvcnkgPSB0aGlzLmxpZmU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbWFnZUNhdGVnb3J5ID0gdGhpcy5saWZlICsgXCItXCIgKyB0aGlzLnN0YXR1cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IHRoaXMuZ3JpZFNoYXBlWzBdLmxlbmd0aCAqIGdyaWRTaXplO1xuICAgICAgICB2YXIgaW1hZ2VIZWlnaHQgPSB0aGlzLnNwcml0ZUltYWdlLmhlaWdodDtcbiAgICAgICAgLy8gVGhlbiBkcmF3IHRoZSBiYXNlIHdpdGggYmFzZU9mZnNldFxuICAgICAgICB2YXIgYmFzZUltYWdlID0gdGhpcy5zcHJpdGVBcnJheVt0aGlzLmxpZmUgKyBcIi1iYXNlXCJdO1xuICAgICAgICBpZiAoYmFzZUltYWdlICYmIHRoaXMuc3RhdHVzICE9ICdidWlsZCcgJiYgdGhpcy5zdGF0dXMgIT0gJ3NlbGwnKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnNwcml0ZUNhbnZhcywgYmFzZUltYWdlLm9mZnNldCAqIGltYWdlV2lkdGgsIHRlYW1ZT2Zmc2V0LCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgZ3JpZFNpemUgKiAodGhpcy54KSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC54LCAodGhpcy55KSAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnksIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaW5hbGx5IGRyYXcgdGhlIHRvcCBwYXJ0IHdpdGggYXBwcm9wcmlhdGUgYW5pbWF0aW9uXG4gICAgICAgIHZhciBpbWFnZUxpc3QgPSB0aGlzLnNwcml0ZUFycmF5W2ltYWdlQ2F0ZWdvcnldO1xuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uSW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbWFnZUxpc3QuY291bnQgPj0gTWF0aC5mbG9vcih0aGlzLmFuaW1hdGlvbkluZGV4IC8gdGhpcy5hbmltYXRpb25TcGVlZCkpIHtcbiAgICAgICAgICAgIHZhciBpbWFnZUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLmFuaW1hdGlvbkluZGV4IC8gdGhpcy5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gJ3NlbGwnKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2VJbmRleCA9IGltYWdlTGlzdC5jb3VudCAtIDEgLSBNYXRoLmZsb29yKHRoaXMuYW5pbWF0aW9uSW5kZXggLyB0aGlzLmFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3ByaXRlQ2FudmFzLCAoaW1hZ2VMaXN0Lm9mZnNldCArIGltYWdlSW5kZXgpICogaW1hZ2VXaWR0aCwgdGVhbVlPZmZzZXQsIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0LCBncmlkU2l6ZSAqICh0aGlzLngpICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LngsICh0aGlzLnkpICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSW5kZXggLyB0aGlzLmFuaW1hdGlvblNwZWVkID49IGltYWdlTGlzdC5jb3VudCkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbmRleCA9IDA7XG4gICAgICAgICAgICB0aGlzLmFwcGx5U3RhdHVzRHVyaW5nRHJhdyhjdXJQbGF5ZXJUZWFtLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3U2VsZWN0aW9uKGNvbnRleHQsIGdyaWRTaXplLCBzY3JlZW4sIHNpZGViYXIpO1xuICAgICAgICBpZiAodGhpcy5yZXBhaXJpbmcpIHtcbiAgICAgICAgICAgIC8vYWxlcnQoJ3JlcGFpcmluZycpO1xuICAgICAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHNpZGViYXIudGV4dEJyaWdodG5lc3M7XG4gICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShzaWRlYmFyLnJlcGFpckltYWdlQmlnLCAodGhpcy54ICsgdGhpcy5ncmlkU2hhcGVbMF0ubGVuZ3RoIC8gMiAtIDEpICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueCwgKHRoaXMueSArIHRoaXMuZ3JpZFNoYXBlLmxlbmd0aCAvIDIgLSAxKSAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnkpO1xuICAgICAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5oaXRQb2ludHMgPj0gdGhpcy5tYXhIaXRQb2ludHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcGFpcmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaGl0UG9pbnRzID0gdGhpcy5tYXhIaXRQb2ludHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FzaFNwZW50ID0gMTtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhci5jYXNoID4gY2FzaFNwZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXIuY2FzaCAtPSBjYXNoU3BlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0UG9pbnRzICs9IChjYXNoU3BlbnQgKiAyICogdGhpcy5tYXhIaXRQb2ludHMgLyB0aGlzLmNvc3QpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nICh0aGlzLmhlYWx0aCArIFwiIFwiICsyKmNhc2hTcGVudCp0aGlzLmhpdFBvaW50cy90aGlzLmNvc3QpICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJ1aWxkaW5nLnByb3RvdHlwZS5kcmF3U2VsZWN0aW9uID0gZnVuY3Rpb24gKGNvbnRleHQsIGdyaWRTaXplLCBzY3JlZW4sIHNpZGViYXIpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kcmF3U2VsZWN0aW9uLmNhbGwodGhpcywgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbiwgc2lkZWJhcik7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmltYXJ5QnVpbGRpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gdGhpcy5nZXRTZWxlY3Rpb25Cb3VuZHMoZ3JpZFNpemUsIHNjcmVlbik7XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoc2lkZWJhci5wcmltYXJ5QnVpbGRpbmdJbWFnZSwgKGJvdW5kcy5sZWZ0ICsgYm91bmRzLnJpZ2h0IC0gc2lkZWJhci5wcmltYXJ5QnVpbGRpbmdJbWFnZS53aWR0aCkgLyAyLCBib3VuZHMuYm90dG9tIC0gc2lkZWJhci5wcmltYXJ5QnVpbGRpbmdJbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBCdWlsZGluZy5wcm90b3R5cGUuYXBwbHlTdGF0dXNEdXJpbmdEcmF3ID0gZnVuY3Rpb24gKGN1clBsYXllclRlYW0sIHVuaXRzLCB2ZWhpY2xlc0ZhY3RvcnksIHNpZGViYXIsIGVuZW15KSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSBcImJ1aWxkXCIgfHwgdGhpcy5zdGF0dXMgPT0gXCJjb25zdHJ1Y3RcIikge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdHVzID09ICdzZWxsJykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnZGVzdHJveSc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBCdWlsZGluZztcbn0oRGVzdHJ1Y3RpYmxlT2JqZWN0KSk7XG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkaW5nO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QnVpbGRpbmcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIFZpc3VhbE9iamVjdCA9IHJlcXVpcmUoXCIuL1Zpc3VhbE9iamVjdFwiKTtcbnZhciBCdWlsZGluZyA9IHJlcXVpcmUoXCIuL0J1aWxkaW5nXCIpO1xudmFyIFRpYmVyaXVtUmVmaW5lcnkgPSByZXF1aXJlKFwiLi9UaWJlcml1bVJlZmluZXJ5XCIpO1xudmFyIEJ1aWxkaW5ncyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQnVpbGRpbmdzLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEJ1aWxkaW5ncygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50eXBlcyA9IFtdO1xuICAgICAgICBfdGhpcy5idWlsZGluZ0RldGFpbHMgPSB7XG4gICAgICAgICAgICAnY29uc3RydWN0aW9uLXlhcmQnOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbnN0cnVjdGlvbi15YXJkJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbnN0cnVjdGlvbiBZYXJkJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYnVpbGRpbmcnLFxuICAgICAgICAgICAgICAgIHBvd2VySW46IDE1LFxuICAgICAgICAgICAgICAgIHBvd2VyT3V0OiAzMCxcbiAgICAgICAgICAgICAgICBjb3N0OiA1MDAwLFxuICAgICAgICAgICAgICAgIHNpZ2h0OiAzLFxuICAgICAgICAgICAgICAgIG1heEhpdFBvaW50czogNDAwLFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdidWlsZCcsIGNvdW50OiAzMiB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwiZGFtYWdlZFwiLCBjb3VudDogNCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdkYW1hZ2VkLWNvbnN0cnVjdCcsIGNvdW50OiAyMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwiaGVhbHRoeVwiLCBjb3VudDogNCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdoZWFsdGh5LWNvbnN0cnVjdCcsIGNvdW50OiAyMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwidWx0cmEtZGFtYWdlZFwiLCBjb3VudDogMSB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBncmlkU2hhcGU6IFtcbiAgICAgICAgICAgICAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMSwgMV1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlZmluZXJ5Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZWZpbmVyeScsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdUaWJlcml1bSBSZWZpbmVyeScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1aWxkaW5nJyxcbiAgICAgICAgICAgICAgICBwb3dlckluOiA0MCxcbiAgICAgICAgICAgICAgICBwb3dlck91dDogMTAsXG4gICAgICAgICAgICAgICAgY29zdDogMjAwMCxcbiAgICAgICAgICAgICAgICB0aWJlcml1bVN0b3JhZ2U6IDEwMDAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDQsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiA0NTAsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkJywgY291bnQ6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJkYW1hZ2VkXCIsIGNvdW50OiAxMiB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdkYW1hZ2VkLXVubG9hZCcsIGNvdW50OiAxOCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwiaGVhbHRoeVwiLCBjb3VudDogMTIgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnaGVhbHRoeS11bmxvYWQnLCBjb3VudDogMTggfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcInVsdHJhLWRhbWFnZWRcIiwgY291bnQ6IDEgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZ3JpZFNoYXBlOiBbXG4gICAgICAgICAgICAgICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgICAgICAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMSwgMV1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2JhcnJhY2tzJzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdiYXJyYWNrcycsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdCYXJyYWNrcycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1aWxkaW5nJyxcbiAgICAgICAgICAgICAgICBwb3dlckluOiAyMCxcbiAgICAgICAgICAgICAgICBjb3N0OiAzMDAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDMsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiA0MDAsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkJywgY291bnQ6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJkYW1hZ2VkXCIsIGNvdW50OiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwiaGVhbHRoeVwiLCBjb3VudDogMTAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcInVsdHJhLWRhbWFnZWRcIiwgY291bnQ6IDEgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZ3JpZFNoYXBlOiBbWzEsIDFdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3Bvd2VyLXBsYW50Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdwb3dlci1wbGFudCcsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdQb3dlciBQbGFudCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1aWxkaW5nJyxcbiAgICAgICAgICAgICAgICBwb3dlck91dDogMTAwLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDMwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogMixcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDIwMCxcbiAgICAgICAgICAgICAgICBpbWFnZXNUb0xvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnYnVpbGQnLCBjb3VudDogMjAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImRhbWFnZWRcIiwgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImhlYWx0aHlcIiwgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcInVsdHJhLWRhbWFnZWRcIiwgY291bnQ6IDEgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZ3JpZFNoYXBlOiBbWzEsIDBdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2FkdmFuY2VkLXBvd2VyLXBsYW50Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhZHZhbmNlZC1wb3dlci1wbGFudCcsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdBZHZhbmNlZCBQb3dlciBQbGFudCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1aWxkaW5nJyxcbiAgICAgICAgICAgICAgICBwb3dlck91dDogMjAwLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDcwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogMixcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDMwMCxcbiAgICAgICAgICAgICAgICBpbWFnZXNUb0xvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnYnVpbGQnLCBjb3VudDogMjAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImRhbWFnZWRcIiwgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImhlYWx0aHlcIiwgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcInVsdHJhLWRhbWFnZWRcIiwgY291bnQ6IDEgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZ3JpZFNoYXBlOiBbWzEsIDBdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3RpYmVyaXVtLXNpbG8nOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3RpYmVyaXVtLXNpbG8nLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnVGliZXJpdW0gU2lsbycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1aWxkaW5nJyxcbiAgICAgICAgICAgICAgICBwb3dlckluOiAxMCxcbiAgICAgICAgICAgICAgICBjb3N0OiAxNTAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDIsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiAxNTAsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkJywgY291bnQ6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJkYW1hZ2VkXCIsIGNvdW50OiA1IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJoZWFsdGh5XCIsIGNvdW50OiA1IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJ1bHRyYS1kYW1hZ2VkXCIsIGNvdW50OiAxIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGdyaWRTaGFwZTogW1sxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaGFuZC1vZi1ub2QnOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2hhbmQtb2Ytbm9kJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0hhbmQgb2YgTm9kJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYnVpbGRpbmcnLFxuICAgICAgICAgICAgICAgIHBvd2VySW46IDIwLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDMwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogMyxcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDQwMCxcbiAgICAgICAgICAgICAgICBpbWFnZXNUb0xvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnYnVpbGQnLCBjb3VudDogMjAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImRhbWFnZWRcIiwgY291bnQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImhlYWx0aHlcIiwgY291bnQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcInVsdHJhLWRhbWFnZWRcIiwgY291bnQ6IDEgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZ3JpZFNoYXBlOiBbWzAsIDBdLFxuICAgICAgICAgICAgICAgICAgICBbMSwgMV0sXG4gICAgICAgICAgICAgICAgICAgIFsxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2VhcG9ucy1mYWN0b3J5Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICd3ZWFwb25zLWZhY3RvcnknLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnV2VhcG9ucyBGYWN0b3J5JyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYnVpbGRpbmcnLFxuICAgICAgICAgICAgICAgIHBvd2VySW46IDMwLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDIwMDAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDMsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiAyMDAsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkJywgY291bnQ6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJkYW1hZ2VkXCIsIGNvdW50OiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2RhbWFnZWQtYmFzZScsIGNvdW50OiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2RhbWFnZWQtY29uc3RydWN0JywgY291bnQ6IDkgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImhlYWx0aHlcIiwgY291bnQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnaGVhbHRoeS1iYXNlJywgY291bnQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnaGVhbHRoeS1jb25zdHJ1Y3QnLCBjb3VudDogOSB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwidWx0cmEtZGFtYWdlZFwiLCBjb3VudDogMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICd1bHRyYS1kYW1hZ2VkLWJhc2UnLCBjb3VudDogMSB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBncmlkU2hhcGU6IFtbMSwgMSwgMV0sXG4gICAgICAgICAgICAgICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgICAgICAgICAgICAgWzEsIDEsIDFdXVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5wcmVsb2FkQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5sb2FkZWRDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQnVpbGRpbmdzLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKG5hbWUsIGdyaWRTaXplKSB7XG4gICAgICAgIHZhciBkZXRhaWxzID0gdGhpcy5idWlsZGluZ0RldGFpbHNbbmFtZV07XG4gICAgICAgIHZhciBidWlsZGluZyA9IG5hbWUgPT0gdGhpcy5idWlsZGluZ0RldGFpbHMucmVmaW5lcnkubmFtZVxuICAgICAgICAgICAgPyBuZXcgVGliZXJpdW1SZWZpbmVyeSgpXG4gICAgICAgICAgICA6IG5ldyBCdWlsZGluZygpO1xuICAgICAgICBidWlsZGluZy5oaXRQb2ludHMgPSBkZXRhaWxzLm1heEhpdFBvaW50cztcbiAgICAgICAgYnVpbGRpbmcuZ3JpZEhlaWdodCA9IGRldGFpbHMuZ3JpZFNoYXBlLmxlbmd0aDtcbiAgICAgICAgYnVpbGRpbmcuZ3JpZFdpZHRoID0gZGV0YWlscy5ncmlkU2hhcGVbMF0ubGVuZ3RoO1xuICAgICAgICBidWlsZGluZy5waXhlbEhlaWdodCA9IGRldGFpbHMuZ3JpZFNoYXBlLmxlbmd0aCAqIGdyaWRTaXplO1xuICAgICAgICBidWlsZGluZy5waXhlbFdpZHRoID0gZGV0YWlscy5ncmlkU2hhcGVbMF0ubGVuZ3RoICogZ3JpZFNpemU7XG4gICAgICAgIGJ1aWxkaW5nLmJpYkltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ2J1aWxkaW5ncy9iaWIvYmliLScgKyBkZXRhaWxzLmdyaWRTaGFwZVswXS5sZW5ndGggKyAnLmdpZicpO1xuICAgICAgICBidWlsZGluZy5waXhlbE9mZnNldFggPSAwO1xuICAgICAgICBidWlsZGluZy5waXhlbE9mZnNldFkgPSAwO1xuICAgICAgICBidWlsZGluZy5waXhlbFRvcCA9IDA7XG4gICAgICAgIGJ1aWxkaW5nLnBpeGVsTGVmdCA9IDA7XG4gICAgICAgIHRoaXMubG9hZFNwcml0ZVNoZWV0KGJ1aWxkaW5nLCBkZXRhaWxzLCAnYnVpbGRpbmdzJyk7XG4gICAgICAgICQuZXh0ZW5kKGJ1aWxkaW5nLCBkZXRhaWxzKTtcbiAgICAgICAgdGhpcy50eXBlc1tuYW1lXSA9IGJ1aWxkaW5nO1xuICAgIH07XG4gICAgQnVpbGRpbmdzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgICAgICB2YXIgbmV3QnVpbGRpbmcgPSBkZXRhaWxzLm5hbWUgPT0gdGhpcy5idWlsZGluZ0RldGFpbHMucmVmaW5lcnkubmFtZVxuICAgICAgICAgICAgPyBuZXcgVGliZXJpdW1SZWZpbmVyeSgpXG4gICAgICAgICAgICA6IG5ldyBCdWlsZGluZygpO1xuICAgICAgICBuZXdCdWlsZGluZy50ZWFtID0gZGV0YWlscy50ZWFtO1xuICAgICAgICB2YXIgbmFtZSA9IGRldGFpbHMubmFtZTtcbiAgICAgICAgJC5leHRlbmQobmV3QnVpbGRpbmcsIHRoaXMudHlwZXNbbmFtZV0uZGVmYXVsdHMpO1xuICAgICAgICAkLmV4dGVuZChuZXdCdWlsZGluZywgdGhpcy50eXBlc1tuYW1lXSk7XG4gICAgICAgICQuZXh0ZW5kKG5ld0J1aWxkaW5nLCBkZXRhaWxzKTtcbiAgICAgICAgaWYgKGRldGFpbHMuaGl0UG9pbnRzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBuZXdCdWlsZGluZy5oaXRQb2ludHMgPSBkZXRhaWxzLmhpdFBvaW50cztcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3QnVpbGRpbmcuaGl0UG9pbnRzID0gbmV3QnVpbGRpbmcubWF4SGl0UG9pbnRzO1xuICAgICAgICByZXR1cm4gbmV3QnVpbGRpbmc7XG4gICAgfTtcbiAgICByZXR1cm4gQnVpbGRpbmdzO1xufShWaXN1YWxPYmplY3QpKTtcbm1vZHVsZS5leHBvcnRzID0gQnVpbGRpbmdzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QnVpbGRpbmdzLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xudmFyIERlc3RydWN0aWJsZU9iamVjdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRGVzdHJ1Y3RpYmxlT2JqZWN0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERlc3RydWN0aWJsZU9iamVjdCh0eXBlKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCB0eXBlKSB8fCB0aGlzO1xuICAgIH1cbiAgICBEZXN0cnVjdGlibGVPYmplY3QucHJvdG90eXBlLmdldExpZmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaWZlID0gdGhpcy5oaXRQb2ludHMgLyB0aGlzLm1heEhpdFBvaW50cztcbiAgICAgICAgaWYgKGxpZmUgPiAwLjcpIHtcbiAgICAgICAgICAgIHRoaXMubGlmZSA9IFwiaGVhbHRoeVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxpZmUgPiAwLjQpIHtcbiAgICAgICAgICAgIHRoaXMubGlmZSA9IFwiZGFtYWdlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5saWZlID0gXCJ1bHRyYS1kYW1hZ2VkXCI7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERlc3RydWN0aWJsZU9iamVjdC5wcm90b3R5cGUuZHJhd1NlbGVjdGlvbiA9IGZ1bmN0aW9uIChjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuLCBzaWRlYmFyKSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZHJhd1NlbGVjdGlvbi5jYWxsKHRoaXMsIGNvbnRleHQsIGdyaWRTaXplLCBzY3JlZW4sIHNpZGViYXIpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgLy8gTm93IGRyYXcgdGhlIGhlYWx0aCBiYXJcbiAgICAgICAgICAgIHRoaXMuZ2V0TGlmZSgpO1xuICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuZ2V0U2VsZWN0aW9uQm91bmRzKGdyaWRTaXplLCBzY3JlZW4pLCBoZWFsdGhCYXJIZWlnaHQgPSA1O1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQucmVjdChib3VuZHMubGVmdCwgYm91bmRzLnRvcCAtIGhlYWx0aEJhckhlaWdodCAtIDIsIHRoaXMucGl4ZWxXaWR0aCAqIHRoaXMuaGl0UG9pbnRzIC8gdGhpcy5tYXhIaXRQb2ludHMsIGhlYWx0aEJhckhlaWdodCk7XG4gICAgICAgICAgICBpZiAodGhpcy5saWZlID09ICdoZWFsdGh5Jykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ2xpZ2h0Z3JlZW4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5saWZlID09ICdkYW1hZ2VkJykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3llbGxvdyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICBjb250ZXh0LnJlY3QoYm91bmRzLmxlZnQsIGJvdW5kcy50b3AgLSBoZWFsdGhCYXJIZWlnaHQgLSAyLCB0aGlzLnBpeGVsV2lkdGgsIGhlYWx0aEJhckhlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEZXN0cnVjdGlibGVPYmplY3QucHJvdG90eXBlLmZpbmRFbmVtaWVzSW5SYW5nZSA9IGZ1bmN0aW9uIChoZXJvLCBpbmNyZW1lbnQsIHVuaXRzLCBidWlsZGluZ3MsIHR1cnJldHMpIHtcbiAgICAgICAgaWYgKCFpbmNyZW1lbnQpXG4gICAgICAgICAgICBpbmNyZW1lbnQgPSAwO1xuICAgICAgICBpZiAoIWhlcm8pIHtcbiAgICAgICAgICAgIGhlcm8gPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbmVtaWVzID0gW10sIHRlc3Q7XG4gICAgICAgIGZvciAodmFyIGkgPSB1bml0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdGVzdCA9IHVuaXRzW2ldO1xuICAgICAgICAgICAgaWYgKHRlc3QudGVhbSAhPSBoZXJvLnRlYW0gJiYgTWF0aC5wb3codGVzdC54IC0gaGVyby54LCAyKSArIE1hdGgucG93KHRlc3QueSAtIGhlcm8ueSwgMikgPD0gTWF0aC5wb3coaGVyby5zaWdodCArIGluY3JlbWVudCwgMikpIHtcbiAgICAgICAgICAgICAgICBlbmVtaWVzLnB1c2godGVzdCk7XG4gICAgICAgICAgICAgICAgLy9hbGVydChoZXJvLm5hbWUgKyAnOicgK2hlcm8ueCArICcsJyArIGhlcm8ueSsgJyB0b28gY2xvc2UgdG8gJyArIHRlc3QubmFtZSArICc6JyArdGVzdC54ICsgJywnICsgdGVzdC55KSAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgaSA9IGJ1aWxkaW5ncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdGVzdCA9IGJ1aWxkaW5nc1tpXTtcbiAgICAgICAgICAgIGlmICh0ZXN0LnRlYW0gIT0gaGVyby50ZWFtICYmIE1hdGgucG93KHRlc3QueCArIHRlc3QuZ3JpZFdpZHRoIC8gMiAtIGhlcm8ueCwgMikgKyBNYXRoLnBvdyh0ZXN0LnkgKyB0ZXN0LmdyaWRIZWlnaHQgLyAyIC0gaGVyby55LCAyKSA8PSBNYXRoLnBvdyhoZXJvLnNpZ2h0ICsgaW5jcmVtZW50LCAyKSkge1xuICAgICAgICAgICAgICAgIGVuZW1pZXMucHVzaCh0ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSB0dXJyZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB0ZXN0ID0gdHVycmV0c1tpXTtcbiAgICAgICAgICAgIGlmICh0ZXN0LnRlYW0gIT0gaGVyby50ZWFtICYmIE1hdGgucG93KHRlc3QueCArIHRlc3QuZ3JpZFdpZHRoIC8gMiAtIGhlcm8ueCwgMikgKyBNYXRoLnBvdyh0ZXN0LnkgKyB0ZXN0LmdyaWRIZWlnaHQgLyAyIC0gaGVyby55LCAyKSA8PSBNYXRoLnBvdyhoZXJvLnNpZ2h0ICsgaW5jcmVtZW50LCAyKSkge1xuICAgICAgICAgICAgICAgIGVuZW1pZXMucHVzaCh0ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHJldHVybiBlbmVtaWVzO1xuICAgIH07XG4gICAgcmV0dXJuIERlc3RydWN0aWJsZU9iamVjdDtcbn0oR2FtZU9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBEZXN0cnVjdGlibGVPYmplY3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1EZXN0cnVjdGlibGVPYmplY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRm9nID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZvZyhtYXBJbWFnZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZm9nQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuY2FudmFzV2lkdGggPSAxMjg7XG4gICAgICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gMTI4O1xuICAgICAgICBtYXBJbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubWFwV2lkdGggPSBtYXBJbWFnZS53aWR0aDtcbiAgICAgICAgICAgIF90aGlzLm1hcEhlaWdodCA9IG1hcEltYWdlLmhlaWdodDtcbiAgICAgICAgICAgIF90aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEZvZy5wcm90b3R5cGUuaXNPdmVyID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgZnggPSB4ICogdGhpcy5jYW52YXNXaWR0aCAvIHRoaXMubWFwV2lkdGgsIGZ5ID0geSAqIHRoaXMuY2FudmFzSGVpZ2h0IC8gdGhpcy5tYXBIZWlnaHQsIHBpeGVsID0gdGhpcy5mb2dDb250ZXh0LmdldEltYWdlRGF0YShmeCwgZnksIDEsIDEpLmRhdGE7XG4gICAgICAgIC8vYWxlcnQoXCJmb2cgXCIreCtcIixcIit5K1wiIFwiK3BpeGVsWzBdK1wiIFwiK3BpeGVsWzFdK1wiIFwiK3BpeGVsWzJdK1wiIFwiK3BpeGVsWzNdKTtcbiAgICAgICAgcmV0dXJuIChwaXhlbFszXSA9PSAyNTUpO1xuICAgIH07XG4gICAgRm9nLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKG1hcFdpZHRoLCBtYXBIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYXBXaWR0aCA9IG1hcFdpZHRoO1xuICAgICAgICB0aGlzLm1hcEhlaWdodCA9IG1hcEhlaWdodDtcbiAgICAgICAgdGhpcy5mb2dDb250ZXh0ID0gdGhpcy5mb2dDYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSxcbiAgICAgICAgICAgIHRoaXMuZm9nQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwxKSc7XG4gICAgICAgIHRoaXMuZm9nQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgfTtcbiAgICBGb2cucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY29udGV4dCwgdW5pdHMsIGdyaWRTaXplLCBjdXJyZW50VGVhbSwgYnVpbGRpbmdzLCB0dXJyZXRzLCBzY3JlZW4pIHtcbiAgICAgICAgdmFyIGZvZ0NhbnZhcyA9IHRoaXMuZm9nQ2FudmFzO1xuICAgICAgICB2YXIgZm9nQ29udGV4dCA9IHRoaXMuZm9nQ29udGV4dDtcbiAgICAgICAgZm9nQ29udGV4dC5zYXZlKCk7XG4gICAgICAgIGZvZ0NvbnRleHQuc2NhbGUodGhpcy5jYW52YXNXaWR0aCAvIHRoaXMubWFwV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0IC8gdGhpcy5tYXBIZWlnaHQpO1xuICAgICAgICBmb2dDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDIwMCwyMDAsMjAwLDEpJztcbiAgICAgICAgZm9yICh2YXIgaSA9IHVuaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgdW5pdCA9IHVuaXRzW2ldO1xuICAgICAgICAgICAgaWYgKHVuaXQudGVhbSA9PSBjdXJyZW50VGVhbSB8fCB1bml0LmJ1bGxldEZpcmluZykge1xuICAgICAgICAgICAgICAgIGZvZ0NvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW91dFwiO1xuICAgICAgICAgICAgICAgIGZvZ0NvbnRleHQuYXJjKChNYXRoLmZsb29yKHVuaXQueCkgKyAwLjUpICogZ3JpZFNpemUsIChNYXRoLmZsb29yKHVuaXQueSkgKyAwLjUpICogZ3JpZFNpemUsIFxuICAgICAgICAgICAgICAgIC8vZm9nQ29udGV4dC5hcmMoKCh1bml0LngpKzAuNSkqZ2FtZS5ncmlkU2l6ZSwoKHVuaXQueSkrMC41KSpnYW1lLmdyaWRTaXplLFxuICAgICAgICAgICAgICAgICh1bml0LnNpZ2h0ICsgMC41KSAqIGdyaWRTaXplLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIC8vZm9nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDAuMjtcbiAgICAgICAgICAgICAgICBmb2dDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSBidWlsZGluZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBidWlsZCA9IGJ1aWxkaW5nc1tpXTtcbiAgICAgICAgICAgIGlmIChidWlsZC50ZWFtID09IGN1cnJlbnRUZWFtKSB7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBmb2dDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3V0XCI7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5hcmMoKE1hdGguZmxvb3IoYnVpbGQueCkpICogZ3JpZFNpemUgKyBidWlsZC5waXhlbFdpZHRoIC8gMiwgKE1hdGguZmxvb3IoYnVpbGQueSkpICogZ3JpZFNpemUgKyBidWlsZC5waXhlbEhlaWdodCAvIDIsIGJ1aWxkLnNpZ2h0ICogZ3JpZFNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdHVycmV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIHR1cnJldCA9IHR1cnJldHNbaV07XG4gICAgICAgICAgICBpZiAodHVycmV0LnRlYW0gPT0gY3VycmVudFRlYW0gfHwgdHVycmV0LmJ1bGxldEZpcmluZykge1xuICAgICAgICAgICAgICAgIGZvZ0NvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW91dFwiO1xuICAgICAgICAgICAgICAgIGZvZ0NvbnRleHQuYXJjKChNYXRoLmZsb29yKHR1cnJldC54KSkgKiBncmlkU2l6ZSArIHR1cnJldC5waXhlbFdpZHRoIC8gMiwgKE1hdGguZmxvb3IodHVycmV0LnkpKSAqIGdyaWRTaXplICsgdHVycmV0LnBpeGVsSGVpZ2h0IC8gMiwgdHVycmV0LnNpZ2h0ICogZ3JpZFNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZm9nQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb2dDb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5mb2dDYW52YXMsIDAgKyBzY3JlZW4udmlld3BvcnRPZmZzZXQueCAqIHRoaXMuY2FudmFzV2lkdGggLyB0aGlzLm1hcFdpZHRoLCAwICsgc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnkgKiB0aGlzLmNhbnZhc0hlaWdodCAvIHRoaXMubWFwSGVpZ2h0LCBzY3JlZW4udmlld3BvcnQud2lkdGggKiB0aGlzLmNhbnZhc1dpZHRoIC8gdGhpcy5tYXBXaWR0aCwgc2NyZWVuLnZpZXdwb3J0LmhlaWdodCAqIHRoaXMuY2FudmFzSGVpZ2h0IC8gdGhpcy5tYXBIZWlnaHQsIHNjcmVlbi52aWV3cG9ydC5sZWZ0LCBzY3JlZW4udmlld3BvcnQudG9wLCBzY3JlZW4udmlld3BvcnQud2lkdGgsIHNjcmVlbi52aWV3cG9ydC5oZWlnaHQpO1xuICAgIH07XG4gICAgcmV0dXJuIEZvZztcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IEZvZztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZvZy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEdhbWVTY3JlZW4gPSByZXF1aXJlKFwiLi9HYW1lU2NyZWVuXCIpO1xudmFyIFNpZGViYXIgPSByZXF1aXJlKFwiLi9TaWRlYmFyXCIpO1xudmFyIEZvZyA9IHJlcXVpcmUoXCIuL0ZvZ1wiKTtcbnZhciBNb3VzZSA9IHJlcXVpcmUoXCIuL01vdXNlXCIpO1xudmFyIExldmVscyA9IHJlcXVpcmUoXCIuL0xldmVsc1wiKTtcbnZhciBCdWlsZGluZ3MgPSByZXF1aXJlKFwiLi9CdWlsZGluZ3NcIik7XG52YXIgVHVycmV0c0ZhY3RvcnkgPSByZXF1aXJlKFwiLi9UdXJyZXRzXCIpO1xudmFyIEluZmFudHJ5ID0gcmVxdWlyZShcIi4vSW5mYW50cnlGYWN0b3J5XCIpO1xudmFyIFZlaGljbGVzID0gcmVxdWlyZShcIi4vVmVoaWNsZXNcIik7XG52YXIgU291bmRzID0gcmVxdWlyZShcIi4vU291bmRzXCIpO1xudmFyIE92ZXJsYXlGYWN0b3J5ID0gcmVxdWlyZShcIi4vT3ZlcmxheUZhY3RvcnlcIik7XG52YXIgUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpO1xudmFyIEdhbWUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZShjYW52YXMpIHtcbiAgICAgICAgdGhpcy5vYnN0cnVjdGlvbkdyaWQgPSBbXTtcbiAgICAgICAgdGhpcy5idWlsZGluZ09ic3RydWN0aW9uR3JpZCA9IFtdO1xuICAgICAgICB0aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWQgPSBbXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Mb29wID0gbnVsbDtcbiAgICAgICAgdGhpcy50aWJlcml1bUxvb3AgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXR1c0xvb3AgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbnRyb2xHcm91cHMgPSBbXTtcbiAgICAgICAgdGhpcy51bml0cyA9IFtdO1xuICAgICAgICB0aGlzLmJ1aWxkaW5ncyA9IFtdO1xuICAgICAgICB0aGlzLnR1cnJldHMgPSBbXTtcbiAgICAgICAgdGhpcy5vdmVybGF5ID0gW107XG4gICAgICAgIHRoaXMuYnVsbGV0cyA9IFtdO1xuICAgICAgICB0aGlzLm1lc3NhZ2VWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXNzYWdlSGVhZGluZ1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1lc3NhZ2VUZXh0ID0gJ1xcbkNyZWF0ZSBhIGJhc2UgYnkgZGVwbG95aW5nIHlvdXIgTUNWLiBCdWlsZCBhIHBvd2VyIHBsYW50IGFuZCB3ZWFwb25zIGZhY3RvcnkuXFxuXFxuVXNlIHlvdXIgdGFua3MgdG8gZ2V0IHJpZCBvZiBhbGwgZW5lbXkgcHJlc2VuY2UgaW4gdGhlIGFyZWEuJztcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRBdHRhY2tlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFVuaXRzID0gW107XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5zcHJpdGVDYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuc3ByaXRlQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLnNjcmVlbiA9IG5ldyBHYW1lU2NyZWVuKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuc2NyZWVuLnZpZXdwb3J0LnRvcCA9IDM1O1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gMjQ7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uVGltZW91dCA9IDUwO1xuICAgICAgICB0aGlzLmRlYnVnTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwZWVkQWRqdXN0bWVudEZhY3RvciA9IDAuMjtcbiAgICAgICAgdGhpcy5zaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSgpO1xuICAgICAgICB0aGlzLmxldmVscyA9IG5ldyBMZXZlbHMoKTtcbiAgICAgICAgdGhpcy5idWlsZGluZ3NGYWN0b3J5ID0gbmV3IEJ1aWxkaW5ncztcbiAgICAgICAgdGhpcy50dXJyZXRzRmFjdG9yeSA9IG5ldyBUdXJyZXRzRmFjdG9yeSgpO1xuICAgICAgICB0aGlzLmluZmFudHJ5ID0gbmV3IEluZmFudHJ5KCk7XG4gICAgICAgIHRoaXMudmVoaWNsZXMgPSBuZXcgVmVoaWNsZXMoKTtcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBuZXcgU291bmRzKCk7XG4gICAgICAgIHRoaXMub3ZlcmxheUZhY3RvcnkgPSBuZXcgT3ZlcmxheUZhY3RvcnkoKTtcbiAgICB9XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0Vmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5zY3JlZW4udmlld3BvcnQud2lkdGggPSAodGhpcy5zaWRlYmFyLnZpc2libGUpID8gKHRoaXMuc2NyZWVuLndpZHRoIC0gdGhpcy5zaWRlYmFyLndpZHRoKSA6IHRoaXMuc2NyZWVuLndpZHRoO1xuICAgICAgICB0aGlzLnNjcmVlbi52aWV3cG9ydC5oZWlnaHQgPSA0ODA7XG4gICAgICAgIHRoaXMuY29udGV4dC5yZWN0KHRoaXMuc2NyZWVuLnZpZXdwb3J0LmxlZnQsIHRoaXMuc2NyZWVuLnZpZXdwb3J0LnRvcCwgdGhpcy5zY3JlZW4udmlld3BvcnQud2lkdGggLSB0aGlzLnNjcmVlbi52aWV3cG9ydC5sZWZ0LCB0aGlzLnNjcmVlbi52aWV3cG9ydC5oZWlnaHQpO1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xpcCgpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZHJhd01hcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmN1cnJlbnRMZXZlbC5tYXBJbWFnZSwwLDApO1xuICAgICAgICB0aGlzLm1vdXNlLmhhbmRsZVBhbm5pbmcodGhpcy5zY3JlZW4sIHRoaXMuY3VycmVudExldmVsLm1hcEltYWdlLCB0aGlzLnNpZGViYXIpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuY3VycmVudExldmVsLm1hcEltYWdlLCB0aGlzLnNjcmVlbi52aWV3cG9ydE9mZnNldC54LCB0aGlzLnNjcmVlbi52aWV3cG9ydE9mZnNldC55LCB0aGlzLnNjcmVlbi52aWV3cG9ydC53aWR0aCwgdGhpcy5zY3JlZW4udmlld3BvcnQuaGVpZ2h0LCB0aGlzLnNjcmVlbi52aWV3cG9ydC5sZWZ0LCB0aGlzLnNjcmVlbi52aWV3cG9ydC50b3AsIHRoaXMuc2NyZWVuLnZpZXdwb3J0LndpZHRoLCB0aGlzLnNjcmVlbi52aWV3cG9ydC5oZWlnaHQpO1xuICAgICAgICAvLyBDcmVhdGUgYW4gb2JzdHJ1Y3Rpb24gZ3JpZCBmcm9tIHRoZSBsZXZlbCBcbiAgICAgICAgdGhpcy5vYnN0cnVjdGlvbkdyaWQgPSBbXTsgLy8gbm9ybWFsIG9ic3RydWN0aW9uc1xuICAgICAgICB0aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWQgPSBbXTsgLy8gQ2Fubm90IHNlZSBpbiBmb2csIHNvIHByZXRlbmRcbiAgICAgICAgdGhpcy5idWlsZGluZ09ic3RydWN0aW9uR3JpZCA9IFtdOyAvLyBDYW5ub3QgYnVpbGQgb24gZm9nOyBDYW5ub3QgYnVpbGQgb24gYmliXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jdXJyZW50TGV2ZWwub2JzdHJ1Y3Rpb25HcmlkLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9ic3RydWN0aW9uR3JpZFt5XSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5oZXJvT2JzdHJ1Y3Rpb25HcmlkW3ldID0gW107XG4gICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3ldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY3VycmVudExldmVsLm9ic3RydWN0aW9uR3JpZFt5XS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMub2JzdHJ1Y3Rpb25HcmlkW3ldW3hdID0gdGhpcy5jdXJyZW50TGV2ZWwub2JzdHJ1Y3Rpb25HcmlkW3ldW3hdO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVyb09ic3RydWN0aW9uR3JpZFt5XVt4XSA9IHRoaXMuY3VycmVudExldmVsLm9ic3RydWN0aW9uR3JpZFt5XVt4XTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3ldW3hdID0gdGhpcy5jdXJyZW50TGV2ZWwub2JzdHJ1Y3Rpb25HcmlkW3ldW3hdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmJ1aWxkaW5ncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGJsZG5nID0gdGhpcy5idWlsZGluZ3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGJsZG5nLmdyaWRTaGFwZS5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYmxkbmcuZ3JpZFNoYXBlW3ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChibGRuZy5ncmlkU2hhcGVbeV1beF0gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYnN0cnVjdGlvbkdyaWRbeSArIGJsZG5nLnldW3ggKyBibGRuZy54XSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWRbeSArIGJsZG5nLnldW3ggKyBibGRuZy54XSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3kgKyBibGRuZy55XVt4ICsgYmxkbmcueF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbmNsdWRlIGFuIGV4dHJhIHJvdyBmb3IgYmliIGFzIGEgbm8gYnVpbGRpbmcgem9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkgPT0gYmxkbmcuZ3JpZFNoYXBlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3kgKyAxICsgYmxkbmcueV1beCArIGJsZG5nLnhdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnR1cnJldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciB0dXJyZXQgPSB0aGlzLnR1cnJldHNbaV07XG4gICAgICAgICAgICB0aGlzLm9ic3RydWN0aW9uR3JpZFt0dXJyZXQueV1bdHVycmV0LnhdID0gMTtcbiAgICAgICAgICAgIHRoaXMuaGVyb09ic3RydWN0aW9uR3JpZFt0dXJyZXQueV1bdHVycmV0LnhdID0gMTtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdPYnN0cnVjdGlvbkdyaWRbdHVycmV0LnldW3R1cnJldC54XSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy51bml0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIHVuaXQgPSB0aGlzLnVuaXRzW2ldO1xuICAgICAgICAgICAgdmFyIHggPSB1bml0Lng7XG4gICAgICAgICAgICB2YXIgeSA9IHVuaXQueTtcbiAgICAgICAgICAgIC8vdmFyIGNvbGxpc2lvblJhZGl1cyA9IHVuaXQuY29sbGlzaW9uUmFkaXVzL3RoaXMuZ3JpZFNpemU7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW01hdGguZmxvb3IoeSldW01hdGguZmxvb3IoeCldID0gMTtcbiAgICAgICAgICAgIC8vdGhpcy5vYnN0cnVjdGlvbkdyaWRbTWF0aC5mbG9vcih5LWNvbGxpc2lvblJhZGl1cyldW01hdGguZmxvb3IoeC1jb2xsaXNpb25SYWRpdXMpXSA9IDE7XG4gICAgICAgICAgICAvL3RoaXMub2JzdHJ1Y3Rpb25HcmlkW01hdGguZmxvb3IoeS1jb2xsaXNpb25SYWRpdXMpXVtNYXRoLmZsb29yKHgrY29sbGlzaW9uUmFkaXVzKV0gPSAxO1xuICAgICAgICAgICAgLy90aGlzLm9ic3RydWN0aW9uR3JpZFtNYXRoLmZsb29yKHkrY29sbGlzaW9uUmFkaXVzKV1bTWF0aC5mbG9vcih4LWNvbGxpc2lvblJhZGl1cyldID0gMTtcbiAgICAgICAgICAgIC8vdGhpcy5vYnN0cnVjdGlvbkdyaWRbTWF0aC5mbG9vcih5K2NvbGxpc2lvblJhZGl1cyldW01hdGguZmxvb3IoeCtjb2xsaXNpb25SYWRpdXMpXSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5vdmVybGF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgb3ZlciA9IHRoaXMub3ZlcmxheVtpXTtcbiAgICAgICAgICAgIGlmIChvdmVyLm5hbWUgPT0gJ3RyZWUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vYnN0cnVjdGlvbkdyaWRbb3Zlci55XVtvdmVyLnhdID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWRbb3Zlci55XVtvdmVyLnhdID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChvdmVyLm5hbWUgPT0gJ3RyZWVzJykge1xuICAgICAgICAgICAgICAgIHRoaXMub2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54XSA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5vYnN0cnVjdGlvbkdyaWRbb3Zlci55XVtvdmVyLnggKyAxXSA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvT2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54XSA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvT2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54ICsgMV0gPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdPYnN0cnVjdGlvbkdyaWRbb3Zlci55XVtvdmVyLnhdID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54ICsgMV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAob3Zlci5uYW1lID09ICd0aWJlcml1bScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW292ZXIueV1bb3Zlci54XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICAvLyBJZiBoZXJvIGNhbm5vdCBzZWUgdW5kZXIgZm9nLCBoZSBhc3N1bWVzIGhlIGNhbiB0cmF2ZWwgdGhlcmUuLi4gXG4gICAgICAgIC8vIHdoZW4gaGUgc2VlcyB0aGUgYnVpbGRpbmcsIGhlIGdvZXMgb29wcyEhISBhbmQgdGhlbiBzdGFydHMgYXZvaWRpbmcgaXQuLi4uXG4gICAgICAgIC8vIEJ1aWxkaW5ncyBjYW4ndCBiZSBidWlsdCBvbiBmb2cgZWl0aGVyXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5oZXJvT2JzdHJ1Y3Rpb25HcmlkLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuaGVyb09ic3RydWN0aW9uR3JpZFt5XS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvZy5pc092ZXIoKHggKyAwLjUpICogdGhpcy5ncmlkU2l6ZSwgKHkgKyAwLjUpICogdGhpcy5ncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWRbeV1beF0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3ldW3hdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmtleVByZXNzZWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgdmFyIGtleUNvZGUgPSBldi53aGljaDtcbiAgICAgICAgdmFyIGN0cmxQcmVzc2VkID0gZXYuY3RybEtleTtcbiAgICAgICAgLy9rZXlzIGZyb20gMCB0byA5IHByZXNzZWRcbiAgICAgICAgaWYgKGtleUNvZGUgPj0gNDggJiYga2V5Q29kZSA8PSA1Nykge1xuICAgICAgICAgICAgdmFyIGtleU51bWJlciA9IChrZXlDb2RlIC0gNDgpO1xuICAgICAgICAgICAgaWYgKGN0cmxQcmVzc2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3Vwc1trZXlOdW1iZXJdID0gJC5leHRlbmQoW10sIHRoaXMuc2VsZWN0ZWRJdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5TnVtYmVyICsgJyBub3cgaGFzICcgK3RoaXMuY29udHJvbEdyb3Vwc1trZXlOdW1iZXJdLmxlbmd0aCArJyBpdGVtcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nIChcIlByZXNzZWQgQ3RybFwiKyAoa2V5TnVtYmVyLTQ4KSk7ICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9sR3JvdXBzW2tleU51bWJlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nIChcIlByZXNzZWRcIisgKGtleU51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY29udHJvbEdyb3Vwc1trZXlOdW1iZXJdLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuY29udHJvbEdyb3Vwc1trZXlOdW1iZXJdLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9sR3JvdXBzW2tleU51bWJlcl1baV0uc3RhdHVzID09ICdkZXN0cm95Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbEdyb3Vwc1trZXlOdW1iZXJdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmNvbnRyb2xHcm91cHNba2V5TnVtYmVyXVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nICgnc2VsZWN0aW5nICcrdGhpcy5jb250cm9sR3JvdXBzW2tleU51bWJlcl1baV0ubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5oaWdobGlnaHRHcmlkID0gZnVuY3Rpb24gKGksIGosIHdpZHRoLCBoZWlnaHQsIG9wdGlvbmFsSW1hZ2UpIHtcbiAgICAgICAgLy9hbGVydCgnKCcraSsnLCcraisnKScpO1xuICAgICAgICB2YXIgZ3JpZFNpemUgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB2YXIgaXNJbWFnZSA9IG9wdGlvbmFsSW1hZ2UgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8IG9wdGlvbmFsSW1hZ2UgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgaWYgKGlzSW1hZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2Uob3B0aW9uYWxJbWFnZSwgaSAqIGdyaWRTaXplICsgdGhpcy5zY3JlZW4udmlld3BvcnRBZGp1c3QueCwgaiAqIGdyaWRTaXplICsgdGhpcy5zY3JlZW4udmlld3BvcnRBZGp1c3QueSwgd2lkdGggKiBncmlkU2l6ZSwgaGVpZ2h0ICogZ3JpZFNpemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9wdGlvbmFsSW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9uYWxJbWFnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMjUsMjI1LDIyNSwwLjUpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChpICogZ3JpZFNpemUgKyB0aGlzLnNjcmVlbi52aWV3cG9ydEFkanVzdC54LCBqICogZ3JpZFNpemUgKyB0aGlzLnNjcmVlbi52aWV3cG9ydEFkanVzdC55LCB3aWR0aCAqIGdyaWRTaXplLCBoZWlnaHQgKiBncmlkU2l6ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmRyYXdHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ3JpZFNpemUgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB2YXIgbWFwV2lkdGggPSB0aGlzLmN1cnJlbnRMZXZlbC5tYXBJbWFnZS53aWR0aDtcbiAgICAgICAgdmFyIG1hcEhlaWdodCA9IHRoaXMuY3VycmVudExldmVsLm1hcEltYWdlLmhlaWdodDtcbiAgICAgICAgdmFyIHZpZXdwb3J0WCA9IHRoaXMuc2NyZWVuLnZpZXdwb3J0T2Zmc2V0Lng7XG4gICAgICAgIHZhciB2aWV3cG9ydFkgPSB0aGlzLnNjcmVlbi52aWV3cG9ydE9mZnNldC55O1xuICAgICAgICB2YXIgZ3JpZFdpZHRoID0gbWFwV2lkdGggLyBncmlkU2l6ZTtcbiAgICAgICAgdmFyIGdyaWRIZWlnaHQgPSBtYXBIZWlnaHQgLyBncmlkU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgzMCwwLDAsLjYpJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncmlkV2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyhpICogZ3JpZFNpemUgLSB2aWV3cG9ydFggKyB0aGlzLnNjcmVlbi52aWV3cG9ydC5sZWZ0LCAwIC0gdmlld3BvcnRZICsgdGhpcy5zY3JlZW4udmlld3BvcnQudG9wKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oaSAqIGdyaWRTaXplIC0gdmlld3BvcnRYICsgdGhpcy5zY3JlZW4udmlld3BvcnQubGVmdCwgbWFwSGVpZ2h0IC0gdmlld3BvcnRZICsgdGhpcy5zY3JlZW4udmlld3BvcnQudG9wKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWRIZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygwIC0gdmlld3BvcnRYICsgdGhpcy5zY3JlZW4udmlld3BvcnQubGVmdCwgaSAqIGdyaWRTaXplIC0gdmlld3BvcnRZICsgdGhpcy5zY3JlZW4udmlld3BvcnQudG9wKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8obWFwV2lkdGggLSB2aWV3cG9ydFggKyB0aGlzLnNjcmVlbi52aWV3cG9ydC5sZWZ0LCBpICogZ3JpZFNpemUgLSB2aWV3cG9ydFkgKyB0aGlzLnNjcmVlbi52aWV3cG9ydC50b3ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMub2JzdHJ1Y3Rpb25HcmlkLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5vYnN0cnVjdGlvbkdyaWRbaV0ubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZXJvT2JzdHJ1Y3Rpb25HcmlkW2ldW2pdID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRHcmlkKGosIGksIDEsIDEsICdyZ2JhKDEwMCwwLDAsMC41KScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5maXJlQnVsbGV0ID0gZnVuY3Rpb24gKGJ1bGxldCkge1xuICAgICAgICBidWxsZXQueCA9IGJ1bGxldC54IC0gMC41ICogTWF0aC5zaW4oYnVsbGV0LmFuZ2xlKTtcbiAgICAgICAgYnVsbGV0LnkgPSBidWxsZXQueSAtIDAuNSAqIE1hdGguY29zKGJ1bGxldC5hbmdsZSk7XG4gICAgICAgIGJ1bGxldC5yYW5nZSA9IGJ1bGxldC5yYW5nZSAtIDAuNTtcbiAgICAgICAgLy9hbGVydChidWxsZXQueCArJyAnK2J1bGxldC55KVxuICAgICAgICB0aGlzLmJ1bGxldHMucHVzaChidWxsZXQpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgYnVsbGV0LnNvdXJjZS5idWxsZXRGaXJpbmcgPSBmYWxzZTsgfSwgYnVsbGV0LnNvdXJjZS5yZWxvYWRUaW1lKTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmRyYXdCdWxsZXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5idWxsZXRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICB2YXIgYnVsbGV0ID0gdGhpcy5idWxsZXRzW2pdO1xuICAgICAgICAgICAgYnVsbGV0LnNwZWVkID0gNTtcbiAgICAgICAgICAgIGJ1bGxldC5yYW5nZSA9IGJ1bGxldC5yYW5nZSAtIDAuMSAqIGJ1bGxldC5zcGVlZDtcbiAgICAgICAgICAgIGJ1bGxldC54ID0gYnVsbGV0LnggLSAwLjEgKiBidWxsZXQuc3BlZWQgKiBNYXRoLnNpbihidWxsZXQuYW5nbGUpO1xuICAgICAgICAgICAgYnVsbGV0LnkgPSBidWxsZXQueSAtIDAuMSAqIGJ1bGxldC5zcGVlZCAqIE1hdGguY29zKGJ1bGxldC5hbmdsZSk7XG4gICAgICAgICAgICB2YXIgeCA9IChidWxsZXQueCAqIHRoaXMuZ3JpZFNpemUpO1xuICAgICAgICAgICAgdmFyIHkgPSAoYnVsbGV0LnkgKiB0aGlzLmdyaWRTaXplKTtcbiAgICAgICAgICAgIC8vYWxlcnQoeCArICcgJyArIHkpXG4gICAgICAgICAgICBpZiAoIWJ1bGxldC5kZWFkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG92ZXJPYmplY3Q7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudW5pdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudW5pdHNbaV0udW5kZXJQb2ludCAmJiB0aGlzLnVuaXRzW2ldLnVuZGVyUG9pbnQoeCwgeSwgdGhpcy5ncmlkU2l6ZSkgJiYgdGhpcy51bml0c1tpXS50ZWFtICE9IGJ1bGxldC5zb3VyY2UudGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Zlck9iamVjdCA9IHRoaXMudW5pdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuYnVpbGRpbmdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1aWxkaW5nc1tpXS51bmRlclBvaW50KHgsIHksIHRoaXMuZ3JpZFNpemUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyT2JqZWN0ID0gdGhpcy5idWlsZGluZ3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHVycmV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50dXJyZXRzW2ldLnVuZGVyUG9pbnQoeCwgeSwgdGhpcy5ncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJPYmplY3QgPSB0aGlzLnR1cnJldHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgaWYgKG92ZXJPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0LmRlYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KG92ZXJPYmplY3QuaGVhbHRoKTtcbiAgICAgICAgICAgICAgICAgICAgb3Zlck9iamVjdC5oaXRQb2ludHMgPSBvdmVyT2JqZWN0LmhpdFBvaW50cyAtIE1hdGguZmxvb3IoKGJ1bGxldC5kYW1hZ2UgPyBidWxsZXQuZGFtYWdlIDogMTApICsgMTAgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJPYmplY3QuaGl0UG9pbnRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJPYmplY3Quc3RhdHVzID0gJ2Rlc3Ryb3knO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmVkJztcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCArIHRoaXMuc2NyZWVuLnZpZXdwb3J0QWRqdXN0LngsIHkgKyB0aGlzLnNjcmVlbi52aWV3cG9ydEFkanVzdC55LCAyLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vYWxlcnQoeCArJyAnK3kpXG4gICAgICAgICAgICBpZiAoYnVsbGV0LnJhbmdlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvL2J1bGxldC5zb3VyY2UuYnVsbGV0RmlyaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5idWxsZXRzLnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5kcmF3T2JqZWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuYnVpbGRpbmdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5idWlsZGluZ3NbaV0uc3RhdHVzID09ICdkZXN0cm95Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnVuaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy51bml0c1tpXS5zdGF0dXMgPT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bml0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50dXJyZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50dXJyZXRzW2ldLnN0YXR1cyA9PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cnJldHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtc1tpXS5zdGF0dXMgPT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnNlbGVjdGVkQXR0YWNrZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEF0dGFja2Vyc1tpXS5zdGF0dXMgPT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEF0dGFja2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5zZWxlY3RlZFVuaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFVuaXRzW2ldLnN0YXR1cyA9PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVW5pdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgJC5tZXJnZShvYmplY3RzLCB0aGlzLnVuaXRzKTtcbiAgICAgICAgJC5tZXJnZShvYmplY3RzLCB0aGlzLmJ1aWxkaW5ncyk7XG4gICAgICAgICQubWVyZ2Uob2JqZWN0cywgdGhpcy5vdmVybGF5KTtcbiAgICAgICAgJC5tZXJnZShvYmplY3RzLCB0aGlzLnR1cnJldHMpO1xuICAgICAgICB2YXIgY2dZID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai50eXBlID09IFwiYnVpbGRpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoueSArIG9iai5ncmlkU2hhcGUubGVuZ3RoIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmoueTtcbiAgICAgICAgfTtcbiAgICAgICAgb2JqZWN0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gY2dZKGIpIC0gY2dZKGEpO1xuICAgICAgICAgICAgLy9yZXR1cm4gYi55IC0gYS55O1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMub3ZlcmxheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIG92ZXJsYXkgPSB0aGlzLm92ZXJsYXlbaV07XG4gICAgICAgICAgICBpZiAob3ZlcmxheS5uYW1lID09ICd0aWJlcml1bScpIHtcbiAgICAgICAgICAgICAgICBvdmVybGF5LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmN1cnJlbnRQbGF5ZXIudGVhbSwgdGhpcy5ncmlkU2l6ZSwgdGhpcy5zY3JlZW4sIHRoaXMudW5pdHMsIHRoaXMudmVoaWNsZXMsIHRoaXMuc2lkZWJhciwgdGhpcy5lbmVteVBsYXllciwgdGhpcy5kZWJ1Z01vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgaSA9IG9iamVjdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChvYmplY3RzW2ldLm5hbWUgIT0gJ3RpYmVyaXVtJykge1xuICAgICAgICAgICAgICAgIG9iamVjdHNbaV0uZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuY3VycmVudFBsYXllci50ZWFtLCB0aGlzLmdyaWRTaXplLCB0aGlzLnNjcmVlbiwgdGhpcy51bml0cywgdGhpcy52ZWhpY2xlcywgdGhpcy5zaWRlYmFyLCB0aGlzLmVuZW15UGxheWVyLCB0aGlzLmRlYnVnTW9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICAvKmZvciAodmFyIGkgPSB0aGlzLnVuaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgICAgICAgdGhpcy51bml0c1tpXS5kcmF3KCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5idWlsZGluZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgICAgICB0aGlzLmJ1aWxkaW5nc1tpXS5kcmF3KCk7XG4gICAgICAgIH07Ki9cbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLm1vdmVPYmplY3RzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy51bml0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudW5pdHNbaV1bJ3Byb2Nlc3NPcmRlcnMnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMudW5pdHNbaV0ucHJvY2Vzc09yZGVycyh0aGlzLnNwZWVkQWRqdXN0bWVudEZhY3RvciwgdGhpcy51bml0cywgdGhpcy5idWlsZGluZ3MsIHRoaXMudHVycmV0cywgdGhpcy5vdmVybGF5LCB0aGlzLmJ1aWxkaW5nc0ZhY3RvcnksIHRoaXMuZm9nLCB0aGlzLnNvdW5kcywgdGhpcy5jdXJyZW50UGxheWVyLnRlYW0sIHRoaXMub2JzdHJ1Y3Rpb25HcmlkLCB0aGlzLmhlcm9PYnN0cnVjdGlvbkdyaWQsIHRoaXMuZGVidWdNb2RlLCB0aGlzLmNvbnRleHQsIHRoaXMuZ3JpZFNpemUsIHRoaXMuc2NyZWVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudW5pdHNbaV0ubW92ZSh0aGlzLnNwZWVkQWRqdXN0bWVudEZhY3RvciwgdGhpcy5ncmlkU2l6ZSwgdGhpcy5zb3VuZHMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHVycmV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudHVycmV0c1tpXS5wcm9jZXNzT3JkZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJyZXRzW2ldLnByb2Nlc3NPcmRlcnModGhpcy5ncmlkU2l6ZSwgdGhpcy51bml0cywgdGhpcy5idWlsZGluZ3MsIHRoaXMudHVycmV0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnR1cnJldHNbaV0ubW92ZSh0aGlzLnNvdW5kcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2hvd0RlYnVnZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2V0S2V5cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8dWw+JztcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvICE9IFwiZnVuY3Rpb25cIiB8fCBvID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG8gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8bGk+XCIgKyBrZXkgKyBcIiA6IFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IChvLnNyYykucmVwbGFjZSgvXi4raW1hZ2VzXFwvLywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnQXJyYXlbJyArIG8ubGVuZ3RoICsgJ10nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnT2JqZWN0JzsgLy9nZXRLZXlzKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8bGk+XCIgKyBrZXkgKyBcIiA6IFwiICsgbyArIFwiPC9saT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGh0bWwgKz0gXCI8L3VsPlwiO1xuICAgICAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgaHRtbCArPSBcIkxldmVsXCI7XG4gICAgICAgIGh0bWwgKz0gZ2V0S2V5cyh0aGlzLmxldmVscyk7XG4gICAgICAgIGh0bWwgKz0gXCJNb3VzZVwiO1xuICAgICAgICBodG1sICs9IGdldEtleXModGhpcy5tb3VzZSk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gXCJTZWxlY3RlZCBJdGVtXCI7XG4gICAgICAgICAgICBodG1sICs9IGdldEtleXModGhpcy5zZWxlY3RlZEl0ZW1zWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBodG1sICs9IFwiR2FtZVwiO1xuICAgICAgICBodG1sICs9IGdldEtleXModGhpcyk7XG4gICAgICAgIGh0bWwgKz0gXCJTaWRlYmFyXCI7XG4gICAgICAgIGh0bWwgKz0gZ2V0S2V5cyh0aGlzLnNpZGViYXIpO1xuICAgICAgICBodG1sICs9IFwiVmVoaWNsZXNcIjtcbiAgICAgICAgaHRtbCArPSBnZXRLZXlzKHRoaXMudmVoaWNsZXMpO1xuICAgICAgICBodG1sICs9IFwiQnVpbGRpbmdzXCI7XG4gICAgICAgIGh0bWwgKz0gZ2V0S2V5cyh0aGlzLmJ1aWxkaW5ncyk7XG4gICAgICAgIGh0bWwgKz0gXCJJbmZhbnRyeVwiO1xuICAgICAgICBodG1sICs9IGdldEtleXModGhpcy5pbmZhbnRyeSk7XG4gICAgICAgICQoJyNkZWJ1Z2dlcicpLmh0bWwoaHRtbCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBtYWluIGFuaW1hdGlvbiBsb29wIG9uY2UgZ2FtZSBoYXMgc3RhcnRlZFxuICAgICAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0RlYnVnZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmxldmVscy5sb2FkZWQgfHwgIXRoaXMuc2lkZWJhci5sb2FkZWRcbiAgICAgICAgICAgIHx8ICF0aGlzLnZlaGljbGVzLmxvYWRlZCB8fCAhdGhpcy5pbmZhbnRyeS5sb2FkZWQgfHwgIXRoaXMuYnVpbGRpbmdzRmFjdG9yeS5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgLy8gRHJhdyB0aGUgdG9wIHBhbmVsc1xuICAgICAgICAvLyBEcmF3IHNpZGViYXIgaWYgYXBwcm9wcmlhdGVcbiAgICAgICAgLy8gc2V0IHZpZXdwb3J0XG4gICAgICAgIHRoaXMuc2lkZWJhci5kcmF3KHRoaXMudW5pdHMsIHRoaXMuYnVpbGRpbmdzLCB0aGlzLmluZmFudHJ5LCB0aGlzLnZlaGljbGVzLCB0aGlzLmNvbnRleHQsIHRoaXMuc291bmRzLCB0aGlzLnNwcml0ZUNvbnRleHQsIHRoaXMuc3ByaXRlQ2FudmFzLCB0aGlzLnNjcmVlbiwgdGhpcy5jdXJyZW50UGxheWVyLnRlYW0pO1xuICAgICAgICB0aGlzLnNldFZpZXdwb3J0KCk7XG4gICAgICAgIHRoaXMuZHJhd01hcCgpO1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyaWQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEcmF3IHRoZSBtYXBcbiAgICAgICAgLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gVGVzdCBzY3JpcHRlZCBldmVudHMgYW5kIGhhbmRsZVxuICAgICAgICAvLyBEcmF3IHRoZSBvdmVybGF5XG4gICAgICAgIC8vIERyYXcgdGhlIGJ1aWxkaW5nc1xuICAgICAgICAvLyBBbnkgYW5pbWF0aW9uIGlmIG5lY2Vzc2FyeVxuICAgICAgICB0aGlzLm1vdmVPYmplY3RzKCk7XG4gICAgICAgIC8vIERyYXcgdGhlIHVuaXRzXG4gICAgICAgIHRoaXMuZHJhd09iamVjdHMoKTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5kcmF3QnVsbGV0cygpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWdNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmZvZy5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy51bml0cywgdGhpcy5ncmlkU2l6ZSwgdGhpcy5jdXJyZW50UGxheWVyLnRlYW0sIHRoaXMuYnVpbGRpbmdzLCB0aGlzLnR1cnJldHMsIHRoaXMuc2NyZWVuKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB0aGlzLmRyYXdNZXNzYWdlKCk7XG4gICAgICAgIC8vIHNob3cgYXBwcm9wcmlhdGUgbW91c2UgY3Vyc29yXG4gICAgICAgIHRoaXMubW91c2UuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuc2NyZWVuLCB0aGlzLmN1cnJlbnRMZXZlbCwgdGhpcy5vdmVybGF5LCB0aGlzLnNpZGViYXIsIHRoaXMuYnVpbGRpbmdzRmFjdG9yeSwgdGhpcy5idWlsZGluZ3MsIHRoaXMudHVycmV0c0ZhY3RvcnksIHRoaXMudHVycmV0cywgdGhpcy52ZWhpY2xlcywgdGhpcy5pbmZhbnRyeSwgdGhpcy51bml0cywgdGhpcy5zZWxlY3RlZFVuaXRzLCB0aGlzLnNlbGVjdGVkQXR0YWNrZXJzLCB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkLCB0aGlzLm9ic3RydWN0aW9uR3JpZCwgdGhpcy5ncmlkU2l6ZSwgZnVuY3Rpb24gKGksIGosIHcsIGgsIGltZykgeyByZXR1cm4gX3RoaXMuaGlnaGxpZ2h0R3JpZChpLCBqLCB3LCBoLCBpbWcpOyB9KTtcbiAgICAgICAgLy8vdGhpcy5taXNzaW9uU3RhdHVzKCk7XG4gICAgICAgIC8vXG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5kcmF3TWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1lc3NhZ2VWaXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnNpZGViYXIubWVzc2FnZUJveCwgdGhpcy5zY3JlZW4udmlld3BvcnQubGVmdCArIDIyLCB0aGlzLnNjcmVlbi52aWV3cG9ydC50b3AgKyAxNTApO1xuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZUhlYWRpbmdWaXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgyNjUsIDE5OCwgMTIwLCAyMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICdncmVlbic7XG4gICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gJzE2cHggXCJDb21tYW5kIGFuZCBDb25xdWVyXCInO1xuICAgICAgICB2YXIgbXNncyA9IHRoaXMubWVzc2FnZVRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChtc2dzW2ldLCB0aGlzLnNjcmVlbi52aWV3cG9ydC5sZWZ0ICsgODAsIHRoaXMuc2NyZWVuLnZpZXdwb3J0LnRvcCArIDIwMCArIGkgKiAxOCk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZGlzcGxheU1lc3NhZ2UgPSBmdW5jdGlvbiAodGV4dCwgZGlzcGxheUhlYWRlcikge1xuICAgICAgICB0aGlzLm1lc3NhZ2VUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5tZXNzYWdlVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubWVzc2FnZUhlYWRpbmdWaXNpYmxlID0gISFkaXNwbGF5SGVhZGVyO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubWlzc2lvblN0YXR1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW0sIGhlcm9Vbml0cyA9IFtdLCBoZXJvQnVpbGRpbmdzID0gW10sIGhlcm9UdXJyZXRzID0gW10sIHZpbGxhaW5CdWlsZGluZ3MgPSBbXSwgdmlsbGFpblVuaXRzID0gW10sIHZpbGxhaW5UdXJyZXRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnVuaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpdGVtID0gdGhpcy51bml0c1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnRlYW0gPT0gdGhpcy5jdXJyZW50TGV2ZWwudGVhbSkge1xuICAgICAgICAgICAgICAgIGhlcm9Vbml0cy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmlsbGFpblVuaXRzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5idWlsZGluZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLmJ1aWxkaW5nc1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnRlYW0gPT0gdGhpcy5jdXJyZW50TGV2ZWwudGVhbSkge1xuICAgICAgICAgICAgICAgIGhlcm9CdWlsZGluZ3MucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpbGxhaW5CdWlsZGluZ3MucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnR1cnJldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLnR1cnJldHNbaV07XG4gICAgICAgICAgICBpZiAoaXRlbS50ZWFtID09IHRoaXMuY3VycmVudExldmVsLnRlYW0pIHtcbiAgICAgICAgICAgICAgICBoZXJvVHVycmV0cy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmlsbGFpblR1cnJldHMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIC8vYWxlcnQoaGVyb0J1aWxkaW5ncy5sZW5ndGgpXG4gICAgICAgIGlmIChoZXJvVW5pdHMubGVuZ3RoID09IDAgJiYgaGVyb0J1aWxkaW5ncy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy9taXNzaW9uIGZhaWxlZDtcbiAgICAgICAgICAgIHRoaXMuc291bmRzLnBsYXkoJ21pc3Npb25fZmFpbHVyZScpO1xuICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgICAgIC8vYWxlcnQoJ0dhbWUgb3ZlciBcXG4gSWYgeW91IGxpa2VkIHRoaXMsIHBsZWFzZSBzaGFyZSB3aXRoIHlvdXIgZnJpZW5kcyB1c2luZyB0aGUgTGlrZSBidXR0b24gYW5kIGxlYXZlIG1lIGEgY29tbWVudCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWxsYWluVHVycmV0cy5sZW5ndGggPT0gMCAmJiB2aWxsYWluQnVpbGRpbmdzLmxlbmd0aCA9PSAwICYmIHZpbGxhaW5Vbml0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy9taXNzaW9uIGFjY29tcGxpc2hlZFxuICAgICAgICAgICAgdGhpcy5zb3VuZHMucGxheSgnbWlzc2lvbl9hY2NvbXBsaXNoZWQnKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICAvL2FsZXJ0KCdHYW1lIG92ZXIgXFxuIElmIHlvdSBsaWtlZCB0aGlzLCBwbGVhc2Ugc2hhcmUgd2l0aCB5b3VyIGZyaWVuZHMgdXNpbmcgdGhlIExpa2UgYnV0dG9uIGFuZCBsZWF2ZSBtZSBhIGNvbW1lbnQnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuY2xlYXJTZWxlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1tpXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRBdHRhY2tlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFVuaXRzID0gW107XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5zZWxlY3RJdGVtID0gZnVuY3Rpb24gKGl0ZW0sIHNoaWZ0UHJlc3NlZCkge1xuICAgICAgICBpZiAoc2hpZnRQcmVzc2VkICYmIGl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIC8vIGRlc2VsZWN0IGl0ZW1cbiAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBlbHNlIGlmICgoaSA9IHRoaXMuc2VsZWN0ZWRVbml0cy5pbmRleE9mKGl0ZW0pKSA+PSAwKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRVbml0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBlbHNlIGlmICgoaSA9IHRoaXMuc2VsZWN0ZWRBdHRhY2tlcnMuaW5kZXhPZihpdGVtKSkgPj0gMClcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQXR0YWNrZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIC8vYWxlcnQoMSlcbiAgICAgICAgaWYgKGl0ZW0udHlwZSAhPSAnYnVpbGRpbmcnICYmIGl0ZW0udGVhbSA9PSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkVW5pdHMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRzLnBsYXkoaXRlbS50eXBlICsgJ19zZWxlY3QnKTtcbiAgICAgICAgICAgIGlmIChpdGVtLnByaW1hcnlXZWFwb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQXR0YWNrZXJzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24gKGV2LCByaWdodENsaWNrKSB7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VWaXNpYmxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tb3VzZS54ID49IDI5MCAmJiB0aGlzLm1vdXNlLnggPD0gMzUwICYmIHRoaXMubW91c2UueSA+PSAzMTAgJiYgdGhpcy5tb3VzZS55IDw9IDMyNSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZVZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGVjdGVkT2JqZWN0ID0gdGhpcy5tb3VzZS5jaGVja092ZXJPYmplY3QodGhpcy5vdmVybGF5LCB0aGlzLmJ1aWxkaW5ncywgdGhpcy50dXJyZXRzLCB0aGlzLnVuaXRzLCB0aGlzLmdyaWRTaXplKTtcbiAgICAgICAgaWYgKHJpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc2lkZWJhci5yZXBhaXJNb2RlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNpZGViYXIuZGVwbG95TW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zaWRlYmFyLnNlbGxNb2RlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2lkZWJhci5yZXBhaXJNb2RlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPYmplY3QgJiYgc2VsZWN0ZWRPYmplY3QudGVhbSA9PSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtXG4gICAgICAgICAgICAgICAgJiYgKHNlbGVjdGVkT2JqZWN0LnR5cGUgPT0gJ2J1aWxkaW5nJyB8fCBzZWxlY3RlZE9iamVjdC50eXBlID09ICd0dXJyZXQnKSAmJiAoc2VsZWN0ZWRPYmplY3QuaGl0UG9pbnRzIDwgc2VsZWN0ZWRPYmplY3QubWF4SGl0UG9pbnRzKSkge1xuICAgICAgICAgICAgICAgIC8vIGRvIHJlcGFpclxuICAgICAgICAgICAgICAgIC8vYWxlcnQoJ3JlcGFpcmluZycpXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRPYmplY3QucmVwYWlyaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnNpZGViYXIuZGVwbG95TW9kZSkge1xuICAgICAgICAgICAgLy9pZiAoYnVpbGRpbmdzLmNhbkNvbnN0cnVjdChzaWRlYmFyLmRlcGxveUJ1aWxkaW5nLG1vdXNlLmdyaWRYLG1vdXNlLmdyaWRZKSl7XG4gICAgICAgICAgICB2YXIgYnVpbGRpbmdUeXBlID0gdGhpcy5idWlsZGluZ3NGYWN0b3J5LnR5cGVzW3RoaXMuc2lkZWJhci5kZXBsb3lCdWlsZGluZ10gfHwgdGhpcy50dXJyZXRzRmFjdG9yeS50eXBlc1t0aGlzLnNpZGViYXIuZGVwbG95QnVpbGRpbmddO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSAkLmV4dGVuZChbXSwgYnVpbGRpbmdUeXBlLmdyaWRTaGFwZSk7XG4gICAgICAgICAgICBncmlkLnB1c2goZ3JpZFtncmlkLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIC8vZ3JpZC5wdXNoKGdyaWRbMV0pO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncmlkW3ldW3hdID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJtb3VzZS5ncmlkWCt4XCIrKG1vdXNlLmdyaWRYK3gpK1wibW91c2UuZ3JpZFkreTpcIisobW91c2UuZ3JpZFkreSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3VzZS5ncmlkWSArIHkgPCAwIHx8IHRoaXMubW91c2UuZ3JpZFkgKyB5ID49IHRoaXMuYnVpbGRpbmdPYnN0cnVjdGlvbkdyaWQubGVuZ3RoIHx8IHRoaXMubW91c2UuZ3JpZFggKyB4IDwgMCB8fCB0aGlzLm1vdXNlLmdyaWRYICsgeCA+PSB0aGlzLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3RoaXMubW91c2UuZ3JpZFkgKyB5XS5sZW5ndGggfHwgdGhpcy5idWlsZGluZ09ic3RydWN0aW9uR3JpZFt0aGlzLm1vdXNlLmdyaWRZICsgeV1bdGhpcy5tb3VzZS5ncmlkWCArIHhdID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kcy5wbGF5KCdjYW5ub3RfZGVwbG95X2hlcmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpZGViYXIuZmluaXNoRGVwbG95aW5nQnVpbGRpbmcodGhpcy5idWlsZGluZ3MsIHRoaXMuYnVpbGRpbmdzRmFjdG9yeSwgdGhpcy50dXJyZXRzLCB0aGlzLnR1cnJldHNGYWN0b3J5LCB0aGlzLnNvdW5kcywgdGhpcy5tb3VzZSwgdGhpcy5jdXJyZW50UGxheWVyLnRlYW0pO1xuICAgICAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgc291bmRzLnBsYXkoJ2Nhbm5vdF9kZXBsb3lfaGVyZScpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zaWRlYmFyLnNlbGxNb2RlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPYmplY3QgJiYgc2VsZWN0ZWRPYmplY3QudGVhbSA9PSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtXG4gICAgICAgICAgICAgICAgJiYgKHNlbGVjdGVkT2JqZWN0LnR5cGUgPT0gJ2J1aWxkaW5nJyB8fCBzZWxlY3RlZE9iamVjdC50eXBlID09ICd0dXJyZXQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICdyZWZpbmVyeScgJiYgc2VsZWN0ZWRPYmplY3Quc3RhdHVzID09ICd1bmxvYWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaGFydmVzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW06IHNlbGVjdGVkT2JqZWN0LnRlYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBzZWxlY3RlZE9iamVjdC54ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogc2VsZWN0ZWRPYmplY3QueSArIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRQb2ludHM6IHNlbGVjdGVkT2JqZWN0LmhhcnZlc3Rlci5oaXRQb2ludHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRGlyZWN0aW9uOiAxNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyczogeyB0eXBlOiAnZ3VhcmQnIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE9iamVjdC5oYXJ2ZXN0ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9iamVjdC5zdGF0dXMgPSAnc2VsbCc7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZHMucGxheSgnc2VsbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2lkZWJhci5jYXNoICs9IHNlbGVjdGVkT2JqZWN0LmNvc3QgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFyaWdodENsaWNrICYmICF0aGlzLm1vdXNlLmRyYWdTZWxlY3QpIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkVW5pdHMubGVuZ3RoID09IDEgJiYgc2VsZWN0ZWRPYmplY3Quc2VsZWN0ZWQgJiYgc2VsZWN0ZWRPYmplY3QudGVhbSA9PSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICdtY3YnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBidWlsZGluZyBkZXBsb3ltZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE9iamVjdC5vcmRlcnMgPSB7IHR5cGU6ICdidWlsZCcgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoJ3B1dCBhIGJ1aWxkaW5nIGhlcmUnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWRVbml0cy5sZW5ndGggPT0gMSAmJiB0aGlzLnNlbGVjdGVkVW5pdHNbMF0ubmFtZSA9PSAnaGFydmVzdGVyJ1xuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnNlbGVjdGVkVW5pdHNbMF0udGVhbSA9PSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtXG4gICAgICAgICAgICAgICAgICAgICYmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICd0aWJlcml1bScgfHwgc2VsZWN0ZWRPYmplY3QubmFtZSA9PSAncmVmaW5lcnknKSAmJiAhdGhpcy5tb3VzZS5pc092ZXJGb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9NeSB0ZWFtJ3MgaGFydmVzdGVyIGlzIHNlbGVjdGVkIGFsb25lXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICd0aWJlcml1bScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRVbml0c1swXS5vcmRlcnMgPSB7IHR5cGU6ICdoYXJ2ZXN0JywgdG86IHsgeDogc2VsZWN0ZWRPYmplY3QueCwgeTogc2VsZWN0ZWRPYmplY3QueSB9IH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kcy5wbGF5KCd2ZWhpY2xlX21vdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRPYmplY3QubmFtZSA9PSAncmVmaW5lcnknICYmIHNlbGVjdGVkT2JqZWN0LnRlYW0gPT0gdGhpcy5jdXJyZW50TGV2ZWwudGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFVuaXRzWzBdLm9yZGVycyA9IHsgdHlwZTogJ2hhcnZlc3QtcmV0dXJuJywgdG86IHNlbGVjdGVkT2JqZWN0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kcy5wbGF5KCd2ZWhpY2xlX21vdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxlY3RlZE9iamVjdC50ZWFtID09IHRoaXMuY3VycmVudExldmVsLnRlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFldi5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShzZWxlY3RlZE9iamVjdCwgZXYuc2hpZnRLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkQXR0YWNrZXJzLmxlbmd0aCA+IDAgJiYgc2VsZWN0ZWRPYmplY3QubmFtZSAhPSAndGliZXJpdW0nICYmICF0aGlzLm1vdXNlLmlzT3ZlckZvZykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5zZWxlY3RlZEF0dGFja2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRBdHRhY2tlcnNbaV0ucHJpbWFyeVdlYXBvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRBdHRhY2tlcnNbaV0ub3JkZXJzID0geyB0eXBlOiAnYXR0YWNrJywgdGFyZ2V0OiBzZWxlY3RlZE9iamVjdCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzLnBsYXkodGhpcy5zZWxlY3RlZEF0dGFja2Vyc1tpXS50eXBlICsgJ19tb3ZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICd0aWJlcml1bScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRVbml0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vYnN0cnVjdGlvbkdyaWRbdGhpcy5tb3VzZS5ncmlkWV0gJiYgdGhpcy5vYnN0cnVjdGlvbkdyaWRbdGhpcy5tb3VzZS5ncmlkWV1bdGhpcy5tb3VzZS5ncmlkWF0gPT0gMSAmJiAhdGhpcy5tb3VzZS5pc092ZXJGb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRVbml0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVW5pdHNbaV0ub3JkZXJzID0geyB0eXBlOiAnbW92ZScsIHRvOiB7IHg6IHRoaXMubW91c2UuZ3JpZFgsIHk6IHRoaXMubW91c2UuZ3JpZFkgfSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kcy5wbGF5KHRoaXMuc2VsZWN0ZWRVbml0c1tpXS50eXBlICsgJ19tb3ZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFldi5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShzZWxlY3RlZE9iamVjdCwgZXYuc2hpZnRLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvLyBubyBvYmplY3QgdW5kZXIgbW91c2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFVuaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub2JzdHJ1Y3Rpb25HcmlkW3RoaXMubW91c2UuZ3JpZFldICYmIHRoaXMub2JzdHJ1Y3Rpb25HcmlkW3RoaXMubW91c2UuZ3JpZFldW3RoaXMubW91c2UuZ3JpZFhdID09IDEgJiYgIXRoaXMubW91c2UuaXNPdmVyRm9nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRVbml0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRVbml0c1tpXS5vcmRlcnMgPSB7IHR5cGU6ICdtb3ZlJywgdG86IHsgeDogdGhpcy5tb3VzZS5ncmlkWCwgeTogdGhpcy5tb3VzZS5ncmlkWSB9IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZHMucGxheSh0aGlzLnNlbGVjdGVkVW5pdHNbaV0udHlwZSArICdfbW92ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgLy8gU2hvdyBtYWluIG1lbnUgc2NyZWVuXG4gICAgICAgIC8vIFdhaXQgZm9yIGxldmVsIGNsaWNrXG4gICAgICAgIC8vJChjYW52YXMpLmNzcyhcImN1cnNvclwiLCBcImN1cnNvcjp1cmwoY3Vyc29ycy9ibGFuay5wbmcpLG5vbmUgIWltcG9ydGFudDtcIik7XG4gICAgICAgIC8vIGxvYWQgYWxsIHNvdW5kc1xuICAgICAgICAvLyBsb2FkIGxldmVsXG4gICAgICAgIHRoaXMubW91c2UubG9hZEFsbEN1cnNvcnMoKTtcbiAgICAgICAgdGhpcy5zb3VuZHMubG9hZEFsbCgpO1xuICAgICAgICB0aGlzLm92ZXJsYXlGYWN0b3J5LmxvYWRBbGwoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwgPSB0aGlzLmxldmVscy5sb2FkKCdnZGkxJywgdGhpcy5idWlsZGluZ3NGYWN0b3J5LCB0aGlzLnR1cnJldHNGYWN0b3J5LCB0aGlzLnZlaGljbGVzLCB0aGlzLmluZmFudHJ5LCB0aGlzLm92ZXJsYXlGYWN0b3J5LCB0aGlzLmdyaWRTaXplKTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gbmV3IFBsYXllcih0aGlzLmN1cnJlbnRMZXZlbC50ZWFtLCB0aGlzLmN1cnJlbnRMZXZlbC5zdGFydGluZ0Nhc2gpO1xuICAgICAgICB0aGlzLmVuZW15UGxheWVyID0gbmV3IFBsYXllcih0aGlzLmN1cnJlbnRMZXZlbC5lbmVteVRlYW0sIHRoaXMuY3VycmVudExldmVsLnN0YXJ0aW5nRW5lbXlDYXNoKTtcbiAgICAgICAgdGhpcy5vdmVybGF5ID0gdGhpcy5jdXJyZW50TGV2ZWwub3ZlcmxheTtcbiAgICAgICAgLy90aGlzLnRlYW0gPSB0aGlzLmN1cnJlbnRMZXZlbC50ZWFtO1xuICAgICAgICB0aGlzLmZvZyA9IG5ldyBGb2codGhpcy5jdXJyZW50TGV2ZWwubWFwSW1hZ2UpO1xuICAgICAgICB0aGlzLnNpZGViYXIubG9hZCh0aGlzLmN1cnJlbnRQbGF5ZXIuY2FzaCwgdGhpcy5zY3JlZW4sIHRoaXMuY2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5saXN0ZW5FdmVudHMoKTtcbiAgICAgICAgdGhpcy5mb2cuaW5pdCh0aGlzLmN1cnJlbnRMZXZlbC5tYXBJbWFnZS53aWR0aCwgdGhpcy5jdXJyZW50TGV2ZWwubWFwSW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5zY3JlZW4udmlld3BvcnRPZmZzZXQueCA9IDk2O1xuICAgICAgICB0aGlzLnNjcmVlbi52aWV3cG9ydE9mZnNldC55ID0gMjY0O1xuICAgICAgICB0aGlzLnNpZGViYXIudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvLyBFbmVteSBTdHVmZlxuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogOCwgeTogNiwgdHVycmV0RGlyZWN0aW9uOiAxNiwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogOSwgeTogMywgdHVycmV0RGlyZWN0aW9uOiAxNiwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogNywgeTogNSwgdHVycmV0RGlyZWN0aW9uOiAxNiwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogOCwgeTogMiwgdHVycmV0RGlyZWN0aW9uOiAxNiwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogMTYsIHk6IDI1LCB0dXJyZXREaXJlY3Rpb246IDI0LCB0ZWFtOiAnbm9kJyB9KSk7XG4gICAgICAgIHRoaXMudHVycmV0cy5wdXNoKHRoaXMudHVycmV0c0ZhY3RvcnkuYWRkKHsgbmFtZTogJ2d1bi10dXJyZXQnLCB4OiAxMywgeTogMjYsIHR1cnJldERpcmVjdGlvbjogMjQsIHRlYW06ICdub2QnIH0pKTtcbiAgICAgICAgdGhpcy50dXJyZXRzLnB1c2godGhpcy50dXJyZXRzRmFjdG9yeS5hZGQoeyBuYW1lOiAnZ3VuLXR1cnJldCcsIHg6IDExLCB5OiAyMywgdHVycmV0RGlyZWN0aW9uOiAxOCwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLnR1cnJldHMucHVzaCh0aGlzLnR1cnJldHNGYWN0b3J5LmFkZCh7IG5hbWU6ICdndW4tdHVycmV0JywgeDogMTAsIHk6IDI0LCB0dXJyZXREaXJlY3Rpb246IDIwLCB0ZWFtOiAnbm9kJyB9KSk7XG4gICAgICAgIHRoaXMudHVycmV0cy5wdXNoKHRoaXMudHVycmV0c0ZhY3RvcnkuYWRkKHsgbmFtZTogJ2d1bi10dXJyZXQnLCB4OiA5LCB5OiAyNSwgdHVycmV0RGlyZWN0aW9uOiAyNCwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICAvL3RoaXMudHVycmV0cy5wdXNoKHRoaXMudHVycmV0c0ZhY3RvcnkuYWRkKHtuYW1lOidndW4tdHVycmV0Jyx4OjkseToyNix0dXJyZXREaXJlY3Rpb246MjYsdGVhbTonbm9kJ30pKTtcbiAgICAgICAgdGhpcy5idWlsZGluZ3MucHVzaCh0aGlzLmJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHsgbmFtZTogJ3JlZmluZXJ5JywgdGVhbTogJ25vZCcsIHg6IDI2LCB5OiA4LCBzdGF0dXM6ICdidWlsZCcsIGhpdFBvaW50czogMjAwIH0pKTtcbiAgICAgICAgLy90aGlzLnVuaXRzLnB1c2godGhpcy52ZWhpY2xlcy5hZGQoe25hbWU6J2hhcnZlc3RlcicsdGVhbTonbm9kJyx4OjI0LHk6MTgsbW92ZURpcmVjdGlvbjowfSkpO1xuICAgICAgICAvL3RoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7bmFtZTonaGFydmVzdGVyJyx4OjI1LHk6MTgsbW92ZURpcmVjdGlvbjowfSkpO1xuICAgICAgICB0aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoeyBuYW1lOiAnY29uc3RydWN0aW9uLXlhcmQnLCB4OiAxLCB5OiAxNCwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoeyBuYW1lOiAncG93ZXItcGxhbnQnLCB4OiA1LCB5OiAxNCwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICB0aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoeyBuYW1lOiAnaGFuZC1vZi1ub2QnLCB4OiA1LCB5OiAxOSwgdGVhbTogJ25vZCcgfSkpO1xuICAgICAgICAvL3RoaXMuYnVpbGRpbmdzLnB1c2godGhpcy5idWlsZGluZ3NGYWN0b3J5LmFkZCh7bmFtZTonYmFycmFja3MnLHg6NCx5OjE0LHRlYW06J25vZCd9KSk7ICAgICAgICAgICAgIFxuICAgICAgICAvL3RoaXMuYnVpbGRpbmdzLnB1c2godGhpcy5idWlsZGluZ3NGYWN0b3J5LmFkZCh7bmFtZToncG93ZXItcGxhbnQnLHg6MTgseToxMCxoZWFsdGg6MjAwLHRlYW06J25vZCd9KSk7IFxuICAgICAgICB0aGlzLnVuaXRzLnB1c2godGhpcy52ZWhpY2xlcy5hZGQoeyBuYW1lOiAnbGlnaHQtdGFuaycsIHg6IDcsIHk6IDYsIHRlYW06ICdub2QnLCBvcmRlcnM6IHsgdHlwZTogJ3BhdHJvbCcsIGZyb206IHsgeDogOSwgeTogMjQgfSwgdG86IHsgeDogMTIsIHk6IDggfSB9IH0pKTtcbiAgICAgICAgdGhpcy51bml0cy5wdXNoKHRoaXMudmVoaWNsZXMuYWRkKHsgbmFtZTogJ2xpZ2h0LXRhbmsnLCB4OiAyLCB5OiAyMCwgdGVhbTogJ25vZCcsIG9yZGVyczogeyB0eXBlOiAncGF0cm9sJywgZnJvbTogeyB4OiAyLCB5OiA1IH0sIHRvOiB7IHg6IDYsIHk6IDIwIH0gfSB9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdsaWdodC10YW5rJywgeDogNSwgeTogMTAsIHRlYW06ICdub2QnLCBvcmRlcnM6IHsgdHlwZTogJ3BhdHJvbCcsIGZyb206IHsgeDogMTcsIHk6IDEyIH0sIHRvOiB7IHg6IDIyLCB5OiAyIH0gfSB9KSk7XG4gICAgICAgIC8vdGhpcy51bml0cy5wdXNoKHRoaXMudmVoaWNsZXMuYWRkKHtuYW1lOidsaWdodC10YW5rJyx4OjIseToyLHRlYW06J25vZCcsb3JkZXJzOnt0eXBlOidwYXRyb2wnLGZyb206e3g6MjUseTo1fSx0bzp7eDoxNyx5OjI1fX19KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdsaWdodC10YW5rJywgeDogNCwgeTogMjMsIHRlYW06ICdub2QnLCBvcmRlcnM6IHsgdHlwZTogJ3BhdHJvbCcsIGZyb206IHsgeDogNCwgeTogMjMgfSwgdG86IHsgeDogMjIsIHk6IDI1IH0gfSB9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdsaWdodC10YW5rJywgeDogMiwgeTogMTAsIHRlYW06ICdub2QnLCBvcmRlcnM6IHsgdHlwZTogJ3Byb3RlY3QnLCB0YXJnZXQ6IHRoaXMudW5pdHNbMF0gfSB9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdtY3YnLCB4OiAyMy41LCB5OiAyMy41LCB0ZWFtOiAnZ2RpJywgbW92ZURpcmVjdGlvbjogMCwgb3JkZXJzOiB7IHR5cGU6ICdtb3ZlJywgdG86IHsgeDogMjMsIHk6IDIxIH0gfSB9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdsaWdodC10YW5rJywgeDogMjMsIHk6IDI3LCB0ZWFtOiAnZ2RpJywgbW92ZURpcmVjdGlvbjogMCwgb3JkZXJzOiB7IHR5cGU6ICdtb3ZlJywgdG86IHsgeDogMjIsIHk6IDIzIH0gfSB9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7IG5hbWU6ICdsaWdodC10YW5rJywgeDogMjQsIHk6IDI3LCB0ZWFtOiAnZ2RpJywgbW92ZURpcmVjdGlvbjogMCwgb3JkZXJzOiB7IHR5cGU6ICdtb3ZlJywgdG86IHsgeDogMjQsIHk6IDIzIH0gfSB9KSk7XG4gICAgICAgIC8vdGhpcy5idWlsZGluZ3MucHVzaCh0aGlzLmJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHtuYW1lOid3ZWFwb25zLWZhY3RvcnknLHg6MTgseTo2fSkpO1xuICAgICAgICAvL3RoaXMuYnVpbGRpbmdzLnB1c2godGhpcy5idWlsZGluZ3NGYWN0b3J5LmFkZCh7bmFtZTond2VhcG9ucy1mYWN0b3J5Jyx4OjI0LHk6MTh9KSk7XG4gICAgICAgIC8vdGhpcy51bml0cy5wdXNoKHRoaXMudmVoaWNsZXMuYWRkKHtuYW1lOidtY3YnLHg6Nyx5OjQsbW92ZURpcmVjdGlvbjo4fSkpO1xuICAgICAgICAvL3RoaXMudW5pdHMucHVzaCh0aGlzLmluZmFudHJ5LmFkZCh7bmFtZTonbWluaWd1bm5lcicseDoyNyx5OjEyLHRlYW06J25vZCd9KSk7XG4gICAgICAgIC8vdGhpcy51bml0cy5wdXNoKHRoaXMuaW5mYW50cnkuYWRkKHtuYW1lOidtaW5pZ3VubmVyJyx4OjYseToyMix0ZWFtOidub2QnfSkpO1xuICAgICAgICAvL3RoaXMudW5pdHMucHVzaCh0aGlzLmluZmFudHJ5LmFkZCh7bmFtZTonbWluaWd1bm5lcicseDo1LHk6MjIsdGVhbTonbm9kJ30pKTtcbiAgICAgICAgLy90aGlzLnVuaXRzLnB1c2godGhpcy5pbmZhbnRyeS5hZGQoe25hbWU6J21pbmlndW5uZXInLHg6MjgseToxMix0ZWFtOidub2QnfSkpO1xuICAgICAgICAvL3RoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7bmFtZTonbGlnaHQtdGFuaycseDoyMyx5OjI1LG1vdmVEaXJlY3Rpb246MH0pKTtcbiAgICAgICAgLy9zb3VuZHMucGxheSgncmVpbmZvcmNlbWVudHNfaGF2ZV9hcnJpdmVkJyk7XG4gICAgICAgIC8vdGhpcy51bml0cy5wdXNoKHRoaXMuaW5mYW50cnkuYWRkKHtuYW1lOidtaW5pZ3VubmVyJyx4OjgseToxM30pKTtcbiAgICAgICAgLy90aGlzLnVuaXRzLnB1c2godGhpcy52ZWhpY2xlcy5hZGQoe25hbWU6J2xpZ2h0LXRhbmsnLHg6NSx5OjEzLG9yZGVyczp7dHlwZToncGF0cm9sJyxmcm9tOnt4OjUseToxM30sdG86e3g6NCx5OjR9fSx0ZWFtOidub2QnfSkpOyBcbiAgICAgICAgLy90aGlzLnVuaXRzLnB1c2godGhpcy52ZWhpY2xlcy5hZGQoe25hbWU6J2xpZ2h0LXRhbmsnLHg6MTYseTo4LG9yZGVyczp7dHlwZToncHJvdGVjdCcsdGFyZ2V0OnRoaXMudW5pdHNbM119fSkpO1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLnVuaXRzLnB1c2godGhpcy5pbmZhbnRyeS5hZGQoe25hbWU6J21pbmlndW5uZXInLHg6Nyx5OjEzLHRlYW06J25vZCd9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7bmFtZTonbGlnaHQtdGFuaycseDo1LHk6MTMsb3JkZXJzOnt0eXBlOidwYXRyb2wnLGZyb206e3g6NSx5OjEzfSx0bzp7eDo0LHk6NH19LHRlYW06J25vZCd9KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7bmFtZTonbGlnaHQtdGFuaycseDoxNix5Ojgsb3JkZXJzOnt0eXBlOidwcm90ZWN0Jyx0YXJnZXQ6dGhpcy51bml0c1szXX19KSk7XG4gICAgICAgIHRoaXMudW5pdHMucHVzaCh0aGlzLnZlaGljbGVzLmFkZCh7bmFtZTonbGlnaHQtdGFuaycseDoxMCx5OjEwLG9yZGVyczp7dHlwZToncHJvdGVjdCcsdGFyZ2V0OnRoaXMudW5pdHNbMF19LHRlYW06J25vZCd9KSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnVuaXRzLnB1c2godGhpcy50dXJyZXRzLmFkZCh7bmFtZTonZ3VuLXR1cnJldCcseDoxMix5OjEzLG1vdmVEaXJlY3Rpb246OSx0ZWFtOidub2QnfSkpO1xuICAgICAgICBcbiAgICAgICAgKi9cbiAgICAgICAgLy90aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J3Bvd2VyLXBsYW50Jyx4OjEyLHk6OCxoZWFsdGg6MTAwLHByaW1hcnlCdWlsZGluZzp0cnVlfSkpOyBcbiAgICAgICAgLy90aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J2NvbnN0cnVjdGlvbi15YXJkJyx4OjkseTo0LHByaW1hcnlCdWlsZGluZzp0cnVlfSkpOyBcbiAgICAgICAgLy90aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J2JhcnJhY2tzJyx4OjEyLHk6NCxzdGF0dXM6J2J1aWxkJ30pKTtcbiAgICAgICAgLy90aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J3dlYXBvbnMtZmFjdG9yeScseDoxNSx5OjEyfSkpOyBcbiAgICAgICAgLyp0aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J2NvbnN0cnVjdGlvbi15YXJkJyx4OjMseTo5LHN0YXR1czonYnVpbGQnLHRlYW06J25vZCd9KSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5idWlsZGluZ3MucHVzaCh0aGlzLmJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHtuYW1lOidiYXJyYWNrcycseDoxMix5OjR9KSk7XG4gICAgICAgIHRoaXMuYnVpbGRpbmdzLnB1c2godGhpcy5idWlsZGluZ3NGYWN0b3J5LmFkZCh7bmFtZTonYmFycmFja3MnLHg6MTQseTo0LHRlYW06J25vZCd9KSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJ1aWxkaW5ncy5wdXNoKHRoaXMuYnVpbGRpbmdzRmFjdG9yeS5hZGQoe25hbWU6J3Bvd2VyLXBsYW50Jyx4OjEyLHk6OCxzdGF0dXM6J2J1aWxkJyxoZWFsdGg6MTAwLHByaW1hcnlCdWlsZGluZzp0cnVlfSkpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5idWlsZGluZ3MucHVzaCh0aGlzLmJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHtuYW1lOidwb3dlci1wbGFudCcseDoxOCx5OjEwLHN0YXR1czonYnVpbGQnLGhlYWx0aDoyMDAsdGVhbTonbm9kJ30pKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYnVpbGRpbmdzLnB1c2godGhpcy5idWlsZGluZ3NGYWN0b3J5LmFkZCh7bmFtZTond2VhcG9ucy1mYWN0b3J5Jyx4OjE1LHk6MTIsc3RhdHVzOidjb25zdHJ1Y3QnLGhlYWx0aDoyMDB9KSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5idWlsZGluZ3MucHVzaCh0aGlzLmJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHtuYW1lOid3ZWFwb25zLWZhY3RvcnknLHg6MTMseToxNixzdGF0dXM6J2J1aWxkJyxoZWFsdGg6MjAwLHRlYW06J25vZCd9KSk7XG4gICAgICAgIFxuICAgICAgICAqL1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkxvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5hbmltYXRlKCk7IH0sIHRoaXMuYW5pbWF0aW9uVGltZW91dCk7XG4gICAgICAgIHRoaXMudGliZXJpdW1Mb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGhpcy5vdmVybGF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG92ZXJsYXkgPSBfdGhpcy5vdmVybGF5W2ldO1xuICAgICAgICAgICAgICAgIGlmIChvdmVybGF5Lm5hbWUgPT0gJ3RpYmVyaXVtJyAmJiBvdmVybGF5LnN0YWdlIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5zdGFnZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25UaW1lb3V0ICogNDAgKiA2MDApO1xuICAgICAgICB0aGlzLnN0YXR1c0xvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5taXNzaW9uU3RhdHVzKCk7IH0sIDMwMDApO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvL2NsZWFySW50ZXJ2YWwodGhpcy5hbmltYXRpb25Mb29wKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXR1c0xvb3ApO1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGliZXJpdW1Mb29wKTtcbiAgICAgICAgdGhpcy5zaWRlYmFyLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZSgnVGhhbmsgeW91IGZvciB0cnlpbmcgdGhpcyBkZW1vLidcbiAgICAgICAgICAgICsgJ1RoaXMgaXMgc3RpbGwgYSB3b3JrIGluIHByb2dyZXNzLiBcXG5BbnkgY29tbWVudHMsIGZlZWRiYWNrIChpbmNsdWRpbmcgYnVncyksIGFuZCBhZHZpY2UgaXMgYXBwcmVjaWF0ZWQuXFxuXFxuSWYgeW91IGxpa2VkIHRoaXMgZGVtbywgcGxlYXNlIHNoYXJlIHRoaXMgcGFnZSB3aXRoIGFsbCB5b3VyIGZyaWVuZHMuICcpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubGlzdGVuRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkKF90aGlzLmNhbnZhcykub2Zmc2V0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZS54ID0gZXYucGFnZVggLSBvZmZzZXQubGVmdDtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlLnkgPSBldi5wYWdlWSAtIG9mZnNldC50b3A7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZS5ncmlkWCA9IE1hdGguZmxvb3IoKF90aGlzLm1vdXNlLmdhbWVYKSAvIF90aGlzLmdyaWRTaXplKTtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlLmdyaWRZID0gTWF0aC5mbG9vcigoX3RoaXMubW91c2UuZ2FtZVkpIC8gX3RoaXMuZ3JpZFNpemUpO1xuICAgICAgICAgICAgX3RoaXMubW91c2UuaXNPdmVyRm9nID0gX3RoaXMuZm9nLmlzT3ZlcihfdGhpcy5tb3VzZS5nYW1lWCwgX3RoaXMubW91c2UuZ2FtZVkpO1xuICAgICAgICAgICAgLy90aGlzLnBhbkRpcmVjdGlvbiA9IHRoaXMuaGFuZGxlUGFubmluZygpO1xuICAgICAgICAgICAgLy90aGlzLnNob3dBcHByb3ByaWF0ZUN1cnNvcigpO1xuICAgICAgICAgICAgaWYgKF90aGlzLm1vdXNlLmJ1dHRvblByZXNzZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXMubW91c2UuZHJhZ1ggLSBfdGhpcy5tb3VzZS5nYW1lWCkgPiA1IHx8XG4gICAgICAgICAgICAgICAgICAgIE1hdGguYWJzKF90aGlzLm1vdXNlLmRyYWdZIC0gX3RoaXMubW91c2UuZ2FtZVkpID4gNSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5kcmFnU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5kcmFnU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgLy9IYW5kbGUgY2xpY2sgaG90c3BvdHNcbiAgICAgICAgICAgIF90aGlzLm1vdXNlLmNsaWNrKGV2LCBmYWxzZSwgX3RoaXMuc2lkZWJhciwgX3RoaXMuc2NyZWVuLCBfdGhpcy5zb3VuZHMsIGZ1bmN0aW9uIChlLCByKSB7IHJldHVybiBfdGhpcy5jbGljayhlLCByKTsgfSk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZS5kcmFnU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi53aGljaCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UuYnV0dG9uUHJlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UuZHJhZ1ggPSBfdGhpcy5tb3VzZS5nYW1lWDtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5kcmFnWSA9IF90aGlzLm1vdXNlLmdhbWVZO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgX3RoaXMubW91c2UuY2xpY2soZXYsIHRydWUsIF90aGlzLnNpZGViYXIsIF90aGlzLnNjcmVlbiwgX3RoaXMuc291bmRzLCBmdW5jdGlvbiAoZSwgcikgeyByZXR1cm4gX3RoaXMuY2xpY2soZSwgcik7IH0pO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi53aGljaCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm1vdXNlLmRyYWdTZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFldi5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgeDEgPSBNYXRoLm1pbihfdGhpcy5tb3VzZS5nYW1lWCwgX3RoaXMubW91c2UuZHJhZ1gpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgeTEgPSBNYXRoLm1pbihfdGhpcy5tb3VzZS5nYW1lWSwgX3RoaXMubW91c2UuZHJhZ1kpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgeDIgPSBNYXRoLm1heChfdGhpcy5tb3VzZS5nYW1lWCwgX3RoaXMubW91c2UuZHJhZ1gpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgeTIgPSBNYXRoLm1heChfdGhpcy5tb3VzZS5nYW1lWSwgX3RoaXMubW91c2UuZHJhZ1kpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gX3RoaXMudW5pdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bml0ID0gX3RoaXMudW5pdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuaXQuc2VsZWN0ZWQgJiYgdW5pdC50ZWFtID09IF90aGlzLmN1cnJlbnRMZXZlbC50ZWFtICYmIHgxIDw9IHVuaXQueCAqIF90aGlzLmdyaWRTaXplICYmIHgyID49IHVuaXQueCAqIF90aGlzLmdyaWRTaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgeTEgPD0gdW5pdC55ICogX3RoaXMuZ3JpZFNpemUgJiYgeTIgPj0gdW5pdC55ICogX3RoaXMuZ3JpZFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RJdGVtKHVuaXQsIGV2LnNoaWZ0S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kcmFnU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLmJ1dHRvblByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlLmluc2lkZUNhbnZhcyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgX3RoaXMubW91c2UuYnV0dG9uUHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXMubW91c2UuaW5zaWRlQ2FudmFzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBfdGhpcy5rZXlQcmVzc2VkKGV2KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gR2FtZTtcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1HYW1lLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUmVjdGFuZ2xlID0gcmVxdWlyZShcIi4vUmVjdGFuZ2xlXCIpO1xudmFyIEdhbWVPYmplY3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU9iamVjdCh0eXBlKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIEdhbWVPYmplY3QucHJvdG90eXBlLnVuZGVyUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSwgZ3JpZFNpemUpIHtcbiAgICAgICAgdmFyIHhvID0gdGhpcy54ICogZ3JpZFNpemUgKyB0aGlzLnBpeGVsT2Zmc2V0WDtcbiAgICAgICAgdmFyIHlvID0gdGhpcy55ICogZ3JpZFNpemUgKyB0aGlzLnBpeGVsT2Zmc2V0WTtcbiAgICAgICAgdmFyIHgxID0geG8gKyB0aGlzLnBpeGVsTGVmdDtcbiAgICAgICAgdmFyIHkxID0geW8gKyB0aGlzLnBpeGVsVG9wO1xuICAgICAgICB2YXIgeDIgPSB4MSArIHRoaXMucGl4ZWxXaWR0aDtcbiAgICAgICAgdmFyIHkyID0geTEgKyB0aGlzLnBpeGVsSGVpZ2h0O1xuICAgICAgICAvL1xuICAgICAgICByZXR1cm4geCA+PSB4MSAmJiB4IDw9IHgyICYmIHkgPj0geTEgJiYgeSA8PSB5MjtcbiAgICB9O1xuICAgIEdhbWVPYmplY3QucHJvdG90eXBlLmRyYXdTZWxlY3Rpb24gPSBmdW5jdGlvbiAoY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbiwgc2lkZWJhcikge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlV2lkdGggPSA0O1xuICAgICAgICAgICAgdmFyIHNlbGVjdEJhclNpemUgPSA1O1xuICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuZ2V0U2VsZWN0aW9uQm91bmRzKGdyaWRTaXplLCBzY3JlZW4pO1xuICAgICAgICAgICAgLy8gRmlyc3QgZHJhdyB0aGUgd2hpdGUgYnJhY2tldFxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIC8vYWxlcnQoeDEpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oYm91bmRzLmxlZnQsIGJvdW5kcy50b3AgKyBzZWxlY3RCYXJTaXplKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5sZWZ0LCBib3VuZHMudG9wKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5sZWZ0ICsgc2VsZWN0QmFyU2l6ZSwgYm91bmRzLnRvcCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhib3VuZHMucmlnaHQgLSBzZWxlY3RCYXJTaXplLCBib3VuZHMudG9wKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5yaWdodCwgYm91bmRzLnRvcCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhib3VuZHMucmlnaHQsIGJvdW5kcy50b3AgKyBzZWxlY3RCYXJTaXplKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGJvdW5kcy5yaWdodCwgYm91bmRzLmJvdHRvbSAtIHNlbGVjdEJhclNpemUpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oYm91bmRzLnJpZ2h0LCBib3VuZHMuYm90dG9tKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5yaWdodCAtIHNlbGVjdEJhclNpemUsIGJvdW5kcy5ib3R0b20pO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oYm91bmRzLmxlZnQgKyBzZWxlY3RCYXJTaXplLCBib3VuZHMuYm90dG9tKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5sZWZ0LCBib3VuZHMuYm90dG9tKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGJvdW5kcy5sZWZ0LCBib3VuZHMuYm90dG9tIC0gc2VsZWN0QmFyU2l6ZSk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lT2JqZWN0LnByb3RvdHlwZS5nZXRTZWxlY3Rpb25Cb3VuZHMgPSBmdW5jdGlvbiAoZ3JpZFNpemUsIHNjcmVlbikge1xuICAgICAgICB2YXIgeCA9IHRoaXMueCAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnggKyB0aGlzLnBpeGVsT2Zmc2V0WDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnkgKiBncmlkU2l6ZSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC55ICsgdGhpcy5waXhlbE9mZnNldFk7XG4gICAgICAgIHZhciB4MSA9IHggKyB0aGlzLnBpeGVsTGVmdDtcbiAgICAgICAgdmFyIHkxID0geSArIHRoaXMucGl4ZWxUb3A7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgxLCB5MSwgdGhpcy5waXhlbFdpZHRoLCB0aGlzLnBpeGVsSGVpZ2h0KTtcbiAgICB9O1xuICAgIEdhbWVPYmplY3QucHJvdG90eXBlLmZpbmRBbmdsZSA9IGZ1bmN0aW9uIChvYmplY3QsIHVuaXQsIGJhc2UpIHtcbiAgICAgICAgaWYgKHVuaXQgPT09IHZvaWQgMCkgeyB1bml0ID0gdGhpczsgfVxuICAgICAgICBpZiAoYmFzZSA9PT0gdm9pZCAwKSB7IGJhc2UgPSAzMjsgfVxuICAgICAgICB2YXIgZHkgPSBvYmplY3QueSAtIHVuaXQueTtcbiAgICAgICAgdmFyIGR4ID0gb2JqZWN0LnggLSB1bml0Lng7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT0gJ3R1cnJldCcpIHtcbiAgICAgICAgICAgIGR5ID0gZHkgLSAwLjU7XG4gICAgICAgICAgICBkeCA9IGR4IC0gMC41O1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbmdsZSA9IGJhc2UgLyAyICsgTWF0aC5yb3VuZChNYXRoLmF0YW4yKGR4LCBkeSkgKiBiYXNlIC8gKDIgKiBNYXRoLlBJKSk7XG4gICAgICAgIGlmIChhbmdsZSA8IDApIHtcbiAgICAgICAgICAgIGFuZ2xlICs9IGJhc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuZ2xlID49IGJhc2UpIHtcbiAgICAgICAgICAgIGFuZ2xlIC09IGJhc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH07XG4gICAgR2FtZU9iamVjdC5wcm90b3R5cGUuYWRkQW5nbGUgPSBmdW5jdGlvbiAoYW5nbGUsIGluY3JlbWVudCwgYmFzZSkge1xuICAgICAgICBhbmdsZSA9IE1hdGgucm91bmQoYW5nbGUpICsgaW5jcmVtZW50O1xuICAgICAgICBpZiAoYW5nbGUgPiBiYXNlIC0gMSkge1xuICAgICAgICAgICAgYW5nbGUgLT0gYmFzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5nbGUgPCAwKSB7XG4gICAgICAgICAgICBhbmdsZSArPSBiYXNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmdsZTtcbiAgICB9O1xuICAgIEdhbWVPYmplY3QucHJvdG90eXBlLmFuZ2xlRGlmZiA9IGZ1bmN0aW9uIChhbmdsZTEsIGFuZ2xlMiwgYmFzZSkge1xuICAgICAgICBhbmdsZTEgPSBNYXRoLmZsb29yKGFuZ2xlMSk7XG4gICAgICAgIGFuZ2xlMiA9IE1hdGguZmxvb3IoYW5nbGUyKTtcbiAgICAgICAgaWYgKGFuZ2xlMSA+PSBiYXNlIC8gMikge1xuICAgICAgICAgICAgYW5nbGUxID0gYW5nbGUxIC0gYmFzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5nbGUyID49IGJhc2UgLyAyKSB7XG4gICAgICAgICAgICBhbmdsZTIgPSBhbmdsZTIgLSBiYXNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWZmID0gYW5nbGUyIC0gYW5nbGUxO1xuICAgICAgICBpZiAoZGlmZiA8IC1iYXNlIC8gMikge1xuICAgICAgICAgICAgZGlmZiArPSBiYXNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmID4gYmFzZSAvIDIpIHtcbiAgICAgICAgICAgIGRpZmYgLT0gYmFzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZjtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lT2JqZWN0O1xufSgpKTtcbm1vZHVsZS5leHBvcnRzID0gR2FtZU9iamVjdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUdhbWVPYmplY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUG9pbnQgPSByZXF1aXJlKFwiLi9Qb2ludFwiKTtcbnZhciBSZWN0YW5nbGUgPSByZXF1aXJlKFwiLi9SZWN0YW5nbGVcIik7XG52YXIgR2FtZVNjcmVlbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHYW1lU2NyZWVuKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYXBJbWFnZVNpemUgPSB7XG4gICAgICAgICAgICB3aWR0aDogMCwgaGVpZ2h0OiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDAsIDApO1xuICAgICAgICB0aGlzLnZpZXdwb3J0T2Zmc2V0ID0gbmV3IFBvaW50KDAsIDApO1xuICAgICAgICB0aGlzLnZpZXdwb3J0RGVsdGEgPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMudmlld3BvcnRBZGp1c3QgPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgfVxuICAgIHJldHVybiBHYW1lU2NyZWVuO1xufSgpKTtcbm1vZHVsZS5leHBvcnRzID0gR2FtZVNjcmVlbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUdhbWVTY3JlZW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIFZlaGljbGUgPSByZXF1aXJlKFwiLi9WZWhpY2xlXCIpO1xudmFyIEhhcnZlc3RlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSGFydmVzdGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEhhcnZlc3RlcigpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBIYXJ2ZXN0ZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY29udGV4dCwgY3VyUGxheWVyVGVhbSwgZ3JpZFNpemUsIHNjcmVlbiwgdW5pdHMsIHZlaGljbGVzRmFjdG9yeSwgc2lkZWJhciwgZW5lbXksIGRlYnVnTW9kZSkge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRyYXcuY2FsbCh0aGlzLCBjb250ZXh0LCBjdXJQbGF5ZXJUZWFtLCBncmlkU2l6ZSwgc2NyZWVuLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSwgZGVidWdNb2RlKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzICE9ICcnKSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2VMaXN0ID0gdGhpcy5zcHJpdGVBcnJheVt0aGlzLnN0YXR1c107XG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb25JbmRleCAvIHRoaXMuYW5pbWF0aW9uU3BlZWQgPj0gaW1hZ2VMaXN0LmNvdW50KSB7XG4gICAgICAgICAgICAgICAgLy9hbGVydCh0aGlzLmFuaW1hdGlvbkluZGV4ICsgJyAvICcrIHRoaXMuYW5pbWF0aW9uU3BlZWQpXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzLmluZGV4T2YoJ2hhcnZlc3QnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50aWJlcml1bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWJlcml1bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWJlcml1bSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50aWJlcml1bSAlIDUgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMudG8uc3RhZ2UtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhhcnZlc3Rlci5wcm90b3R5cGUucHJvY2Vzc09yZGVycyA9IGZ1bmN0aW9uIChzcGVlZEFkanVzdG1lbnRGYWN0b3IsIHVuaXRzLCBidWlsZGluZ3MsIHR1cnJldHMsIGFsbE92ZXJsYXlzLCBidWlsZGluZ3NGYWN0b3J5LCBmb2csIHNvdW5kcywgY3VyUGxheWVyVGVhbSwgb2JzdHJ1Y3Rpb25HcmlkLCBoZXJvT2JzdHJ1Y3Rpb25HcmlkLCBkZWJ1Z01vZGUsIGNvbnRleHQsIGdyaWRTaXplLCBzY3JlZW4pIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5wcm9jZXNzT3JkZXJzLmNhbGwodGhpcywgc3BlZWRBZGp1c3RtZW50RmFjdG9yLCB1bml0cywgYnVpbGRpbmdzLCB0dXJyZXRzLCBhbGxPdmVybGF5cywgYnVpbGRpbmdzRmFjdG9yeSwgZm9nLCBzb3VuZHMsIGN1clBsYXllclRlYW0sIG9ic3RydWN0aW9uR3JpZCwgaGVyb09ic3RydWN0aW9uR3JpZCwgZGVidWdNb2RlLCBjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuKTtcbiAgICAgICAgaWYgKHRoaXMub3JkZXJzLnR5cGUgPT0gJ2hhcnZlc3QnKSB7XG4gICAgICAgICAgICB0aGlzLm9yZGVycyA9IHRoaXMucHJvY2Vzc0hhcnZlc3RPcmRlcih0aGlzLm9yZGVycywgYWxsT3ZlcmxheXMsIHVuaXRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIHNwZWVkQWRqdXN0bWVudEZhY3RvciwgZGVidWdNb2RlLCBjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuLCBmb2cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXJzLnR5cGUgPT0gJ2hhcnZlc3QtcmV0dXJuJykge1xuICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB0aGlzLnByb2Nlc3NIYXJ2ZXN0UmV0dXJuT3JkZXIodGhpcy5vcmRlcnMsIGFsbE92ZXJsYXlzLCB1bml0cywgYnVpbGRpbmdzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIHNwZWVkQWRqdXN0bWVudEZhY3RvciwgZGVidWdNb2RlLCBjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuLCBmb2cpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIYXJ2ZXN0ZXIucHJvdG90eXBlLnByb2Nlc3NIYXJ2ZXN0T3JkZXIgPSBmdW5jdGlvbiAob3JkZXIsIGFsbE92ZXJsYXlzLCB1bml0cywgY3VyUGxheWVyVGVhbSwgb2JzdHJ1Y3Rpb25HcmlkLCBoZXJvT2JzdHJ1Y3Rpb25HcmlkLCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbiwgZm9nKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIGlmICghb3JkZXIudG8pIHtcbiAgICAgICAgICAgIG9yZGVyLnRvID0gdGhpcy5maW5kVGliZXJpdW1JblJhbmdlKHRoaXMsIGFsbE92ZXJsYXlzLCBncmlkU2l6ZSwgZm9nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9yZGVyLnRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aWJlcml1bSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IHsgdHlwZTogJ2hhcnZlc3QtcmV0dXJuJyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhNYXRoLnBvdyhvcmRlci50by55ICsgMC41IC0gdGhpcy55LCAyKSArIE1hdGgucG93KG9yZGVyLnRvLnggKyAwLjUgLSB0aGlzLngsIDIpLCAwLjUpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgPiAxLjUgKiB0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgLyBncmlkU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8odGhpcy5vcmRlcnMudG8sIGZhbHNlLCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIHVuaXRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aWJlcml1bSAmJiB0aGlzLnRpYmVyaXVtID49IDE0KSB7XG4gICAgICAgICAgICAgICAgcmVzID0geyB0eXBlOiAnaGFydmVzdC1yZXR1cm4nLCB0bzogb3JkZXIuZnJvbSwgZnJvbTogb3JkZXIudG8gfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9yZGVyLnRvLnN0YWdlIDwgMSkge1xuICAgICAgICAgICAgICAgIG9yZGVyLnRvID0gdGhpcy5maW5kVGliZXJpdW1JblJhbmdlKHRoaXMsIGFsbE92ZXJsYXlzLCBncmlkU2l6ZSwgZm9nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy50aWJlcml1bSB8fCB0aGlzLnRpYmVyaXVtIDwgMTQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gXCJoYXJ2ZXN0LVwiICsgKChNYXRoLmZsb29yKHRoaXMubW92ZURpcmVjdGlvbiAvIDQpICogNCkgPCAxMCA/ICcwJyA6ICcnKSArIChNYXRoLmZsb29yKHRoaXMubW92ZURpcmVjdGlvbiAvIDQpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gb3JkZXI7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgICBIYXJ2ZXN0ZXIucHJvdG90eXBlLnByb2Nlc3NIYXJ2ZXN0UmV0dXJuT3JkZXIgPSBmdW5jdGlvbiAob3JkZXJzLCBhbGxPdmVybGF5cywgdW5pdHMsIGJ1aWxkaW5ncywgY3VyUGxheWVyVGVhbSwgb2JzdHJ1Y3Rpb25HcmlkLCBoZXJvT2JzdHJ1Y3Rpb25HcmlkLCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbiwgZm9nKSB7XG4gICAgICAgIHZhciByZXMgPSB0aGlzLm9yZGVycztcbiAgICAgICAgaWYgKCFvcmRlcnMudG8pIHtcbiAgICAgICAgICAgIG9yZGVycy50byA9IHRoaXMuZmluZFJlZmluZXJ5SW5SYW5nZShidWlsZGluZ3MpO1xuICAgICAgICAgICAgaWYgKCFvcmRlcnMudG8pIHtcbiAgICAgICAgICAgICAgICByZXMgPSBvcmRlcnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdGluYXRpb24gPSB7IHg6IG9yZGVycy50by54LCB5OiBvcmRlcnMudG8ueSArIDIgfTtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5wb3coTWF0aC5wb3coZGVzdGluYXRpb24ueSAtIHRoaXMueSwgMikgKyBNYXRoLnBvdyhkZXN0aW5hdGlvbi54IC0gdGhpcy54LCAyKSwgMC41KTtcbiAgICAgICAgLy9hbGVydChkaXN0YW5jZSlcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gMyAqIHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyAvIGdyaWRTaXplKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhkZXN0aW5hdGlvbiwgZmFsc2UsIHNwZWVkQWRqdXN0bWVudEZhY3RvciwgdW5pdHMsIGN1clBsYXllclRlYW0sIG9ic3RydWN0aW9uR3JpZCwgaGVyb09ic3RydWN0aW9uR3JpZCwgZGVidWdNb2RlLCBjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuKTtcbiAgICAgICAgICAgIC8vdGhpcy5tb3ZlVG8oe3g6MTAseToxMH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3JkZXJzLnRvLmxpZmUgIT0gXCJ1bHRyYS1kYW1hZ2VkXCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRpYmVyaXVtID09IDApIHtcbiAgICAgICAgICAgICAgICByZXMgPSB7IHR5cGU6ICdoYXJ2ZXN0JywgdG86IG9yZGVycy5mcm9tLCBmcm9tOiBvcmRlcnMudG8gfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZURpcmVjdGlvbiAhPSAxNCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnB1c2goeyB0eXBlOiAndHVybicsIHRvRGlyZWN0aW9uOiAxNCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9yZGVycy50by5zdGF0dXMgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2Rlc3Ryb3knO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQob3JkZXJzLnRvLm5hbWUpXG4gICAgICAgICAgICAgICAgLy9hbGVydCAodGhpcy5uYW1lKVxuICAgICAgICAgICAgICAgIC8vYWxlcnQob3JkZXJzLmZyb20pXG4gICAgICAgICAgICAgICAgb3JkZXJzLnRvLmhhcnZlc3RlciA9IHRoaXM7XG4gICAgICAgICAgICAgICAgb3JkZXJzLnRvLnN0YXR1cyA9ICd1bmxvYWQnO1xuICAgICAgICAgICAgICAgIG9yZGVycy50by5hbmltYXRpb25JbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gb3JkZXJzO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gICAgSGFydmVzdGVyLnByb3RvdHlwZS5maW5kVGliZXJpdW1JblJhbmdlID0gZnVuY3Rpb24gKGhlcm8sIGFsbE92ZXJsYXlzLCBncmlkU2l6ZSwgZm9nKSB7XG4gICAgICAgIGlmICghaGVybykge1xuICAgICAgICAgICAgaGVybyA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1cnJlbnREaXN0YW5jZTtcbiAgICAgICAgdmFyIGN1cnJlbnRPdmVybGF5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE92ZXJsYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgb3ZlcmxheSA9IGFsbE92ZXJsYXlzW2ldO1xuICAgICAgICAgICAgaWYgKG92ZXJsYXkubmFtZSA9PSAndGliZXJpdW0nICYmIG92ZXJsYXkuc3RhZ2UgPiAwICYmICFmb2cuaXNPdmVyKG92ZXJsYXkueCAqIGdyaWRTaXplLCBvdmVybGF5LnkgKiBncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhvdmVybGF5LnggLSBoZXJvLngsIDIpICsgTWF0aC5wb3cob3ZlcmxheS55IC0gaGVyby55LCAyKTtcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnREaXN0YW5jZSB8fCAoY3VycmVudERpc3RhbmNlID4gZGlzdGFuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRPdmVybGF5ID0gb3ZlcmxheTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRPdmVybGF5O1xuICAgIH07XG4gICAgSGFydmVzdGVyLnByb3RvdHlwZS5maW5kUmVmaW5lcnlJblJhbmdlID0gZnVuY3Rpb24gKGJ1aWxkaW5ncykge1xuICAgICAgICB2YXIgY3VycmVudERpc3RhbmNlO1xuICAgICAgICB2YXIgY3VycmVudFJlZmluZXJ5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1aWxkaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJ1aWxkaW5nID0gYnVpbGRpbmdzW2ldO1xuICAgICAgICAgICAgaWYgKGJ1aWxkaW5nLm5hbWUgPT0gJ3JlZmluZXJ5JyAmJiBidWlsZGluZy50ZWFtID09IHRoaXMudGVhbSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucG93KGJ1aWxkaW5nLnggLSB0aGlzLngsIDIpICsgTWF0aC5wb3coYnVpbGRpbmcueSAtIHRoaXMueSwgMik7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50RGlzdGFuY2UgfHwgKGN1cnJlbnREaXN0YW5jZSA+IGRpc3RhbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UmVmaW5lcnkgPSBidWlsZGluZztcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRSZWZpbmVyeTtcbiAgICB9O1xuICAgIHJldHVybiBIYXJ2ZXN0ZXI7XG59KFZlaGljbGUpKTtcbm1vZHVsZS5leHBvcnRzID0gSGFydmVzdGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SGFydmVzdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBEZXN0cnVjdGlibGVPYmplY3QgPSByZXF1aXJlKFwiLi9EZXN0cnVjdGlibGVPYmplY3RcIik7XG52YXIgSW5mYW50cnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEluZmFudHJ5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEluZmFudHJ5KGhlYWx0aCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnaW5mYW50cnknKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5oaXRQb2ludHMgPSBoZWFsdGg7XG4gICAgICAgIF90aGlzLnN0YXR1cyA9ICdzdGFuZCc7XG4gICAgICAgIF90aGlzLmFuaW1hdGlvblNwZWVkID0gNDtcbiAgICAgICAgX3RoaXMucGl4ZWxPZmZzZXRYID0gLTUwIC8gMjtcbiAgICAgICAgX3RoaXMucGl4ZWxPZmZzZXRZID0gLTM5IC8gMjtcbiAgICAgICAgX3RoaXMucGl4ZWxXaWR0aCA9IDE2O1xuICAgICAgICBfdGhpcy5waXhlbEhlaWdodCA9IDE2O1xuICAgICAgICBfdGhpcy5waXhlbFRvcCA9IDY7XG4gICAgICAgIF90aGlzLnBpeGVsTGVmdCA9IDE2O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEluZmFudHJ5LnByb3RvdHlwZS5jb2xsaXNpb24gPSBmdW5jdGlvbiAob3RoZXJVbml0LCBncmlkU2l6ZSkge1xuICAgICAgICBpZiAodGhpcyA9PSBvdGhlclVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vYWxlcnQob3RoZXJVbml0LnggKyAnICcgKyBvdGhlclVuaXQueSlcbiAgICAgICAgdmFyIGRpc3RhbmNlU3F1YXJlZCA9IE1hdGgucG93KHRoaXMueCAtIG90aGVyVW5pdC54LCAyKSArIE1hdGgucG93KHRoaXMueSAtIG90aGVyVW5pdC55LCAyKTtcbiAgICAgICAgdmFyIHJhZGl1c1NxdWFyZWQgPSBNYXRoLnBvdygodGhpcy5jb2xsaXNpb25SYWRpdXMgKyBvdGhlclVuaXQuY29sbGlzaW9uUmFkaXVzKSAvIGdyaWRTaXplLCAyKTtcbiAgICAgICAgdmFyIHNvZnRIYXJkUmFkaXVzU3F1YXJlZCA9IE1hdGgucG93KCh0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgKyBvdGhlclVuaXQuY29sbGlzaW9uUmFkaXVzKSAvIGdyaWRTaXplLCAyKTtcbiAgICAgICAgdmFyIHNvZnRSYWRpdXNTcXVhcmVkID0gTWF0aC5wb3coKHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyArIG90aGVyVW5pdC5zb2Z0Q29sbGlzaW9uUmFkaXVzKSAvIGdyaWRTaXplLCAyKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlU3F1YXJlZCA8PSByYWRpdXNTcXVhcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiAnaGFyZCcsIGRpc3RhbmNlOiBNYXRoLnBvdyhkaXN0YW5jZVNxdWFyZWQsIDAuNSkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaXN0YW5jZVNxdWFyZWQgPCBzb2Z0SGFyZFJhZGl1c1NxdWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdzb2Z0LWhhcmQnLCBkaXN0YW5jZTogTWF0aC5wb3coZGlzdGFuY2VTcXVhcmVkLCAwLjUpIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlzdGFuY2VTcXVhcmVkIDw9IHNvZnRSYWRpdXNTcXVhcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiAnc29mdCcsIGRpc3RhbmNlOiBNYXRoLnBvdyhkaXN0YW5jZVNxdWFyZWQsIDAuNSkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBJbmZhbnRyeS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNwZWVkQ291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5zcGVlZENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BlZWRDb3VudGVyKys7XG4gICAgICAgIHZhciBhbmdsZSA9ICh0aGlzLm1vdmVEaXJlY3Rpb24gLyA4KSAqIDIgKiBNYXRoLlBJOyAvL01hdGgucm91bmQoICg5MCsodW5pdC5kaXJlY3Rpb24vMzIpKjM2MCklMzYwKTtcbiAgICAgICAgLy8vYWxlcnQoYW5nbGUpO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gJ3dhbGsnKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnggLSAwLjAwNSAqIHRoaXMuc3BlZWQgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLSAwLjAwNSAqIHRoaXMuc3BlZWQgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3BlZWRDb3VudGVyID49IDcpIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWRDb3VudGVyID0gMDtcbiAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IE1hdGguZmxvb3IodGhpcy5tb3ZlRGlyZWN0aW9uICsgKE1hdGgucm91bmQoKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTApICogMSAvIDEwKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlRGlyZWN0aW9uID4gNykge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmVEaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlRGlyZWN0aW9uID0gNztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gTWF0aC5yYW5kb20oKSA+IDAuNyA/ICdmaXJlJyA6IE1hdGgucmFuZG9tKCkgPiAwLjcgPyAnc3RhbmQnIDogJ3dhbGsnO1xuICAgICAgICAgICAgLyppZiAodGhpcy5zdGF0dXMgPT0gJ2ZpcmUnKXtcbiAgICAgICAgICAgICAgICBzb3VuZHMucGxheSgnbWFjaGluZV9ndW4nKTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICB9XG4gICAgfTtcbiAgICBJbmZhbnRyeS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjb250ZXh0LCBjdXJQbGF5ZXJUZWFtLCBncmlkU2l6ZSwgc2NyZWVuLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSkge1xuICAgICAgICAvL2FsZXJ0KHRoaXMuc3RhdHVzKTtcbiAgICAgICAgLy9hbGVydCh0aGlzLmltYWdlQXJyYXlbdGhpcy5zdGF0dXNdW3RoaXMubW92ZURpcmVjdGlvbl0pXG4gICAgICAgIHZhciBpbWFnZUxpc3QgPSB0aGlzLmltYWdlQXJyYXlbdGhpcy5zdGF0dXNdW3RoaXMubW92ZURpcmVjdGlvbl07XG4gICAgICAgIC8vYWxlcnQoaW1hZ2VMaXN0Lmxlbmd0aClcbiAgICAgICAgdGhpcy5hbmltYXRpb25JbmRleCsrO1xuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25JbmRleCAvIHRoaXMuYW5pbWF0aW9uU3BlZWQgPj0gaW1hZ2VMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgLy9hbGVydCh0aGlzLmFuaW1hdGlvbkluZGV4ICsgJyAvICcrIHRoaXMuYW5pbWF0aW9uU3BlZWQpXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW92ZUltYWdlID0gaW1hZ2VMaXN0W01hdGguZmxvb3IodGhpcy5hbmltYXRpb25JbmRleCAvIHRoaXMuYW5pbWF0aW9uU3BlZWQpXTtcbiAgICAgICAgLy9hbGVydCh0aGlzLm1vdmVPZmZzZXRYKVxuICAgICAgICB2YXIgeCA9IHRoaXMueCAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnggKyB0aGlzLnBpeGVsT2Zmc2V0WDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnkgKiBncmlkU2l6ZSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC55ICsgdGhpcy5waXhlbE9mZnNldFk7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKG1vdmVJbWFnZSwgeCwgeSk7XG4gICAgICAgIC8vLy9jb250ZXh0LmZpbGxSZWN0KHRoaXMueCpnYW1lLmdyaWRTaXplK2dhbWUudmlld3BvcnRBZGp1c3RYK3RoaXMucGl4ZWxXaWR0aC8yLHRoaXMueSpnYW1lLmdyaWRTaXplK2dhbWUudmlld3BvcnRBZGp1c3RZK3RoaXMucGl4ZWxIZWlnaHQvMiwxMCwxMCk7XG4gICAgICAgIHRoaXMuZHJhd1NlbGVjdGlvbihjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuLCBzaWRlYmFyKTtcbiAgICB9O1xuICAgIEluZmFudHJ5LnByb3RvdHlwZS5wcm9jZXNzT3JkZXJzID0gZnVuY3Rpb24gKHNwZWVkQWRqdXN0bWVudEZhY3RvciwgdW5pdHMsIGJ1aWxkaW5ncywgdHVycmV0cywgYWxsT3ZlcmxheXMsIGJ1aWxkaW5nc0ZhY3RvcnksIGZvZywgc291bmRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbikge1xuICAgIH07XG4gICAgcmV0dXJuIEluZmFudHJ5O1xufShEZXN0cnVjdGlibGVPYmplY3QpKTtcbm1vZHVsZS5leHBvcnRzID0gSW5mYW50cnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1JbmZhbnRyeS5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBWaXN1YWxPYmplY3QgPSByZXF1aXJlKFwiLi9WaXN1YWxPYmplY3RcIik7XG52YXIgSW5mYW50cnkgPSByZXF1aXJlKFwiLi9JbmZhbnRyeVwiKTtcbnZhciBJbmZhbnRyeUZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEluZmFudHJ5RmFjdG9yeSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJbmZhbnRyeUZhY3RvcnkoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlcyA9IFtdO1xuICAgICAgICBfdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5pbmZhbnRyeURldGFpbHMgPSB7XG4gICAgICAgICAgICAnbWluaWd1bm5lcic6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbWluaWd1bm5lcicsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdNaW5pZ3VubmVyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogOCxcbiAgICAgICAgICAgICAgICBjb3N0OiAxMDAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDEsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiA1MCxcbiAgICAgICAgICAgICAgICBjb2xsaXNpb25SYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ3N0YW5kJywgY291bnQ6IDEsIGRpcmVjdGlvbkNvdW50OiA4IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJ3YWxrXCIsIGNvdW50OiA2LCBkaXJlY3Rpb25Db3VudDogOCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwiZmlyZVwiLCBjb3VudDogOCwgZGlyZWN0aW9uQ291bnQ6IDggfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMucHJlbG9hZENvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubG9hZGVkQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEluZmFudHJ5RmFjdG9yeS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBkZXRhaWxzID0gdGhpcy5pbmZhbnRyeURldGFpbHNbbmFtZV07XG4gICAgICAgIHZhciBpbmZhbnRyeSA9IG5ldyBJbmZhbnRyeShkZXRhaWxzLm1heEhpdFBvaW50cyk7XG4gICAgICAgIC8vJC5leHRlbmQoaW5mYW50cnlUeXBlLGRlZmF1bHRzKTtcbiAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGltYWdlc1xuICAgICAgICBpbmZhbnRyeS5pbWFnZUFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSBkZXRhaWxzLmltYWdlc1RvTG9hZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNvbnN0cnVjdEltYWdlQ291bnQgPSBkZXRhaWxzLmltYWdlc1RvTG9hZFtpXS5jb3VudDtcbiAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RJbWFnZURpcmVjdGlvbkNvdW50ID0gZGV0YWlscy5pbWFnZXNUb0xvYWRbaV0uZGlyZWN0aW9uQ291bnQ7XG4gICAgICAgICAgICB2YXIgY29uc3RydWN0SW1hZ2VOYW1lID0gZGV0YWlscy5pbWFnZXNUb0xvYWRbaV0ubmFtZTtcbiAgICAgICAgICAgIHZhciBpbWdBcnJheSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb25zdHJ1Y3RJbWFnZURpcmVjdGlvbkNvdW50OyBqKyspIHtcbiAgICAgICAgICAgICAgICBpbWdBcnJheVtqXSA9ICh0aGlzLmxvYWRJbWFnZUFycmF5KCd1bml0cy9pbmZhbnRyeS8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnLScgKyBjb25zdHJ1Y3RJbWFnZU5hbWUgKyAnLScgKyBqLCBjb25zdHJ1Y3RJbWFnZUNvdW50LCAnLmdpZicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vYWxlcnQoaW1nQXJyYXkpXG4gICAgICAgICAgICBpbmZhbnRyeS5pbWFnZUFycmF5W2NvbnN0cnVjdEltYWdlTmFtZV0gPSBpbWdBcnJheTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgYWxsIHRoZSBiYXNpYyB1bml0IGRldGFpbHNcbiAgICAgICAgJC5leHRlbmQoaW5mYW50cnksIGRldGFpbHMpO1xuICAgICAgICB0aGlzLnR5cGVzW25hbWVdID0gaW5mYW50cnk7XG4gICAgfTtcbiAgICBJbmZhbnRyeUZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgICAgIHZhciBuZXdJbmZhbnRyeSA9IG5ldyBJbmZhbnRyeSgwKTtcbiAgICAgICAgbmV3SW5mYW50cnkudGVhbSA9IGRldGFpbHMudGVhbTtcbiAgICAgICAgdmFyIG5hbWUgPSBkZXRhaWxzLm5hbWU7XG4gICAgICAgICQuZXh0ZW5kKG5ld0luZmFudHJ5LCB0aGlzLnR5cGVzW25hbWVdLmRlZmF1bHRzKTtcbiAgICAgICAgJC5leHRlbmQobmV3SW5mYW50cnksIHRoaXMudHlwZXNbbmFtZV0pO1xuICAgICAgICAkLmV4dGVuZChuZXdJbmZhbnRyeSwgZGV0YWlscyk7XG4gICAgICAgIGlmIChkZXRhaWxzLmhpdFBvaW50cyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgbmV3SW5mYW50cnkuaGl0UG9pbnRzID0gZGV0YWlscy5oaXRQb2ludHM7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld0luZmFudHJ5LmhpdFBvaW50cyA9IG5ld0luZmFudHJ5Lm1heEhpdFBvaW50cztcbiAgICAgICAgcmV0dXJuIG5ld0luZmFudHJ5O1xuICAgIH07XG4gICAgcmV0dXJuIEluZmFudHJ5RmFjdG9yeTtcbn0oVmlzdWFsT2JqZWN0KSk7XG5tb2R1bGUuZXhwb3J0cyA9IEluZmFudHJ5RmFjdG9yeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUluZmFudHJ5RmFjdG9yeS5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBWaXN1YWxPYmplY3QgPSByZXF1aXJlKFwiLi9WaXN1YWxPYmplY3RcIik7XG52YXIgTGV2ZWxzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMZXZlbHMsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGV2ZWxzKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMubGV2ZWxEZXRhaWxzID0ge1xuICAgICAgICAgICAgXCJnZGkxXCI6IHtcbiAgICAgICAgICAgICAgICBtYXBVcmw6ICdtYXBzL2dkaS9tYXAwMS5qcGVnJywgLy8gVGhlIGJhY2tncm91bmQgbWFwIHRvIGxvYWRcbiAgICAgICAgICAgICAgICBzdGFydGluZ0Nhc2g6IDMwMDAsXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdFbmVteUNhc2g6IDMwMDAsXG4gICAgICAgICAgICAgICAgdGVycmFpbjogW1xuICAgICAgICAgICAgICAgICAgICB7IHgxOiAwLCB5MTogMjcsIHgyOiAzMCwgeTI6IDMwLCB0eXBlOiAnd2F0ZXInIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDE6IDAsIHkxOiAyNiwgeDI6IDYsIHkyOiAyNiwgdHlwZTogJ3dhdGVyJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHgxOiAwLCB5MTogMjUsIHgyOiA1LCB5MjogMjUsIHR5cGU6ICd3YXRlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMCwgeTE6IDI0LCB4MjogNCwgeTI6IDI0LCB0eXBlOiAnd2F0ZXInIH0sXG4gICAgICAgICAgICAgICAgICAgIC8ve3gxOjExLHkxOjI2LHgyOjExLHkyOjI2LHR5cGU6J3dhdGVyJ30sXG4gICAgICAgICAgICAgICAgICAgIHsgeDE6IDI5LCB5MTogMTcsIHgyOiAzMCwgeTI6IDIyLCB0eXBlOiAnbW91bnRhaW4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDE6IDcsIHkxOiA2LCB4MjogOCwgeTI6IDksIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogOCwgeTE6IDEwLCB4MjogOSwgeTI6IDExLCB0eXBlOiAnbW91bnRhaW4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDE6IDksIHkxOiAxMSwgeDI6IDEwLCB5MjogMTUsIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTAsIHkxOiAxNSwgeDI6IDExLCB5MjogMTksIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTEsIHkxOiAxOSwgeDI6IDEyLCB5MjogMjEsIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTIsIHkxOiAyMSwgeDI6IDE0LCB5MjogMjMsIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTIsIHkxOiAyNCwgeDI6IDEzLCB5MjogMjQsIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTQsIHkxOiAyMSwgeDI6IDE3LCB5MjogMjIsIHR5cGU6ICdtb3VudGFpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4MTogMTYsIHkxOiAyMywgeDI6IDE2LCB5MjogMjMsIHR5cGU6ICdtb3VudGFpbicgfVxuICAgICAgICAgICAgICAgIF0sIC8vIGZ1bGwgc2l6ZSBncmlkLCBkZWZpbmVzIHdhdGVyIGFuZCBtb3VudGFpbnNcbiAgICAgICAgICAgICAgICBvdmVybGF5OiBbXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTAsIHk6IDEwLCBuYW1lOiAndHJlZScgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAxNiwgeTogMywgbmFtZTogJ3RyZWUnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTQsIHk6IDIsIG5hbWU6ICd0cmVlcycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiA5LCB5OiAyLCBuYW1lOiAndHJlZXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTksIHk6IDEyLCBuYW1lOiAndHJlZXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTUsIHk6IDEzLCBuYW1lOiAndHJlZXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMCwgeTogMSwgbmFtZTogJ3RyZWVzJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDIsIHk6IDEsIG5hbWU6ICd0cmVlcycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiA0LCB5OiAxLCBuYW1lOiAndHJlZXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogOCwgeTogMSwgbmFtZTogJ3RyZWUnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogNiwgeTogMCwgbmFtZTogJ3RyZWUnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogNywgeTogMCwgbmFtZTogJ3RyZWUnIH0sXG4gICAgICAgICAgICAgICAgICAgIC8ve3g6MTIseToxNSxuYW1lOid0aWJlcml1bScsc3RhZ2U6MTF9LFxuICAgICAgICAgICAgICAgICAgICAvL3t4OjEzLHk6MTUsbmFtZTondGliZXJpdW0nLHN0YWdlOjh9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDI4LCB5OiAxMSwgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDkgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAyOSwgeTogMTEsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiA3IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMjgsIHk6IDEyLCBuYW1lOiAndGliZXJpdW0nLCBzdGFnZTogOSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDI5LCB5OiAxMiwgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDUgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAyOCwgeTogMTMsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDI5LCB5OiAxMywgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAyOCwgeTogMTQsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiA4IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMjksIHk6IDE0LCBuYW1lOiAndGliZXJpdW0nLCBzdGFnZTogNiB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDI4LCB5OiAxNSwgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDMgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAyNywgeTogMTUsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiAxMSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDI3LCB5OiAxNCwgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAyNywgeTogMTMsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiA1IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTMsIHk6IDE2LCBuYW1lOiAndGliZXJpdW0nLCBzdGFnZTogMSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDE0LCB5OiAxNiwgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDUgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAxNSwgeTogMTcsIG5hbWU6ICd0aWJlcml1bScsIHN0YWdlOiA4IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgeDogMTQsIHk6IDE3LCBuYW1lOiAndGliZXJpdW0nLCBzdGFnZTogMyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IDE2LCB5OiAxNywgbmFtZTogJ3RpYmVyaXVtJywgc3RhZ2U6IDYgfVxuICAgICAgICAgICAgICAgICAgICAvLyB7eDE6OCx5MTo4LHgyOjEwLHkyOjEwLHR5cGU6J3RyZWUtMSd9LFxuICAgICAgICAgICAgICAgICAgICAvL3t4MTo4LHkxOjgseDI6MTAseTI6MTAsdHlwZTondGliZXJpdW0tMSd9XG4gICAgICAgICAgICAgICAgXSwgLy90aGUgdHJlZXMgYW5kIHRpYmVyaXVtIC4uIGNhbiB0ZXJyYWluIGFuZCBvdmVybGF5IGJlIGluIHRoZSBzYW1lP1xuICAgICAgICAgICAgICAgIGdyaWRXaWR0aDogMzEsXG4gICAgICAgICAgICAgICAgZ3JpZEhlaWdodDogMzEsXG4gICAgICAgICAgICAgICAgdGVhbTogJ2dkaScsXG4gICAgICAgICAgICAgICAgZW5lbXlUZWFtOiAnbm9kJyxcbiAgICAgICAgICAgICAgICBicmllZmluZzogJ1RoaXMgaXMgYSB3YXJuaW5nIFxcbiBmb3IgYWxsIG9mIHlvdSBcXG4gS2lsbCBlbmVteSB0cm9vcHMgYW5kIGhhdmUgc29tZSBmdW4nLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGluZmFudHJ5OiBbXSwgLy8gWydtaW5pZ3VubmVyJ10sXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5nczogWydjb25zdHJ1Y3Rpb24teWFyZCcsICdwb3dlci1wbGFudCcsICdyZWZpbmVyeScsICd3ZWFwb25zLWZhY3RvcnknLCAnYWR2YW5jZWQtcG93ZXItcGxhbnQnLCAndGliZXJpdW0tc2lsbycsICdoYW5kLW9mLW5vZCddLFxuICAgICAgICAgICAgICAgICAgICB2ZWhpY2xlczogWydtY3YnLCAnbGlnaHQtdGFuaycsICdoYXJ2ZXN0ZXInXSxcbiAgICAgICAgICAgICAgICAgICAgc2hpcHM6IFsnYmlnYm9hdCddLFxuICAgICAgICAgICAgICAgICAgICB0dXJyZXRzOiBbJ2d1bi10dXJyZXQnXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NyaXB0ZWRFdmVudHM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICd0cmlnZ2VyMScsIGRlc2NyaXB0aW9uOiAnSW5pdGlhbCBmb3VyIHJlaW5mb3JjZW1lbnQgdHJvb3BzIGxhbmQgb24gYmVhY2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgYWN0aW9uOiAnd2FpdCcsIHRpZ2dlcjogJ3RpbWUnLCB0aW1lOiAxMDAgfSwgLy90aW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgYWN0aW9uOiBcInNvdW5kXCIsIHNvdW5kOiAncmVpbmZvcmNlbWVudHNfaGF2ZV9hcnJpdmVkJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnYWRkVW5pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdob3ZlcmNyYWZ0JywgdHlwZTogJ3ZlaGljbGUnLCB1bnNlbGVjdGFibGU6IHRydWUsIGlkOiAnaG92ZXJjcmFmdDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMzAsIHk6IDMwLCBkaXJlY3Rpb246ICd1cCcsIGNhcnJ5aW5nOiBbeyBuYW1lOiAnZ3VubmVyJyB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGFjdGlvbjogJ21vdmUnLCBpZDogJ2hvdmVyY3JhZnQxJywgeDogMzAsIHk6IDI3IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBhY3Rpb246ICd1bmxvYWQnLCBpZDogJ2hvdmVyY3JhZnQxJywgeDogMzAsIHk6IDI4IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBhY3Rpb246ICdtb3ZlJywgaWQ6ICdob3ZlcmNyYWZ0MScsIHg6IDMwLCB5OiAzMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgYWN0aW9uOiAncmVtb3ZlVW5pdCcsIGlkOiAnaG92ZXJjcmFmdDEnIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICd0cmlnZ2VyMicsIGRlc2NyaXB0aW9uOiAnQmxvdyB1cCBlbmVteSBwb3dlcnBsYW50IHdoZW4gdGhlIHRpbWUgY29tZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgYWN0aW9uOiAnd2FpdCcsIHRyaWdnZXI6ICdjb25kaXRpb24nLCBjb25kaXRpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGFjdGlvbjogJ3NvdW5kJywgc291bmQ6ICdsb3dfcG93ZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBhY3Rpb246ICdkZXN0cm95QnVpbGRpbmcnLCBpZDogJ3Bvd2VycGxhbnQxJyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnd2ludHJpZ2dlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBhY3Rpb246ICd3YWl0JywgdHJpZ2dlcjogJ2NvbmRpdGlvbicsIGNvbmRpdGlvbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGFjdGlvbjogJ2VuZExldmVsJywgdHlwZTogJ3N1Y2Nlc3MnIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMucHJlbG9hZENvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubG9hZGVkQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIExldmVscy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChpZCwgYnVpbGRpbmdzLCB0dXJyZXRzLCB2ZWhpY2xlcywgaW5mYW50cnksIG92ZXJsYXksIGdyaWRTaXplKSB7XG4gICAgICAgIHZhciBsZXZlbDtcbiAgICAgICAgLy9sZXZlbC5tYXBJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgZGV0YWlscyA9IHRoaXMubGV2ZWxEZXRhaWxzW2lkXTtcbiAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXRhaWxzLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PSBcInZlaGljbGVzXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZGV0YWlscy5pdGVtc1tpdGVtXS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2ZWhpY2xlcy5sb2FkKHRoaXMubGV2ZWxEZXRhaWxzW2lkXS5pdGVtc1tpdGVtXVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtID09IFwiYnVpbGRpbmdzXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZGV0YWlscy5pdGVtc1tpdGVtXS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBidWlsZGluZ3MubG9hZChkZXRhaWxzLml0ZW1zW2l0ZW1dW2ldLCBncmlkU2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtID09IFwiaW5mYW50cnlcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBkZXRhaWxzLml0ZW1zW2l0ZW1dLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmFudHJ5LmxvYWQoZGV0YWlscy5pdGVtc1tpdGVtXVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtID09IFwidHVycmV0c1wiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRldGFpbHMuaXRlbXNbaXRlbV0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdHVycmV0cy5sb2FkKGRldGFpbHMuaXRlbXNbaXRlbV1baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9ic3RydWN0aW9uR3JpZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICB2YXIgbWFwR3JpZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGRldGFpbHMuZ3JpZEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBvYnN0cnVjdGlvbkdyaWRbeV0gPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgIG1hcEdyaWRbeV0gPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZGV0YWlscy5ncmlkV2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIG9ic3RydWN0aW9uR3JpZFt5XVt4XSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gZGV0YWlscy50ZXJyYWluLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgdGVycmFpbiA9IGRldGFpbHMudGVycmFpbltpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSB0ZXJyYWluLngxOyB4IDw9IHRlcnJhaW4ueDI7IHgrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSB0ZXJyYWluLnkxOyB5IDw9IHRlcnJhaW4ueTI7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBvYnN0cnVjdGlvbkdyaWRbeV1beF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICBtYXBHcmlkW3ldW3hdID0gdGVycmFpbi50eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHZhciBvdmVybGF5QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGRldGFpbHMub3ZlcmxheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgb3ZlcmxheUFycmF5LnB1c2gob3ZlcmxheS5hZGQoZGV0YWlscy5vdmVybGF5W2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBsZXZlbCA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIG1hcEltYWdlOiB0aGlzLnByZWxvYWRJbWFnZSh0aGlzLmxldmVsRGV0YWlsc1tpZF0ubWFwVXJsKSxcbiAgICAgICAgICAgIG1hcEdyaWQ6IG1hcEdyaWQsXG4gICAgICAgICAgICBvYnN0cnVjdGlvbkdyaWQ6IG9ic3RydWN0aW9uR3JpZCxcbiAgICAgICAgICAgIG92ZXJsYXk6IG92ZXJsYXlBcnJheSxcbiAgICAgICAgICAgIHRlYW06IGRldGFpbHMudGVhbSxcbiAgICAgICAgICAgIGVuZW15VGVhbTogZGV0YWlscy5lbmVteVRlYW0sXG4gICAgICAgICAgICBzdGFydGluZ0Nhc2g6IGRldGFpbHMuc3RhcnRpbmdDYXNoLFxuICAgICAgICAgICAgc3RhcnRpbmdFbmVteUNhc2g6IGRldGFpbHMuc3RhcnRpbmdFbmVteUNhc2gsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsZXZlbDtcbiAgICB9O1xuICAgIHJldHVybiBMZXZlbHM7XG59KFZpc3VhbE9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBMZXZlbHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1MZXZlbHMuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgVmlzdWFsT2JqZWN0ID0gcmVxdWlyZShcIi4vVmlzdWFsT2JqZWN0XCIpO1xudmFyIEN1cnNvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDdXJzb3IoKSB7XG4gICAgfVxuICAgIHJldHVybiBDdXJzb3I7XG59KCkpO1xudmFyIE1vdXNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNb3VzZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNb3VzZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucGFubmluZ1RocmVzaG9sZCA9IDQ4O1xuICAgICAgICBfdGhpcy5wYW5uaW5nVmVsb2NpdHkgPSAyNDtcbiAgICAgICAgX3RoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgICAgIF90aGlzLnByZWxvYWRDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmxvYWRlZENvdW50ID0gMDtcbiAgICAgICAgX3RoaXMuc3ByaXRlSW1hZ2UgPSBudWxsO1xuICAgICAgICBfdGhpcy5jdXJzb3JzID0ge307XG4gICAgICAgIF90aGlzLmN1cnNvckNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMueCA9IDA7XG4gICAgICAgIF90aGlzLnkgPSAwO1xuICAgICAgICBfdGhpcy5jdXJzb3JMb29wID0gMDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBNb3VzZS5wcm90b3R5cGUuaGFuZGxlUGFubmluZyA9IGZ1bmN0aW9uIChzY3JlZW4sIG1hcEltYWdlU2l6ZSwgc2lkZWJhcikge1xuICAgICAgICB2YXIgcGFuRGlyZWN0aW9uID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlQ2FudmFzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy55IDw9IHNjcmVlbi52aWV3cG9ydC50b3AgKyB0aGlzLnBhbm5pbmdUaHJlc2hvbGQgJiYgdGhpcy55ID49IHNjcmVlbi52aWV3cG9ydC50b3ApIHtcbiAgICAgICAgICAgICAgICBzY3JlZW4udmlld3BvcnREZWx0YS55ID0gLXRoaXMucGFubmluZ1ZlbG9jaXR5O1xuICAgICAgICAgICAgICAgIHBhbkRpcmVjdGlvbiArPSBcIl90b3BcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMueSA+PSBzY3JlZW4udmlld3BvcnQudG9wICsgc2NyZWVuLnZpZXdwb3J0LmhlaWdodCAtIHRoaXMucGFubmluZ1RocmVzaG9sZCAmJiB0aGlzLnkgPD0gc2NyZWVuLnZpZXdwb3J0LnRvcCArIHNjcmVlbi52aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzY3JlZW4udmlld3BvcnREZWx0YS55ID0gdGhpcy5wYW5uaW5nVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgcGFuRGlyZWN0aW9uICs9IFwiX2JvdHRvbVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NyZWVuLnZpZXdwb3J0RGVsdGEueSA9IDA7XG4gICAgICAgICAgICAgICAgcGFuRGlyZWN0aW9uICs9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy54IDwgdGhpcy5wYW5uaW5nVGhyZXNob2xkICYmIHRoaXMueSA+PSBzY3JlZW4udmlld3BvcnQudG9wICYmIHRoaXMueSA8PSBzY3JlZW4udmlld3BvcnQudG9wICsgc2NyZWVuLnZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgICAgIHNjcmVlbi52aWV3cG9ydERlbHRhLnggPSAtdGhpcy5wYW5uaW5nVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgcGFuRGlyZWN0aW9uICs9IFwiX2xlZnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMueCA+IHNjcmVlbi53aWR0aCAtIHRoaXMucGFubmluZ1RocmVzaG9sZCAmJiB0aGlzLnkgPj0gc2NyZWVuLnZpZXdwb3J0LnRvcCAmJiB0aGlzLnkgPD0gc2NyZWVuLnZpZXdwb3J0LnRvcCArIHNjcmVlbi52aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzY3JlZW4udmlld3BvcnREZWx0YS54ID0gdGhpcy5wYW5uaW5nVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgcGFuRGlyZWN0aW9uICs9IFwiX3JpZ2h0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY3JlZW4udmlld3BvcnREZWx0YS54ID0gMDtcbiAgICAgICAgICAgICAgICBwYW5EaXJlY3Rpb24gKz0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHNjcmVlbi52aWV3cG9ydE9mZnNldC54ICsgc2NyZWVuLnZpZXdwb3J0RGVsdGEueCA8IDApXG4gICAgICAgICAgICB8fCAoc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnggKyBzY3JlZW4udmlld3BvcnREZWx0YS54ICsgc2NyZWVuLndpZHRoICsgKHNpZGViYXIudmlzaWJsZSA/IC1zaWRlYmFyLndpZHRoIDogMCkgPiBtYXBJbWFnZVNpemUud2lkdGgpKSB7XG4gICAgICAgICAgICBzY3JlZW4udmlld3BvcnREZWx0YS54ID0gMDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKHNjcmVlbi52aWV3cG9ydE9mZnNldC54K3NjcmVlbi52aWV3cG9ydERlbHRhLnkgK3NjcmVlbi53aWR0aCsodGhpcy5zaWRlYmFyLnZpc2libGU/LXRoaXMuc2lkZWJhci53aWR0aDowKSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nICh0aGlzLmdhbWUuY3VycmVudExldmVsLm1hcEltYWdlLndpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNpZGViYXIudmlzaWJsZSAmJiAoc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnggKyBzY3JlZW4ud2lkdGggPiBtYXBJbWFnZVNpemUud2lkdGgpKSB7XG4gICAgICAgICAgICBzY3JlZW4udmlld3BvcnRPZmZzZXQueCA9IG1hcEltYWdlU2l6ZS53aWR0aCAtIHNjcmVlbi53aWR0aDtcbiAgICAgICAgICAgIHNjcmVlbi52aWV3cG9ydERlbHRhLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnkgKyBzY3JlZW4udmlld3BvcnREZWx0YS55IDwgMClcbiAgICAgICAgICAgIHx8IChzY3JlZW4udmlld3BvcnRPZmZzZXQueSArIHNjcmVlbi52aWV3cG9ydERlbHRhLnkgKyBzY3JlZW4udmlld3BvcnQuaGVpZ2h0ID4gbWFwSW1hZ2VTaXplLmhlaWdodCkpIHtcbiAgICAgICAgICAgIHNjcmVlbi52aWV3cG9ydERlbHRhLnkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYW5EaXJlY3Rpb24gIT0gXCJcIikge1xuICAgICAgICAgICAgaWYgKHNjcmVlbi52aWV3cG9ydERlbHRhLnggPT0gMCAmJiBzY3JlZW4udmlld3BvcnREZWx0YS55ID09IDApIHtcbiAgICAgICAgICAgICAgICBwYW5EaXJlY3Rpb24gPSBcIm5vX3BhblwiICsgcGFuRGlyZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFuRGlyZWN0aW9uID0gXCJwYW5cIiArIHBhbkRpcmVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhbkRpcmVjdGlvbiA9IHBhbkRpcmVjdGlvbjtcbiAgICAgICAgc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnggKz0gc2NyZWVuLnZpZXdwb3J0RGVsdGEueDtcbiAgICAgICAgc2NyZWVuLnZpZXdwb3J0T2Zmc2V0LnkgKz0gc2NyZWVuLnZpZXdwb3J0RGVsdGEueTtcbiAgICAgICAgdGhpcy5nYW1lWCA9IHRoaXMueCArIHNjcmVlbi52aWV3cG9ydE9mZnNldC54IC0gc2NyZWVuLnZpZXdwb3J0LmxlZnQ7XG4gICAgICAgIHRoaXMuZ2FtZVkgPSB0aGlzLnkgKyBzY3JlZW4udmlld3BvcnRPZmZzZXQueSAtIHNjcmVlbi52aWV3cG9ydC50b3A7XG4gICAgICAgIHNjcmVlbi52aWV3cG9ydEFkanVzdC54ID0gc2NyZWVuLnZpZXdwb3J0LmxlZnQgLSBzY3JlZW4udmlld3BvcnRPZmZzZXQueDtcbiAgICAgICAgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnkgPSBzY3JlZW4udmlld3BvcnQudG9wIC0gc2NyZWVuLnZpZXdwb3J0T2Zmc2V0Lnk7XG4gICAgfTtcbiAgICBNb3VzZS5wcm90b3R5cGUuZHJhd0N1cnNvciA9IGZ1bmN0aW9uIChjb250ZXh0LCBzY3JlZW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc2lkZUNhbnZhcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3Vyc29yTG9vcCsrO1xuICAgICAgICBpZiAodGhpcy5jdXJzb3JMb29wID49IHRoaXMuY3Vyc29yLmN1cnNvclNwZWVkICogdGhpcy5jdXJzb3IuY291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yTG9vcCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy9hbGVydCh0aGlzLnNwcml0ZUltYWdlKVxuICAgICAgICAvLyBJZiBkcmFnIHNlbGVjdGluZywgZHJhdyBhIHdoaXRlIHNlbGVjdGlvbiByZWN0YW5nbGVcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1NlbGVjdCkge1xuICAgICAgICAgICAgdmFyIHggPSBNYXRoLm1pbih0aGlzLmdhbWVYLCB0aGlzLmRyYWdYKTtcbiAgICAgICAgICAgIHZhciB5ID0gTWF0aC5taW4odGhpcy5nYW1lWSwgdGhpcy5kcmFnWSk7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBNYXRoLmFicyh0aGlzLmdhbWVYIC0gdGhpcy5kcmFnWCk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWF0aC5hYnModGhpcy5nYW1lWSAtIHRoaXMuZHJhZ1kpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVJlY3QoeCArIHNjcmVlbi52aWV3cG9ydEFkanVzdC54LCB5ICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vdmFyIGltYWdlID0gdGhpcy5jdXJzb3IuaW1hZ2VzW01hdGguZmxvb3IodGhpcy5jdXJzb3JMb29wL3RoaXMuY3Vyc29yLmN1cnNvclNwZWVkKV07XG4gICAgICAgIHZhciBpbWFnZU51bWJlciA9IHRoaXMuY3Vyc29yLnNwcml0ZU9mZnNldCArIE1hdGguZmxvb3IodGhpcy5jdXJzb3JMb29wIC8gdGhpcy5jdXJzb3IuY3Vyc29yU3BlZWQpO1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnNwcml0ZUltYWdlLCAzMCAqIChpbWFnZU51bWJlciksIDAsIDMwLCAyNCwgdGhpcy54IC0gdGhpcy5jdXJzb3IueCwgdGhpcy55IC0gdGhpcy5jdXJzb3IueSwgMzAsIDI0KTtcbiAgICB9O1xuICAgIE1vdXNlLnByb3RvdHlwZS5jaGVja092ZXJPYmplY3QgPSBmdW5jdGlvbiAob3ZlcmxheU9iamVjdHMsIGJ1aWxkaW5ncywgdHVycmV0cywgdW5pdHMsIGdyaWRTaXplKSB7XG4gICAgICAgIHZhciBvdmVyT2JqZWN0ID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IG92ZXJsYXlPYmplY3RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgb3ZlcmxheSA9IG92ZXJsYXlPYmplY3RzW2ldO1xuICAgICAgICAgICAgaWYgKG92ZXJsYXkubmFtZSA9PSAndGliZXJpdW0nICYmIHRoaXMuZ3JpZFggPT0gb3ZlcmxheS54ICYmIHRoaXMuZ3JpZFkgPT0gb3ZlcmxheS55KSB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG92ZXJsYXkubmFtZSArICcgJyArb3ZlcmxheS54ICsgJyAnICtvdmVybGF5LnkgKyAnICcrdGhpcy5ncmlkWCArICcgJyt0aGlzLmdyaWRZIClcbiAgICAgICAgICAgICAgICBvdmVyT2JqZWN0ID0gb3ZlcmxheTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KCdvdmVybGF5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGZvciAodmFyIGkgPSBidWlsZGluZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChidWlsZGluZ3NbaV0udW5kZXJQb2ludCh0aGlzLmdhbWVYLCB0aGlzLmdhbWVZLCBncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyT2JqZWN0ID0gYnVpbGRpbmdzW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHR1cnJldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0dXJyZXRzW2ldLnVuZGVyUG9pbnQodGhpcy5nYW1lWCwgdGhpcy5nYW1lWSwgZ3JpZFNpemUpKSB7XG4gICAgICAgICAgICAgICAgb3Zlck9iamVjdCA9IHR1cnJldHNbaV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKHZhciBpID0gdW5pdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh1bml0c1tpXVsndW5kZXJQb2ludCddICYmIHVuaXRzW2ldLnVuZGVyUG9pbnQodGhpcy5nYW1lWCwgdGhpcy5nYW1lWSwgZ3JpZFNpemUpKSB7XG4gICAgICAgICAgICAgICAgb3Zlck9iamVjdCA9IHVuaXRzW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgcmV0dXJuIG92ZXJPYmplY3Q7XG4gICAgfTtcbiAgICBNb3VzZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjb250ZXh0LCBzY3JlZW4sIGN1cnJlbnRMZXZlbCwgb3ZlcmxheU9iamVjdHMsIHNpZGViYXIsIGJ1aWxkaW5nc0ZhY3RvcnksIGJ1aWxkaW5ncywgdHVycmV0c0ZhY3RvcnksIHR1cnJldHMsIHZlaGljbGVzLCBpbmZhbnRyeSwgdW5pdHMsIHNlbGVjdGVkVW5pdHMsIHNlbGVjdGVkQXR0YWNrZXJzLCBidWlsZGluZ09ic3RydWN0aW9uR3JpZCwgb2JzdHJ1Y3Rpb25HcmlkLCBncmlkU2l6ZSwgaGlnaGxpZ2h0R3JpZCkge1xuICAgICAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yc1snZGVmYXVsdCddO1xuICAgICAgICB2YXIgc2VsZWN0ZWRPYmplY3QgPSB0aGlzLmNoZWNrT3Zlck9iamVjdChvdmVybGF5T2JqZWN0cywgYnVpbGRpbmdzLCB0dXJyZXRzLCB1bml0cywgZ3JpZFNpemUpO1xuICAgICAgICBpZiAodGhpcy55IDwgc2NyZWVuLnZpZXdwb3J0LnRvcCB8fCB0aGlzLnkgPiBzY3JlZW4udmlld3BvcnQudG9wICsgc2NyZWVuLnZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgLy8gZGVmYXVsdCBjdXJzb3IgaWYgdG9vIG11Y2ggdG8gdGhlIHRvcFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNpZGViYXIuZGVwbG95TW9kZSkge1xuICAgICAgICAgICAgdmFyIGJ1aWxkaW5nVHlwZSA9IGJ1aWxkaW5nc0ZhY3RvcnkudHlwZXNbc2lkZWJhci5kZXBsb3lCdWlsZGluZ10gfHwgdHVycmV0c0ZhY3RvcnkudHlwZXNbc2lkZWJhci5kZXBsb3lCdWlsZGluZ107XG4gICAgICAgICAgICB2YXIgZ3JpZCA9ICQuZXh0ZW5kKFtdLCBidWlsZGluZ1R5cGUuZ3JpZFNoYXBlKTtcbiAgICAgICAgICAgIGdyaWQucHVzaChncmlkW2dyaWQubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgLy9ncmlkLnB1c2goZ3JpZFsxXSk7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGdyaWQubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyaWRbeV1beF0gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZFkgKyB5IDwgMCB8fCB0aGlzLmdyaWRZICsgeSA+PSBidWlsZGluZ09ic3RydWN0aW9uR3JpZC5sZW5ndGggfHwgdGhpcy5ncmlkWCArIHggPCAwIHx8IHRoaXMuZ3JpZFggKyB4ID49IGJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3RoaXMuZ3JpZFkgKyB5XS5sZW5ndGggfHwgYnVpbGRpbmdPYnN0cnVjdGlvbkdyaWRbdGhpcy5ncmlkWSArIHldW3RoaXMuZ3JpZFggKyB4XSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAodGhpcy5nYW1lLmJ1aWxkaW5nT2JzdHJ1Y3Rpb25HcmlkW3RoaXMuZ3JpZFkreV1bdGhpcy5ncmlkWCt4XSA9PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRHcmlkKHRoaXMuZ3JpZFggKyB4LCB0aGlzLmdyaWRZICsgeSwgMSwgMSwgc2lkZWJhci5wbGFjZW1lbnRSZWRJbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRHcmlkKHRoaXMuZ3JpZFggKyB4LCB0aGlzLmdyaWRZICsgeSwgMSwgMSwgc2lkZWJhci5wbGFjZW1lbnRXaGl0ZUltYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaWRlYmFyLnJlcGFpck1vZGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdCAmJiBzZWxlY3RlZE9iamVjdC50ZWFtID09IGN1cnJlbnRMZXZlbC50ZWFtXG4gICAgICAgICAgICAgICAgJiYgKHNlbGVjdGVkT2JqZWN0LnR5cGUgPT0gJ2J1aWxkaW5nJyB8fCBzZWxlY3RlZE9iamVjdC50eXBlID09ICd0dXJyZXQnKSAmJiAoc2VsZWN0ZWRPYmplY3QuaGl0UG9pbnRzIDwgc2VsZWN0ZWRPYmplY3QubWF4SGl0UG9pbnRzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydyZXBhaXInXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydub19yZXBhaXInXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaWRlYmFyLnNlbGxNb2RlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPYmplY3QgJiYgc2VsZWN0ZWRPYmplY3QudGVhbSA9PSBjdXJyZW50TGV2ZWwudGVhbVxuICAgICAgICAgICAgICAgICYmIChzZWxlY3RlZE9iamVjdC50eXBlID09ICdidWlsZGluZycgfHwgc2VsZWN0ZWRPYmplY3QudHlwZSA9PSAndHVycmV0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yc1snc2VsbCddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvcnNbJ25vX3NlbGwnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaWRlYmFyLnZpc2libGUgJiYgdGhpcy54ID4gc2lkZWJhci5sZWZ0KSB7XG4gICAgICAgICAgICAvL292ZXIgYSBidXR0b25cbiAgICAgICAgICAgIHZhciBob3ZCdXR0b24gPSBzaWRlYmFyLmhvdmVyZWRCdXR0b24odGhpcyk7XG4gICAgICAgICAgICBpZiAoaG92QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvb2x0aXBOYW1lID0gaG92QnV0dG9uLnR5cGU7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChob3ZCdXR0b24udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdpbmZhbnRyeSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwTmFtZSA9IGluZmFudHJ5LnR5cGVzW2hvdkJ1dHRvbi5uYW1lXS5sYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdidWlsZGluZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwTmFtZSA9IGJ1aWxkaW5nc0ZhY3RvcnkudHlwZXNbaG92QnV0dG9uLm5hbWVdLmxhYmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R1cnJldCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwTmFtZSA9IHR1cnJldHNGYWN0b3J5LnR5cGVzW2hvdkJ1dHRvbi5uYW1lXS5sYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd2ZWhpY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBOYW1lID0gdmVoaWNsZXMudHlwZXNbaG92QnV0dG9uLm5hbWVdLmxhYmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b29sdGlwQ29zdCA9IFwiJFwiICsgaG92QnV0dG9uLmNvc3Q7XG4gICAgICAgICAgICAgICAgLy9jb250ZXh0LmZpbGxSZWN0KClcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdChNYXRoLnJvdW5kKHRoaXMueCksIE1hdGgucm91bmQodGhpcy55ICsgMTYpLCB0b29sdGlwTmFtZS5sZW5ndGggKiA1LjUgKyA4LCAzMik7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdkYXJrZ3JlZW4nO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlUmVjdChNYXRoLnJvdW5kKHRoaXMueCksIE1hdGgucm91bmQodGhpcy55ICsgMTYpLCB0b29sdGlwTmFtZS5sZW5ndGggKiA1LjUgKyA4LCAzMik7XG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnZGFya2dyZWVuJztcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSAnMTJweCBcIkNvbW1hbmQgYW5kIENvbnF1ZXJcIic7XG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dCh0b29sdGlwTmFtZSwgTWF0aC5yb3VuZCh0aGlzLnggKyA0KSwgTWF0aC5yb3VuZCh0aGlzLnkgKyAzMCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQodG9vbHRpcENvc3QsIE1hdGgucm91bmQodGhpcy54ICsgNCksIE1hdGgucm91bmQodGhpcy55ICsgNDQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRyYWdTZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydkZWZhdWx0J107XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0ZWRPYmplY3QgJiYgIXRoaXMuaXNPdmVyRm9nKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPYmplY3QudGVhbSAmJiBzZWxlY3RlZE9iamVjdC50ZWFtICE9IGN1cnJlbnRMZXZlbC50ZWFtICYmIHNlbGVjdGVkQXR0YWNrZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yc1snYXR0YWNrJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZWxlY3RlZFVuaXRzLmxlbmd0aCA9PSAxICYmIHNlbGVjdGVkVW5pdHNbMF0ubmFtZSA9PSAnaGFydmVzdGVyJ1xuICAgICAgICAgICAgICAgICYmIHNlbGVjdGVkVW5pdHNbMF0udGVhbSA9PSBjdXJyZW50TGV2ZWwudGVhbVxuICAgICAgICAgICAgICAgICYmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICd0aWJlcml1bScgfHwgc2VsZWN0ZWRPYmplY3QubmFtZSA9PSAncmVmaW5lcnknKSkge1xuICAgICAgICAgICAgICAgIC8vTXkgdGVhbSdzIGhhcnZlc3RlciBpcyBzZWxlY3RlZCBhbG9uZVxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICd0aWJlcml1bScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvcnNbJ2F0dGFjayddOyAvLyBIYXJ2ZXN0ZXIgYXR0YWNrcyB0aWJlcml1bSBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkT2JqZWN0Lm5hbWUgPT0gJ3JlZmluZXJ5JyAmJiBzZWxlY3RlZE9iamVjdC50ZWFtID09IGN1cnJlbnRMZXZlbC50ZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydsb2FkX3ZlaGljbGUnXTsgLy8gSGFydmVzdGVyIGVudGVycyBteSByZWZpbmVyeVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGVjdGVkVW5pdHMubGVuZ3RoID09IDEgJiYgc2VsZWN0ZWRPYmplY3Quc2VsZWN0ZWQgJiYgc2VsZWN0ZWRPYmplY3QudGVhbSA9PSBjdXJyZW50TGV2ZWwudGVhbSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9iamVjdC5uYW1lID09ICdtY3YnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydidWlsZF9jb21tYW5kJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIXNlbGVjdGVkT2JqZWN0LnNlbGVjdGVkICYmIHNlbGVjdGVkT2JqZWN0Lm5hbWUgIT0gJ3RpYmVyaXVtJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydzZWxlY3QnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGVjdGVkT2JqZWN0Lm5hbWUgPT0gJ3RpYmVyaXVtJykge1xuICAgICAgICAgICAgICAgIGlmIChvYnN0cnVjdGlvbkdyaWRbdGhpcy5ncmlkWV0gJiYgb2JzdHJ1Y3Rpb25HcmlkW3RoaXMuZ3JpZFldW3RoaXMuZ3JpZFhdID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvcnNbJ25vX21vdmUnXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydtb3ZlJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGFuRGlyZWN0aW9uICYmIHRoaXMucGFuRGlyZWN0aW9uICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzW3RoaXMucGFuRGlyZWN0aW9uXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxlY3RlZFVuaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChvYnN0cnVjdGlvbkdyaWRbdGhpcy5ncmlkWV0gJiYgb2JzdHJ1Y3Rpb25HcmlkW3RoaXMuZ3JpZFldW3RoaXMuZ3JpZFhdID09IDEgJiYgIXRoaXMuaXNPdmVyRm9nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvcnNbJ25vX21vdmUnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3JzWydtb3ZlJ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlQ2FudmFzKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdDdXJzb3IoY29udGV4dCwgc2NyZWVuKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTW91c2UucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24gKGV2LCByaWdodENsaWNrLCBzaWRlYmFyLCBzY3JlZW4sIHNvdW5kc01hbmFnZXIsIG9uQ2xpY2spIHtcbiAgICAgICAgaWYgKHRoaXMueSA8PSBzY3JlZW4udmlld3BvcnQudG9wICYmIHRoaXMueSA+IHNjcmVlbi52aWV3cG9ydC50b3AgLSAxNSkge1xuICAgICAgICAgICAgLy8gVGFiIEFyZWEgQ2xpY2tlZCAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLnggPj0gMCAmJiB0aGlzLnggPCAxNjApIHtcbiAgICAgICAgICAgICAgICAvLyBPcHRpb25zIGJ1dHRvbiBjbGlja2VkXG4gICAgICAgICAgICAgICAgLy9hbGVydCAoJ05vIE9wdGlvbnMgeWV0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy54ID49IDMyMCAmJiB0aGlzLnggPCA0ODApIHtcbiAgICAgICAgICAgICAgICAvLyBTY29yZSBidXR0b24gY2xpY2tlZFxuICAgICAgICAgICAgICAgIC8vYWxlcnQgKCdTY29yZSBidXR0b24gY2xpY2tlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy54ID49IDQ4MCAmJiB0aGlzLnggPCA2NDApIHtcbiAgICAgICAgICAgICAgICAvLyBTaWRlYmFyIGJ1dHRvbiBjbGlja2VkXG4gICAgICAgICAgICAgICAgLy9hbGVydCAoJ1NpZGViYXIgYnV0dG9uIGNsaWNrZWQnKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyLnZpc2libGUgPSAhc2lkZWJhci52aXNpYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueSA+PSBzY3JlZW4udmlld3BvcnQudG9wICYmIHRoaXMueSA8PSBzY3JlZW4udmlld3BvcnQudG9wICsgc2NyZWVuLnZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgLy9HYW1lIEFyZWEgQ2xpY2tlZFxuICAgICAgICAgICAgaWYgKHNpZGViYXIudmlzaWJsZSAmJiB0aGlzLnggPiBzaWRlYmFyLmxlZnQpIHtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0ICgnc2lkZWJhciBjbGlja2VkJyk7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGljayhldiwgcmlnaHRDbGljaywgdGhpcywgc291bmRzTWFuYWdlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrKGV2LCByaWdodENsaWNrKTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KCdnYW1lIGFyZWEgY2xpY2tlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBNb3VzZS5wcm90b3R5cGUubG9hZEN1cnNvciA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBpbWFnZUNvdW50LCBjdXJzb3JTcGVlZCkge1xuICAgICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7IHggPSAwOyB9XG4gICAgICAgIGlmICh5ID09PSB2b2lkIDApIHsgeSA9IDA7IH1cbiAgICAgICAgaWYgKGltYWdlQ291bnQgPT09IHZvaWQgMCkgeyBpbWFnZUNvdW50ID0gMTsgfVxuICAgICAgICBpZiAoY3Vyc29yU3BlZWQgPT09IHZvaWQgMCkgeyBjdXJzb3JTcGVlZCA9IDE7IH1cbiAgICAgICAgdGhpcy5jdXJzb3JzW25hbWVdID0geyB4OiB4LCB5OiB5LCBuYW1lOiBuYW1lLCBjb3VudDogaW1hZ2VDb3VudCwgc3ByaXRlT2Zmc2V0OiB0aGlzLmN1cnNvckNvdW50LCBjdXJzb3JTcGVlZDogY3Vyc29yU3BlZWQgfTtcbiAgICAgICAgdGhpcy5jdXJzb3JDb3VudCArPSBpbWFnZUNvdW50O1xuICAgIH07XG4gICAgO1xuICAgIE1vdXNlLnByb3RvdHlwZS5sb2FkQWxsQ3Vyc29ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGVJbWFnZSA9IHRoaXMucHJlbG9hZEltYWdlKCdjdXJzb3JzLnBuZycpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ2F0dGFjaycsIDE1LCAxMiwgOCk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignYmlnX2RldG9uYXRlJywgMTUsIDEyLCAzKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdidWlsZF9jb21tYW5kJywgMTUsIDEyLCA5KTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdkZWZhdWx0Jyk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignZGV0b25hdGUnLCAxNSwgMTIsIDMpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ2xvYWRfdmVoaWNsZScsIDE1LCAxMiwgMywgMik7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcigndW5rbm93bicpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ3Vua25vd24nKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdtb3ZlJywgMTUsIDEyKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdub19kZWZhdWx0Jyk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignbm9fbW92ZScsIDE1LCAxMik7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignbm9fcGFuX2JvdHRvbScsIDE1LCAyNCk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignbm9fcGFuX2JvdHRvbV9sZWZ0JywgMCwgMjQpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ25vX3Bhbl9ib3R0b21fcmlnaHQnLCAzMCwgMjQpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ25vX3Bhbl9sZWZ0JywgMCwgMTIpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ25vX3Bhbl9yaWdodCcsIDMwLCAxMik7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcignbm9fcGFuX3RvcCcsIDE1LCAwKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdub19wYW5fdG9wX2xlZnQnLCAwLCAwKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdub19wYW5fdG9wX3JpZ2h0JywgMzAsIDApO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ25vX3JlcGFpcicsIDE1LCAwKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdub19zZWxsJywgMTUsIDEyKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdwYW5fYm90dG9tJywgMTUsIDI0KTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdwYW5fYm90dG9tX2xlZnQnLCAwLCAyNCk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcigncGFuX2JvdHRvbV9yaWdodCcsIDMwLCAyNCk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcigncGFuX2xlZnQnLCAwLCAxMik7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcigncGFuX3JpZ2h0JywgMzAsIDEyKTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdwYW5fdG9wJywgMTUsIDApO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ3Bhbl90b3BfbGVmdCcsIDAsIDApO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ3Bhbl90b3BfcmlnaHQnLCAzMCwgMCk7XG4gICAgICAgIHRoaXMubG9hZEN1cnNvcigncmVwYWlyJywgMTUsIDAsIDI0KTtcbiAgICAgICAgdGhpcy5sb2FkQ3Vyc29yKCdzZWxlY3QnLCAxNSwgMTIsIDYsIDIpO1xuICAgICAgICB0aGlzLmxvYWRDdXJzb3IoJ3NlbGwnLCAxNSwgMTIsIDI0KTtcbiAgICB9O1xuICAgIHJldHVybiBNb3VzZTtcbn0oVmlzdWFsT2JqZWN0KSk7XG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TW91c2UuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XG52YXIgT3ZlcmxheSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT3ZlcmxheSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBPdmVybGF5KG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ292ZXJsYXknKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPdmVybGF5LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNvbnRleHQsIGN1clBsYXllclRlYW0sIGdyaWRTaXplLCBzY3JlZW4sIHVuaXRzLCB2ZWhpY2xlc0ZhY3RvcnksIHNpZGViYXIsIGVuZW15LCBkZWJ1Z01vZGUpIHtcbiAgICAgICAgLy8gRmluYWxseSBkcmF3IHRoZSB0b3AgcGFydCB3aXRoIGFwcHJvcHJpYXRlIGFuaW1hdGlvblxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IHRoaXMucGl4ZWxXaWR0aDtcbiAgICAgICAgdmFyIGltYWdlSGVpZ2h0ID0gdGhpcy5waXhlbEhlaWdodDtcbiAgICAgICAgdmFyIHggPSBNYXRoLnJvdW5kKCh0aGlzLnggKyB0aGlzLmdyaWRPZmZzZXRYKSAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LngpO1xuICAgICAgICB2YXIgeSA9IE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuZ3JpZE9mZnNldFkpICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueSk7XG4gICAgICAgIHZhciBpbWFnZUxpc3QgPSB0aGlzLnNwcml0ZUFycmF5W3RoaXMudHlwZV07XG4gICAgICAgIHZhciBpbWFnZUluZGV4ID0gdGhpcy5zdGFnZTtcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zcHJpdGVDYW52YXMsIChpbWFnZUxpc3Qub2Zmc2V0ICsgaW1hZ2VJbmRleCkgKiBpbWFnZVdpZHRoLCAwLCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgeCwgeSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xuICAgICAgICByZXR1cm47XG4gICAgfTtcbiAgICByZXR1cm4gT3ZlcmxheTtcbn0oR2FtZU9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBPdmVybGF5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3ZlcmxheS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgVmlzdWFsT2JqZWN0ID0gcmVxdWlyZShcIi4vVmlzdWFsT2JqZWN0XCIpO1xudmFyIE92ZXJsYXkgPSByZXF1aXJlKFwiLi9PdmVybGF5XCIpO1xudmFyIE92ZXJsYXlGYWN0b3J5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPdmVybGF5RmFjdG9yeSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBPdmVybGF5RmFjdG9yeSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnR5cGVzID0gW107XG4gICAgICAgIF90aGlzLm92ZXJsYXlEZXRhaWxzID0ge1xuICAgICAgICAgICAgJ3RpYmVyaXVtJzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICd0aWJlcml1bScsXG4gICAgICAgICAgICAgICAgY291bnQ6IDIsXG4gICAgICAgICAgICAgICAgcGl4ZWxXaWR0aDogMjQsXG4gICAgICAgICAgICAgICAgcGl4ZWxIZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICAgIHN0YWdlQ291bnQ6IDEyLFxuICAgICAgICAgICAgICAgIGdyaWRPZmZzZXRYOiAwLFxuICAgICAgICAgICAgICAgIGdyaWRPZmZzZXRZOiAwLFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICcwJywgY291bnQ6IDEyIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJzEnLCBjb3VudDogMTIgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndHJlZSc6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJlZScsXG4gICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgc3RhZ2VDb3VudDogMTAsXG4gICAgICAgICAgICAgICAgcGl4ZWxXaWR0aDogNDgsXG4gICAgICAgICAgICAgICAgcGl4ZWxIZWlnaHQ6IDQ4LFxuICAgICAgICAgICAgICAgIGdyaWRPZmZzZXRYOiAwLFxuICAgICAgICAgICAgICAgIGdyaWRPZmZzZXRZOiAtMSxcbiAgICAgICAgICAgICAgICBpbWFnZXNUb0xvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnMCcsIGNvdW50OiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICcxJywgY291bnQ6IDEwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJzInLCBjb3VudDogMTAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndHJlZXMnOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyZWVzJyxcbiAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgICBzdGFnZUNvdW50OiAxMCxcbiAgICAgICAgICAgICAgICBncmlkT2Zmc2V0WDogMCxcbiAgICAgICAgICAgICAgICBncmlkT2Zmc2V0WTogLTEsXG4gICAgICAgICAgICAgICAgcGl4ZWxXaWR0aDogNzIsXG4gICAgICAgICAgICAgICAgcGl4ZWxIZWlnaHQ6IDQ4LFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICcwJywgY291bnQ6IDEwIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLnByZWxvYWRDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmxvYWRlZENvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPdmVybGF5RmFjdG9yeS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBvdmVybGF5ID0gbmV3IE92ZXJsYXkobmFtZSk7XG4gICAgICAgIHZhciBkZXRhaWxzID0gdGhpcy5vdmVybGF5RGV0YWlsc1tuYW1lXTtcbiAgICAgICAgdGhpcy5sb2FkU3ByaXRlU2hlZXQob3ZlcmxheSwgZGV0YWlscywgJ3RpbGVzL3RlbXBlcmF0ZScpO1xuICAgICAgICAvKlxuICAgICAgICB2YXIgaW1hZ2VBcnJheSA9IFtdO1xuICAgICAgICBmb3IoaT0wO2k8ZGV0YWlscy5jb3VudDtpKyspe1xuICAgICAgICAgICAgaW1hZ2VBcnJheVtpXSA9IHRoaXMubG9hZEltYWdlQXJyYXkoJ3RpbGVzL3RlbXBlcmF0ZS8nK25hbWUrJy8nK25hbWUrJy0nK2ksZGV0YWlscy5zdGFnZUNvdW50LCcuZ2lmJyk7XG4gICAgICAgIH1cbiAgICAgICAgb3ZlcmxheVR5cGUuaW1hZ2VBcnJheSA9IGltYWdlQXJyYXk7XG4gICAgICAgICovXG4gICAgICAgICQuZXh0ZW5kKG92ZXJsYXksIGRldGFpbHMpO1xuICAgICAgICB0aGlzLnR5cGVzW25hbWVdID0gb3ZlcmxheTtcbiAgICB9O1xuICAgIE92ZXJsYXlGYWN0b3J5LnByb3RvdHlwZS5sb2FkQWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvYWQoJ3RpYmVyaXVtJyk7XG4gICAgICAgIHRoaXMubG9hZCgndHJlZScpO1xuICAgICAgICB0aGlzLmxvYWQoJ3RyZWVzJyk7XG4gICAgfTtcbiAgICBPdmVybGF5RmFjdG9yeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBkZXRhaWxzLm5hbWU7XG4gICAgICAgIHZhciBuZXdPdmVybGF5ID0gbmV3IE92ZXJsYXkobmFtZSk7XG4gICAgICAgIG5ld092ZXJsYXkuc3RhZ2UgPSAwO1xuICAgICAgICAkLmV4dGVuZChuZXdPdmVybGF5LCB0aGlzLnR5cGVzW25hbWVdKTtcbiAgICAgICAgJC5leHRlbmQobmV3T3ZlcmxheSwgZGV0YWlscyk7XG4gICAgICAgIG5ld092ZXJsYXkudHlwZSA9ICcwJztcbiAgICAgICAgcmV0dXJuIG5ld092ZXJsYXk7XG4gICAgfTtcbiAgICByZXR1cm4gT3ZlcmxheUZhY3Rvcnk7XG59KFZpc3VhbE9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBPdmVybGF5RmFjdG9yeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU92ZXJsYXlGYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIFBsYXllciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZXIodGVhbSwgc3RhcnRpbmdDYXNoKSB7XG4gICAgICAgIHRoaXMudGVhbSA9IHRlYW07XG4gICAgICAgIHRoaXMuY2FzaCA9IHN0YXJ0aW5nQ2FzaDtcbiAgICB9XG4gICAgcmV0dXJuIFBsYXllcjtcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBsYXllci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBQb2ludCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIHJldHVybiBQb2ludDtcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UG9pbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUmVjdGFuZ2xlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlY3RhbmdsZShsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWN0YW5nbGUucHJvdG90eXBlLCBcInJpZ2h0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWN0YW5nbGUucHJvdG90eXBlLCBcImJvdHRvbVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBSZWN0YW5nbGUucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICB2YXIgeCA9IE1hdGgubWF4KHRoaXMubGVmdCwgb3RoZXIubGVmdCksIG51bTEgPSBNYXRoLm1pbih0aGlzLmxlZnQgKyB0aGlzLndpZHRoLCBvdGhlci5sZWZ0ICsgb3RoZXIud2lkdGgpLCB5ID0gTWF0aC5tYXgodGhpcy50b3AsIG90aGVyLnRvcCksIG51bTIgPSBNYXRoLm1pbih0aGlzLnRvcCArIHRoaXMuaGVpZ2h0LCBvdGhlci50b3AgKyBvdGhlci5oZWlnaHQpO1xuICAgICAgICBpZiAobnVtMSA+PSB4ICYmIG51bTIgPj0geSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgsIHksIG51bTEgLSB4LCBudW0yIC0geSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBSZWN0YW5nbGUuZW1wdHk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVjdGFuZ2xlLCBcImVtcHR5XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW1wdHk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBSZWN0YW5nbGUuX2VtcHR5ID0gbmV3IFJlY3RhbmdsZSgwLCAwLCAwLCAwKTtcbiAgICByZXR1cm4gUmVjdGFuZ2xlO1xufSgpKTtcbm1vZHVsZS5leHBvcnRzID0gUmVjdGFuZ2xlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVjdGFuZ2xlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBWaXN1YWxPYmplY3QgPSByZXF1aXJlKFwiLi9WaXN1YWxPYmplY3RcIik7XG52YXIgU2lkZWJhciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2lkZWJhciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaWRlYmFyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMucHJlbG9hZENvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubG9hZGVkQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5yZXBhaXJJbWFnZUJpZyA9IG51bGw7XG4gICAgICAgIF90aGlzLnByaW1hcnlCdWlsZGluZ0ltYWdlID0gbnVsbDtcbiAgICAgICAgX3RoaXMudGFic0ltYWdlID0gbnVsbDtcbiAgICAgICAgX3RoaXMud2lkdGggPSAxNjA7XG4gICAgICAgIF90aGlzLmxlZnQgPSAwO1xuICAgICAgICBfdGhpcy50b3AgPSAwO1xuICAgICAgICBfdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuY2FzaCA9IDA7XG4gICAgICAgIF90aGlzLmRlcGxveU1vZGUgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMucmVwYWlyTW9kZSA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5zZWxsTW9kZSA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5tZXNzYWdlQm94ID0gbnVsbDtcbiAgICAgICAgX3RoaXMuYWxsQnV0dG9ucyA9IFtdO1xuICAgICAgICBfdGhpcy5sZWZ0QnV0dG9ucyA9IFtdO1xuICAgICAgICBfdGhpcy5yaWdodEJ1dHRvbnMgPSBbXTtcbiAgICAgICAgX3RoaXMudGV4dEJyaWdodG5lc3MgPSAwO1xuICAgICAgICBfdGhpcy50ZXh0QnJpZ2h0bmVzc0RlbHRhID0gLTAuMTtcbiAgICAgICAgX3RoaXMuaWNvbldpZHRoID0gNjQ7XG4gICAgICAgIF90aGlzLmljb25IZWlnaHQgPSA0ODtcbiAgICAgICAgX3RoaXMubGVmdEJ1dHRvbk9mZnNldCA9IDA7XG4gICAgICAgIF90aGlzLnJpZ2h0QnV0dG9uT2Zmc2V0ID0gMDtcbiAgICAgICAgX3RoaXMuYnVpbGRTcGVlZE11bHRpcGxpZXIgPSAzMDA7XG4gICAgICAgIF90aGlzLnBvd2VyT3V0ID0gMDtcbiAgICAgICAgX3RoaXMucG93ZXJJbiA9IDA7XG4gICAgICAgIF90aGlzLmxvd1Bvd2VyTW9kZSA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5wb3dlclNjYWxlID0gNDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBTaWRlYmFyLnByb3RvdHlwZS5maW5pc2hEZXBsb3lpbmdCdWlsZGluZyA9IGZ1bmN0aW9uIChidWlsZGluZ3MsIGJ1aWxkaW5nc0ZhY3RvcnksIHR1cnJldHMsIHR1cnJldHNGYWN0b3J5LCBzb3VuZHNNYW5hZ2VyLCBtb3VzZSwgY3VyUGxheWVyVGVhbSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1aWxkaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJ1aWxkaW5nc1tpXS5uYW1lID09ICdjb25zdHJ1Y3Rpb24teWFyZCcgJiYgYnVpbGRpbmdzW2ldLnRlYW0gPT0gY3VyUGxheWVyVGVhbSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nc1tpXS5zdGF0dXMgPSAnY29uc3RydWN0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGlmIChidWlsZGluZ3NGYWN0b3J5LnR5cGVzW3RoaXMuZGVwbG95QnVpbGRpbmddKSB7XG4gICAgICAgICAgICBidWlsZGluZ3MucHVzaChidWlsZGluZ3NGYWN0b3J5LmFkZCh7IG5hbWU6IHRoaXMuZGVwbG95QnVpbGRpbmcsIHg6IG1vdXNlLmdyaWRYLCB5OiBtb3VzZS5ncmlkWSwgc3RhdHVzOiAnYnVpbGQnLCB0ZWFtOiBjdXJQbGF5ZXJUZWFtIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHR1cnJldHMucHVzaCh0dXJyZXRzRmFjdG9yeS5hZGQoeyBuYW1lOiB0aGlzLmRlcGxveUJ1aWxkaW5nLCB4OiBtb3VzZS5ncmlkWCwgeTogbW91c2UuZ3JpZFksIHRlYW06IGN1clBsYXllclRlYW0sIHN0YXR1czogJ2J1aWxkJyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdjb25zdHJ1Y3Rpb24nKTtcbiAgICAgICAgdGhpcy5kZXBsb3lNb2RlID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmxlZnRCdXR0b25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRCdXR0b25zW2ldLnN0YXR1cyA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVwbG95QnVpbGRpbmcgPSBudWxsO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuZmluaXNoRGVwbG95aW5nVW5pdCA9IGZ1bmN0aW9uICh1bml0QnV0dG9uLCBidWlsZGluZ3MsIHVuaXRzLCBpbmZhbnRyeUZhY3RvcnksIHZlaGljbGVzRmFjdG9yeSwgY3VyUGxheWVyVGVhbSkge1xuICAgICAgICB2YXIgY29uc3RydWN0ZWRBdDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWlsZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChidWlsZGluZ3NbaV0ubmFtZSA9PSB1bml0QnV0dG9uLmRlcGVuZGVuY3lbMF0pIHtcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RlZEF0ID0gYnVpbGRpbmdzW2ldO1xuICAgICAgICAgICAgICAgIC8vZ2FtZS5idWlsZGluZ3NbaV0uc3RhdHVzPSdjb25zdHJ1Y3QnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgaWYgKHVuaXRCdXR0b24udHlwZSA9PSAnaW5mYW50cnknKSB7XG4gICAgICAgICAgICB1bml0cy5wdXNoKGluZmFudHJ5RmFjdG9yeS5hZGQoe1xuICAgICAgICAgICAgICAgIG5hbWU6IHVuaXRCdXR0b24ubmFtZSxcbiAgICAgICAgICAgICAgICB0ZWFtOiBjdXJQbGF5ZXJUZWFtLFxuICAgICAgICAgICAgICAgIHg6IGNvbnN0cnVjdGVkQXQueCArIGNvbnN0cnVjdGVkQXQuZ3JpZFdpZHRoIC8gMixcbiAgICAgICAgICAgICAgICB5OiBjb25zdHJ1Y3RlZEF0LnkgKyBjb25zdHJ1Y3RlZEF0LmdyaWRIZWlnaHQsXG4gICAgICAgICAgICAgICAgbW92ZURpcmVjdGlvbjogNCxcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnM6IFt7IHR5cGU6ICdtb3ZlJywgZGlzdGFuY2U6IDIgfV0sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5pdEJ1dHRvbi50eXBlID09ICd2ZWhpY2xlJykge1xuICAgICAgICAgICAgY29uc3RydWN0ZWRBdC5zdGF0dXMgPSAnY29uc3RydWN0JztcbiAgICAgICAgICAgIHZhciB2ZWhpY2xlID0gdmVoaWNsZXNGYWN0b3J5LmFkZCh7XG4gICAgICAgICAgICAgICAgbmFtZTogdW5pdEJ1dHRvbi5uYW1lLFxuICAgICAgICAgICAgICAgIHRlYW06IGN1clBsYXllclRlYW0sXG4gICAgICAgICAgICAgICAgeDogY29uc3RydWN0ZWRBdC54ICsgMSxcbiAgICAgICAgICAgICAgICB5OiBjb25zdHJ1Y3RlZEF0LnkgKyAzLFxuICAgICAgICAgICAgICAgIG1vdmVEaXJlY3Rpb246IDE2LFxuICAgICAgICAgICAgICAgIHR1cnJldERpcmVjdGlvbjogMTYsXG4gICAgICAgICAgICAgICAgb3JkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtb3ZlJywgdG86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoY29uc3RydWN0ZWRBdC54IC0gMSArIChNYXRoLnJhbmRvbSgpICogNCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgb3JkZXJzOnt0eXBlOidtb3ZlJyx0bzp7eDpNYXRoLmZsb29yKGNvbnN0cnVjdGVkQXQueC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoY29uc3RydWN0ZWRBdC55ICsgNSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdW5pdHMucHVzaCh2ZWhpY2xlKTtcbiAgICAgICAgICAgIC8vYWxlcnQodmVoaWNsZS5vcmRlcnMudG8ueCArICcgJyt2ZWhpY2xlLm9yZGVycy50by55KVxuICAgICAgICB9XG4gICAgICAgIC8vZ2FtZS5idWlsZGluZ3MucHVzaChidWlsZGluZ3MuYWRkKHtuYW1lOnRoaXMuZGVwbG95QnVpbGRpbmcseDptb3VzZS5ncmlkWCx5Om1vdXNlLmdyaWRZLHN0YXR1czonYnVpbGQnfSkpO1xuICAgICAgICAvL3NvdW5kcy5wbGF5KCdjb25zdHJ1Y3Rpb24nKVxuICAgICAgICAvL3RoaXMuZGVwbG95TW9kZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5yaWdodEJ1dHRvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJpZ2h0QnV0dG9uc1tpXS5kZXBlbmRlbmN5WzBdID09IHVuaXRCdXR0b24uZGVwZW5kZW5jeVswXSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRCdXR0b25zW2ldLnN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVwbG95QnVpbGRpbmcgPSBudWxsO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuaG92ZXJlZEJ1dHRvbiA9IGZ1bmN0aW9uIChtb3VzZSkge1xuICAgICAgICB2YXIgY2xpY2tZID0gbW91c2UueSAtIHRoaXMudG9wO1xuICAgICAgICB2YXIgY2xpY2tYID0gbW91c2UueDtcbiAgICAgICAgaWYgKGNsaWNrWSA+PSAxNjUgJiYgY2xpY2tZIDw9IDQ1NSkge1xuICAgICAgICAgICAgdmFyIGJ1dHRvblBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNsaWNrWSA+PSAxNjUgKyBpICogNDggJiYgY2xpY2tZIDw9IDE2NSArIGkgKiA0OCArIDQ4KSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJ1dHRvblNpZGUsIGJ1dHRvblByZXNzZWRJbmRleCwgYnV0dG9ucztcbiAgICAgICAgICAgIGlmIChjbGlja1ggPj0gNTAwICYmIGNsaWNrWCA8PSA1NjQpIHtcbiAgICAgICAgICAgICAgICBidXR0b25TaWRlID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJ1dHRvblByZXNzZWRJbmRleCA9IHRoaXMubGVmdEJ1dHRvbk9mZnNldCArIGJ1dHRvblBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGJ1dHRvbnMgPSB0aGlzLmxlZnRCdXR0b25zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tYID49IDU3MCAmJiBjbGlja1ggPD0gNjM0KSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uU2lkZSA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgYnV0dG9uUHJlc3NlZEluZGV4ID0gdGhpcy5yaWdodEJ1dHRvbk9mZnNldCArIGJ1dHRvblBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGJ1dHRvbnMgPSB0aGlzLnJpZ2h0QnV0dG9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidXR0b25zICYmIGJ1dHRvbnMubGVuZ3RoID4gYnV0dG9uUHJlc3NlZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvblByZXNzZWQgPSBidXR0b25zW2J1dHRvblByZXNzZWRJbmRleF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvblByZXNzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24gKGV2LCByaWdodENsaWNrLCBtb3VzZSwgc291bmRzTWFuYWdlcikge1xuICAgICAgICB2YXIgY2xpY2tZID0gbW91c2UueSAtIHRoaXMudG9wO1xuICAgICAgICB2YXIgY2xpY2tYID0gbW91c2UueDtcbiAgICAgICAgLy9hbGVydCgyKVxuICAgICAgICAvLyBwcmVzcyBhIHRvcCBidXR0b25cbiAgICAgICAgaWYgKGNsaWNrWSA+PSAxNDYgJiYgY2xpY2tZIDw9IDE2MCkge1xuICAgICAgICAgICAgaWYgKGNsaWNrWCA+PSA0ODUgJiYgY2xpY2tYIDw9IDUzMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVwYWlyTW9kZSA9ICF0aGlzLnJlcGFpck1vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxsTW9kZSA9IHRoaXMubWFwTW9kZSA9IHRoaXMuZGVwbG95TW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQoJ3JlcGFpcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1ggPj0gNTM4ICYmIGNsaWNrWCA8PSA1ODIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGxNb2RlID0gIXRoaXMuc2VsbE1vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBhaXJNb2RlID0gdGhpcy5tYXBNb2RlID0gdGhpcy5kZXBsb3lNb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy9hbGVydCgnbWFwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWCA+PSA1OTAgJiYgY2xpY2tYIDw9IDYzNSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwTW9kZSA9ICF0aGlzLm1hcE1vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBhaXJNb2RlID0gdGhpcy5zZWxsTW9kZSA9IHRoaXMuZGVwbG95TW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHJlc3MgYSBzY3JvbGwgYnV0dG9uXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2xpY2tZID49IDQ1NSAmJiBjbGlja1kgPD0gNDgwKSB7XG4gICAgICAgICAgICBpZiAoY2xpY2tYID49IDUwMCAmJiBjbGlja1ggPD0gNTMwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVmdEJ1dHRvbk9mZnNldCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0QnV0dG9uT2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kc01hbmFnZXIucGxheSgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tYID49IDUzMiAmJiBjbGlja1ggPD0gNTYyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVmdEJ1dHRvbk9mZnNldCArIDYgPCB0aGlzLmxlZnRCdXR0b25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRCdXR0b25PZmZzZXQrKztcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdidXR0b24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1ggPj0gNTcwICYmIGNsaWNrWCA8PSA2MDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yaWdodEJ1dHRvbk9mZnNldCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodEJ1dHRvbk9mZnNldC0tO1xuICAgICAgICAgICAgICAgICAgICBzb3VuZHNNYW5hZ2VyLnBsYXkoJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWCA+PSA2MDIgJiYgY2xpY2tYIDw9IDYzMikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJpZ2h0QnV0dG9uT2Zmc2V0ICsgNiA8IHRoaXMucmlnaHRCdXR0b25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uT2Zmc2V0Kys7XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kc01hbmFnZXIucGxheSgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJlc3MgYSB1bml0IGljb25cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbGlja1kgPj0gMTY1ICYmIGNsaWNrWSA8PSA0NTUpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25Qb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjbGlja1kgPj0gMTY1ICsgaSAqIDQ4ICYmIGNsaWNrWSA8PSAxNjUgKyBpICogNDggKyA0OCkge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25Qb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBidXR0b25TaWRlLCBidXR0b25QcmVzc2VkSW5kZXgsIGJ1dHRvbnM7XG4gICAgICAgICAgICBpZiAoY2xpY2tYID49IDUwMCAmJiBjbGlja1ggPD0gNTY0KSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uU2lkZSA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBidXR0b25QcmVzc2VkSW5kZXggPSB0aGlzLmxlZnRCdXR0b25PZmZzZXQgKyBidXR0b25Qb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBidXR0b25zID0gdGhpcy5sZWZ0QnV0dG9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWCA+PSA1NzAgJiYgY2xpY2tYIDw9IDYzNCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvblNpZGUgPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJ1dHRvblByZXNzZWRJbmRleCA9IHRoaXMucmlnaHRCdXR0b25PZmZzZXQgKyBidXR0b25Qb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBidXR0b25zID0gdGhpcy5yaWdodEJ1dHRvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnV0dG9ucyAmJiBidXR0b25zLmxlbmd0aCA+IGJ1dHRvblByZXNzZWRJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBidXR0b25QcmVzc2VkID0gYnV0dG9uc1tidXR0b25QcmVzc2VkSW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChidXR0b25QcmVzc2VkLnN0YXR1cyA9PSAnJyAmJiAhcmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuYnVpbGRMaXN0LnB1c2ggKHtzaWRlOidsZWZ0Jyxjb3VudGVyOjAsbmFtZTp0aGlzLmxlZnRCdXR0b25zW2J1dHRvblByZXNzZWRdLm5hbWUsYnV0dG9uUHJlc3NlZDpidXR0b25QcmVzc2VkfSk7ICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzYWJsZSBhbGwgb3RoZXIgYnV0dG9ucyB3aXRoIHNhbWUgZGVwZW5kZW5jeVxuICAgICAgICAgICAgICAgICAgICAvLyBpZihidXR0b25QcmVzc2VkLmNvc3QgPD0gdGhpcy5jYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBidXR0b25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uc1tpXS5kZXBlbmRlbmN5WzBdID09IGJ1dHRvblByZXNzZWQuZGVwZW5kZW5jeVswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnNbaV0uc3RhdHVzID0gJ2Rpc2FibGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblByZXNzZWQuc3RhdHVzID0gJ2J1aWxkaW5nJztcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uUHJlc3NlZC5jb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uUHJlc3NlZC5zcGVudCA9IGJ1dHRvblByZXNzZWQuY29zdDtcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdidWlsZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHNvdW5kcy5wbGF5KCdpbnN1ZmZpY2llbnRfZnVuZHMnKTtcbiAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJ1dHRvblByZXNzZWQuc3RhdHVzID09ICdidWlsZGluZycgJiYgIXJpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdub3RfcmVhZHknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnV0dG9uUHJlc3NlZC5zdGF0dXMgPT0gJ2J1aWxkaW5nJyAmJiByaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblByZXNzZWQuc3RhdHVzID0gJ2hvbGQnO1xuICAgICAgICAgICAgICAgICAgICBzb3VuZHNNYW5hZ2VyLnBsYXkoJ29uX2hvbGQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnV0dG9uUHJlc3NlZC5zdGF0dXMgPT0gJ2hvbGQnICYmICFyaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblByZXNzZWQuc3RhdHVzID0gJ2J1aWxkaW5nJztcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdidWlsZGluZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoYnV0dG9uUHJlc3NlZC5zdGF0dXMgPT0gJ2hvbGQnIHx8IGJ1dHRvblByZXNzZWQuc3RhdHVzID09ICdyZWFkeScpICYmIHJpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uUHJlc3NlZC5zdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdjYW5jZWxsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNoICs9IGJ1dHRvblByZXNzZWQuY29zdCAtIGJ1dHRvblByZXNzZWQuc3BlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBidXR0b25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zW2ldLnN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnV0dG9uUHJlc3NlZC5zdGF0dXMgPT0gJ3JlYWR5JyAmJiAhcmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uUHJlc3NlZC50eXBlID09ICdidWlsZGluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwbG95TW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KCdkZXBsb3knKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXBhaXJNb2RlID0gdGhpcy5zZWxsTW9kZSA9IHRoaXMubWFwTW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBsb3lCdWlsZGluZyA9IGJ1dHRvblByZXNzZWQubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChidXR0b25QcmVzc2VkLnN0YXR1cyA9PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kc01hbmFnZXIucGxheSgnYnVpbGRpbmdfaW5fcHJvZ3Jlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLmNoZWNrRGVwZW5kZW5jeSA9IGZ1bmN0aW9uIChidWlsZGluZ3MsIHNvdW5kc01hbmFnZXIsIGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgLy9hbGVydCh0aGlzLmFsbEJ1dHRvbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbEJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSB0aGlzLmFsbEJ1dHRvbnNbaV07XG4gICAgICAgICAgICB2YXIgZGVwZW5kZW5jaWVzU2F0aXNmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vYWxlcnQoYnV0dG9uLmRlcGVuZGVuY3kubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBidXR0b24uZGVwZW5kZW5jeS5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gYnV0dG9uLmRlcGVuZGVuY3lbal07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IGJ1aWxkaW5ncy5sZW5ndGggLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnVpbGRpbmcgPSBidWlsZGluZ3Nba107XG4gICAgICAgICAgICAgICAgICAgIGlmIChidWlsZGluZy5uYW1lID09IGRlcGVuZGVuY3lcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGJ1aWxkaW5nLnN0YXR1cyAhPSAnYnVpbGQnXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBidWlsZGluZy5saWZlICE9ICd1bHRyYS1kYW1hZ2VkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgYnVpbGRpbmcudGVhbSA9PSBjdXJQbGF5ZXJUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KGJ1aWxkaW5nLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNTYXRpc2ZpZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbi50eXBlID09ICdidWlsZGluZycpIHtcbiAgICAgICAgICAgICAgICAvL2NoZWNrIGxlZnQgc2lkZVxuICAgICAgICAgICAgICAgIHZhciBidXR0b25Gb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZEluZGV4O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSB0aGlzLmxlZnRCdXR0b25zLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlZnRCdXR0b25zW2pdLm5hbWUgPT0gYnV0dG9uLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5kZXggPSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KGJ1dHRvbi5uYW1lICsgXCIsbGI9XCIrdGhpcy5sZWZ0QnV0dG9uc1tqXS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KGRlcGVuZGVuY2llc1NhdGlzZmllZCArXCIgXCIgKyBidXR0b25Gb3VuZCArICcgICcrYnV0dG9uLm5hbWUgKyAnIGF0IGluZGV4JyArIGZvdW5kSW5kZXgpXG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY2llc1NhdGlzZmllZCAmJiAhYnV0dG9uRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0QnV0dG9ucy5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICAvL2J1dHRvbi5jb3N0ID0gYnVpbGRpbmdzLnR5cGVzW2J1dHRvbi5uYW1lXS5jb3N0O1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uc3BlZWQgPSB0aGlzLmJ1aWxkU3BlZWRNdWx0aXBsaWVyIC8gYnV0dG9uLmNvc3Q7XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kc01hbmFnZXIucGxheSgnbmV3X2NvbnN0cnVjdGlvbl9vcHRpb25zJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJ1dHRvbkZvdW5kICYmICFkZXBlbmRlbmNpZXNTYXRpc2ZpZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGVmdEJ1dHRvbnNbZm91bmRJbmRleF0uc3RhdHVzID09ICdidWlsZGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMubGVmdEJ1dHRvbnNbZm91bmRJbmRleF0uc3RhdHVzID09ICdob2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfHwgdGhpcy5sZWZ0QnV0dG9uc1tmb3VuZEluZGV4XS5zdGF0dXMgPT0gJ3JlYWR5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IHRoaXMubGVmdEJ1dHRvbnMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRCdXR0b25zW2pdLnN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdEJ1dHRvbnMuc3BsaWNlKGZvdW5kSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRCdXR0b25PZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1dHRvbi50eXBlID09ICdpbmZhbnRyeScgfHwgYnV0dG9uLnR5cGUgPT0gJ3ZlaGljbGUnKSB7XG4gICAgICAgICAgICAgICAgLy9jaGVjayByaWdodCBzaWRlIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmRJbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5yaWdodEJ1dHRvbnMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmlnaHRCdXR0b25zW2pdLm5hbWUgPT0gYnV0dG9uLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5kZXggPSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbmNpZXNTYXRpc2ZpZWQgJiYgIWJ1dHRvbkZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRCdXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uY291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8qc3dpdGNoIChidXR0b24udHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdpbmZhbnRyeSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNvc3QgPSAxMDA7Ly9pbmZhbnRyeS50eXBlc1tidXR0b24ubmFtZV0uY29zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNvc3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zcGVlZCA9IHRoaXMuYnVpbGRTcGVlZE11bHRpcGxpZXIgLyBidXR0b24uY29zdDtcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCduZXdfY29uc3RydWN0aW9uX29wdGlvbnMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnV0dG9uRm91bmQgJiYgIWRlcGVuZGVuY2llc1NhdGlzZmllZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yaWdodEJ1dHRvbnNbZm91bmRJbmRleF0uc3RhdHVzID09ICdidWlsZGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMucmlnaHRCdXR0b25zW2ZvdW5kSW5kZXhdLnN0YXR1cyA9PSAnaG9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMucmlnaHRCdXR0b25zW2ZvdW5kSW5kZXhdLnN0YXR1cyA9PSAncmVhZHknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5yaWdodEJ1dHRvbnMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yaWdodEJ1dHRvbnNbal0uZGVwZW5kZW5jeVswXSA9PSB0aGlzLnJpZ2h0QnV0dG9uc1tmb3VuZEluZGV4XS5kZXBlbmRlbmN5WzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uc1tqXS5zdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9ucy5zcGxpY2UoZm91bmRJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRCdXR0b25PZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKHN0YXJ0aW5nQ2FzaCwgc2NyZWVuLCBjYW52YXNXaWR0aCkge1xuICAgICAgICB0aGlzLmNhc2ggPSBzdGFydGluZ0Nhc2g7XG4gICAgICAgIHRoaXMudGFic0ltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvdGFicy5wbmcnKTtcbiAgICAgICAgdGhpcy5zaWRlYmFySW1hZ2UgPSB0aGlzLnByZWxvYWRJbWFnZSgnc2lkZWJhci9zaWRlYmFyLnBuZycpO1xuICAgICAgICB0aGlzLnByaW1hcnlCdWlsZGluZ0ltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvcHJpbWFyeS5wbmcnKTtcbiAgICAgICAgdGhpcy5yZWFkeUltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvcmVhZHkucG5nJyk7XG4gICAgICAgIHRoaXMuaG9sZEltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvaG9sZC5wbmcnKTtcbiAgICAgICAgdGhpcy5wbGFjZW1lbnRXaGl0ZUltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvcGxhY2VtZW50LXdoaXRlLmdpZicpO1xuICAgICAgICB0aGlzLnBsYWNlbWVudFJlZEltYWdlID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvcGxhY2VtZW50LXJlZC5naWYnKTtcbiAgICAgICAgdGhpcy5wb3dlckluZGljYXRvciA9IHRoaXMucHJlbG9hZEltYWdlKCdzaWRlYmFyL3Bvd2VyL3Bvd2VyX2luZGljYXRvcjIucG5nJyk7XG4gICAgICAgIHRoaXMubWVzc2FnZUJveCA9IHRoaXMucHJlbG9hZEltYWdlKCdzaWRlYmFyL21lc3NhZ2VfYm94LmpwZycpO1xuICAgICAgICB0aGlzLnJlcGFpckJ1dHRvblByZXNzZWQgPSB0aGlzLnByZWxvYWRJbWFnZSgnc2lkZWJhci9idXR0b25zL3JlcGFpci1wcmVzc2VkLnBuZycpO1xuICAgICAgICB0aGlzLnNlbGxCdXR0b25QcmVzc2VkID0gdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvYnV0dG9ucy9zZWxsLXByZXNzZWQucG5nJyk7XG4gICAgICAgIHRoaXMucmVwYWlySW1hZ2VCaWcgPSB0aGlzLnByZWxvYWRJbWFnZSgnc2lkZWJhci9yZXBhaXItYmlnLnBuZycpO1xuICAgICAgICB0aGlzLnJlcGFpckltYWdlU21hbGwgPSB0aGlzLnByZWxvYWRJbWFnZSgnc2lkZWJhci9yZXBhaXItc21hbGwucG5nJyk7XG4gICAgICAgIHRoaXMudG9wID0gc2NyZWVuLnZpZXdwb3J0LnRvcCAtIDI7XG4gICAgICAgIHRoaXMubGVmdCA9IGNhbnZhc1dpZHRoIC0gdGhpcy53aWR0aDtcbiAgICAgICAgdmFyIGJ1dHRvbkxpc3QgPSBbXG4gICAgICAgICAgICB7IG5hbWU6ICdwb3dlci1wbGFudCcsIHR5cGU6ICdidWlsZGluZycsIGNvc3Q6IDMwMCwgZGVwZW5kZW5jeTogWydjb25zdHJ1Y3Rpb24teWFyZCddIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhZHZhbmNlZC1wb3dlci1wbGFudCcsIHR5cGU6ICdidWlsZGluZycsIGNvc3Q6IDcwMCwgZGVwZW5kZW5jeTogWydjb25zdHJ1Y3Rpb24teWFyZCcsICdwb3dlci1wbGFudCddIH0sXG4gICAgICAgICAgICAvL3tuYW1lOidiYXJyYWNrcycsdHlwZTonYnVpbGRpbmcnLGNvc3Q6MzAwLGRlcGVuZGVuY3k6Wydjb25zdHJ1Y3Rpb24teWFyZCcsJ3Bvd2VyLXBsYW50J119LFxuICAgICAgICAgICAgLy97bmFtZTonZ3VhcmQtdG93ZXInLHR5cGU6J2J1aWxkaW5nJyxjb3N0OjUwMCxkZXBlbmRlbmN5OiBbJ2NvbnN0cnVjdGlvbi15YXJkJywnYmFycmFja3MnXX0sXG4gICAgICAgICAgICB7IG5hbWU6ICdyZWZpbmVyeScsIHR5cGU6ICdidWlsZGluZycsIGNvc3Q6IDIwMDAsIGRlcGVuZGVuY3k6IFsnY29uc3RydWN0aW9uLXlhcmQnLCAncG93ZXItcGxhbnQnXSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndGliZXJpdW0tc2lsbycsIHR5cGU6ICdidWlsZGluZycsIGNvc3Q6IDE1MCwgZGVwZW5kZW5jeTogWydjb25zdHJ1Y3Rpb24teWFyZCcsICdyZWZpbmVyeSddIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd3ZWFwb25zLWZhY3RvcnknLCB0eXBlOiAnYnVpbGRpbmcnLCBjb3N0OiAyMDAwLCBkZXBlbmRlbmN5OiBbJ2NvbnN0cnVjdGlvbi15YXJkJywgJ3Bvd2VyLXBsYW50JywgJ3JlZmluZXJ5J10gfSxcbiAgICAgICAgICAgIC8ve25hbWU6J21pbmlndW5uZXInLHR5cGU6J2luZmFudHJ5Jyxjb3N0OjEwMCxkZXBlbmRlbmN5OlsnYmFycmFja3MnXX0sXG4gICAgICAgICAgICB7IG5hbWU6ICdoYXJ2ZXN0ZXInLCB0eXBlOiAndmVoaWNsZScsIGNvc3Q6IDE0MDAsIGRlcGVuZGVuY3k6IFsnd2VhcG9ucy1mYWN0b3J5JywgJ3JlZmluZXJ5J10gfSxcbiAgICAgICAgICAgIC8ve25hbWU6J2plZXAnLHR5cGU6J3ZlaGljbGUnLGNvc3Q6NDAwLGRlcGVuZGVuY3k6Wyd3ZWFwb25zLWZhY3RvcnknXX0sXG4gICAgICAgICAgICB7IG5hbWU6ICdsaWdodC10YW5rJywgdHlwZTogJ3ZlaGljbGUnLCBjb3N0OiA2MDAsIGRlcGVuZGVuY3k6IFsnd2VhcG9ucy1mYWN0b3J5J10gfVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLmFsbEJ1dHRvbnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gYnV0dG9uTGlzdFtpXTtcbiAgICAgICAgICAgIHRoaXMuYWxsQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBidXR0b24ubmFtZSxcbiAgICAgICAgICAgICAgICBpbWFnZTogdGhpcy5wcmVsb2FkSW1hZ2UoJ3NpZGViYXIvaWNvbnMvJyArIGJ1dHRvbi5uYW1lICsgJy1pY29uLnBuZycpLFxuICAgICAgICAgICAgICAgIHR5cGU6IGJ1dHRvbi50eXBlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJycsXG4gICAgICAgICAgICAgICAgY29zdDogYnV0dG9uLmNvc3QsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeTogYnV0dG9uLmRlcGVuZGVuY3lcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5kcmF3QnV0dG9uTGFiZWwgPSBmdW5jdGlvbiAobGFiZWxJbWFnZSwgeCwgeSwgY29udGV4dCkge1xuICAgICAgICB2YXIgbGFiZWxPZmZzZXRYID0gdGhpcy5pY29uV2lkdGggLyAyIC0gbGFiZWxJbWFnZS53aWR0aCAvIDI7XG4gICAgICAgIHZhciBsYWJlbE9mZnNldFkgPSB0aGlzLmljb25IZWlnaHQgLyAyO1xuICAgICAgICAvL2NvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsJyt0aGlzLnRleHRCcmlnaHRuZXNzKycpJztcbiAgICAgICAgLy9jb250ZXh0LmZpbGxUZXh0KGxhYmVsLHgrIGxhYmVsT2Zmc2V0WCx5K2xhYmVsT2Zmc2V0WSk7XG4gICAgICAgIC8vYXNkZlxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy50ZXh0QnJpZ2h0bmVzcztcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UobGFiZWxJbWFnZSwgeCArIGxhYmVsT2Zmc2V0WCwgeSArIGxhYmVsT2Zmc2V0WSk7XG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuZHJhd0J1dHRvbkNvc3QgPSBmdW5jdGlvbiAoY29zdCwgeCwgeSwgY29udGV4dCkge1xuICAgICAgICB2YXIgY29zdE9mZnNldFggPSAzNTtcbiAgICAgICAgdmFyIGNvc3RPZmZzZXRZID0gMTA7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChcIiBcIiArIGNvc3QsIHggKyBjb3N0T2Zmc2V0WCwgeSArIGNvc3RPZmZzZXRZKTtcbiAgICAgICAgLy9hbGVydChjb3N0K1wiLFwiKyh4K2Nvc3RPZmZzZXRYKStcIixcIisoeStjb3N0T2Zmc2V0WSkpO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuZHJhd0J1dHRvbiA9IGZ1bmN0aW9uIChzaWRlLCBpbmRleCwgY29udGV4dCwgc3ByaXRlQ29udGV4dCwgc3ByaXRlQ2FudmFzKSB7XG4gICAgICAgIHZhciBidXR0b25zID0gKHNpZGUgPT0gJ2xlZnQnKSA/IHRoaXMubGVmdEJ1dHRvbnMgOiB0aGlzLnJpZ2h0QnV0dG9ucztcbiAgICAgICAgdmFyIG9mZnNldCA9IChzaWRlID09ICdsZWZ0JykgPyB0aGlzLmxlZnRCdXR0b25PZmZzZXQgOiB0aGlzLnJpZ2h0QnV0dG9uT2Zmc2V0O1xuICAgICAgICB2YXIgYnV0dG9uID0gYnV0dG9uc1tpbmRleCArIG9mZnNldF07XG4gICAgICAgIHZhciB4T2Zmc2V0ID0gKHNpZGUgPT0gJ2xlZnQnKSA/IDUwMCA6IDU3MDtcbiAgICAgICAgdmFyIHlPZmZzZXQgPSAxNjUgKyB0aGlzLnRvcCArIGluZGV4ICogdGhpcy5pY29uSGVpZ2h0O1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShidXR0b24uaW1hZ2UsIHhPZmZzZXQsIHlPZmZzZXQpO1xuICAgICAgICBpZiAoYnV0dG9uLnN0YXR1cyA9PSAncmVhZHknKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdCdXR0b25MYWJlbCh0aGlzLnJlYWR5SW1hZ2UsIHhPZmZzZXQsIHlPZmZzZXQsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGJ1dHRvbi5zdGF0dXMgPT0gJ2Rpc2FibGVkJykge1xuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMDAsMjAwLDIwMCwwLjYpJztcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeE9mZnNldCwgeU9mZnNldCwgdGhpcy5pY29uV2lkdGgsIHRoaXMuaWNvbkhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYnV0dG9uLnN0YXR1cyA9PSAnYnVpbGRpbmcnKSB7XG4gICAgICAgICAgICBzcHJpdGVDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmljb25XaWR0aCwgdGhpcy5pY29uSGVpZ2h0KTtcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjAwLDIwMCwyMDAsMC42KSc7XG4gICAgICAgICAgICBzcHJpdGVDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgc3ByaXRlQ29udGV4dC5tb3ZlVG8odGhpcy5pY29uV2lkdGggLyAyLCB0aGlzLmljb25IZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQuYXJjKHRoaXMuaWNvbldpZHRoIC8gMiwgdGhpcy5pY29uSGVpZ2h0IC8gMiwgNDAsIE1hdGguUEkgKiAyICogYnV0dG9uLmNvdW50ZXIgLyAxMDAgLSBNYXRoLlBJIC8gMiwgLU1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQubW92ZVRvKHRoaXMuaWNvbldpZHRoIC8gMiwgdGhpcy5pY29uSGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBzcHJpdGVDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHNwcml0ZUNhbnZhcywgMCwgMCwgdGhpcy5pY29uV2lkdGgsIHRoaXMuaWNvbkhlaWdodCwgeE9mZnNldCwgeU9mZnNldCwgdGhpcy5pY29uV2lkdGgsIHRoaXMuaWNvbkhlaWdodCk7XG4gICAgICAgICAgICAvL2FsZXJ0KGJ1dHRvbi5zcGVlZCkgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYnV0dG9uLnN0YXR1cyA9PSAnaG9sZCcpIHtcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuaWNvbldpZHRoLCB0aGlzLmljb25IZWlnaHQpO1xuICAgICAgICAgICAgc3ByaXRlQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgxMDAsMTAwLDEwMCwwLjYpJztcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBzcHJpdGVDb250ZXh0Lm1vdmVUbyh0aGlzLmljb25XaWR0aCAvIDIsIHRoaXMuaWNvbkhlaWdodCAvIDIpO1xuICAgICAgICAgICAgc3ByaXRlQ29udGV4dC5hcmModGhpcy5pY29uV2lkdGggLyAyLCB0aGlzLmljb25IZWlnaHQgLyAyLCA0MCwgTWF0aC5QSSAqIDIgKiBidXR0b24uY291bnRlciAvIDEwMCAtIE1hdGguUEkgLyAyLCAtTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgc3ByaXRlQ29udGV4dC5tb3ZlVG8odGhpcy5pY29uV2lkdGggLyAyLCB0aGlzLmljb25IZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIHNwcml0ZUNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoc3ByaXRlQ2FudmFzLCAwLCAwLCB0aGlzLmljb25XaWR0aCwgdGhpcy5pY29uSGVpZ2h0LCB4T2Zmc2V0LCB5T2Zmc2V0LCB0aGlzLmljb25XaWR0aCwgdGhpcy5pY29uSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuZHJhd0J1dHRvbkxhYmVsKHRoaXMuaG9sZEltYWdlLCB4T2Zmc2V0LCB5T2Zmc2V0LCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUucHJvY2Vzc0J1dHRvbiA9IGZ1bmN0aW9uIChzaWRlLCBpbmRleCwgc291bmRzTWFuYWdlciwgYnVpbGRpbmdzLCB1bml0cywgaW5mYW50cnlGYWN0b3J5LCB2ZWhpY2xlc0ZhY3RvcnksIGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSAoc2lkZSA9PSAnbGVmdCcpID8gdGhpcy5sZWZ0QnV0dG9ucyA6IHRoaXMucmlnaHRCdXR0b25zO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMDsgLy8gKHNpZGU9PSdsZWZ0Jyk/dGhpcy5sZWZ0QnV0dG9uT2Zmc2V0OnRoaXMucmlnaHRCdXR0b25PZmZzZXQ7XG4gICAgICAgIHZhciBidXR0b24gPSBidXR0b25zW2luZGV4ICsgb2Zmc2V0XTtcbiAgICAgICAgdmFyIHhPZmZzZXQgPSAoc2lkZSA9PSAnbGVmdCcpID8gNTAwIDogNTcwO1xuICAgICAgICB2YXIgeU9mZnNldCA9IDE2NSArIHRoaXMudG9wICsgaW5kZXggKiB0aGlzLmljb25IZWlnaHQ7XG4gICAgICAgIGlmIChidXR0b24uc3RhdHVzID09ICdidWlsZGluZycpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2ggPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbnN1ZmZpY2llbnRGdW5kcykge1xuICAgICAgICAgICAgICAgICAgICBzb3VuZHNNYW5hZ2VyLnBsYXkoJ2luc3VmZmljaWVudF9mdW5kcycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc3VmZmljaWVudEZ1bmRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnN1ZmZpY2llbnRGdW5kcyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FzaCA8IE1hdGgucm91bmQoYnV0dG9uLmNvc3QgKiBidXR0b24uc3BlZWQgLyAxMDApKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNvdW50ZXIgKz0gYnV0dG9uLnNwZWVkICogdGhpcy5jYXNoIC8gTWF0aC5yb3VuZChidXR0b24uY29zdCAqIGJ1dHRvbi5zcGVlZCAvIDEwMCk7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnNwZW50IC09IHRoaXMuY2FzaDtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2ggPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jb3VudGVyICs9IGJ1dHRvbi5zcGVlZDtcbiAgICAgICAgICAgIGJ1dHRvbi5zcGVudCAtPSBNYXRoLnJvdW5kKGJ1dHRvbi5jb3N0ICogYnV0dG9uLnNwZWVkIC8gMTAwKTtcbiAgICAgICAgICAgIHRoaXMuY2FzaCAtPSBNYXRoLnJvdW5kKGJ1dHRvbi5jb3N0ICogYnV0dG9uLnNwZWVkIC8gMTAwKTtcbiAgICAgICAgICAgIGlmIChidXR0b24uY291bnRlciA+IDk5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXNoIC09IGJ1dHRvbi5zcGVudDtcbiAgICAgICAgICAgICAgICBidXR0b24uc3RhdHVzID0gJ3JlYWR5JztcbiAgICAgICAgICAgICAgICBpZiAoc2lkZSA9PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdjb25zdHJ1Y3Rpb25fY29tcGxldGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24udHlwZSA9PSAnaW5mYW50cnknIHx8IGJ1dHRvbi50eXBlID09ICd2ZWhpY2xlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCd1bml0X3JlYWR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaERlcGxveWluZ1VuaXQoYnV0dG9uLCBidWlsZGluZ3MsIHVuaXRzLCBpbmZhbnRyeUZhY3RvcnksIHZlaGljbGVzRmFjdG9yeSwgY3VyUGxheWVyVGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLmNoZWNrUG93ZXIgPSBmdW5jdGlvbiAoYnVpbGRpbmdzLCBjb250ZXh0LCBzb3VuZHNNYW5hZ2VyLCBjdXJQbGF5ZXJUZWFtKSB7XG4gICAgICAgIHZhciBvZmZzZXRYID0gdGhpcy5sZWZ0O1xuICAgICAgICB2YXIgb2Zmc2V0WSA9IHRoaXMudG9wICsgMTYwO1xuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gMzIwO1xuICAgICAgICB2YXIgYmFyV2lkdGggPSAyMDtcbiAgICAgICAgdGhpcy5wb3dlck91dCA9IDA7XG4gICAgICAgIHRoaXMucG93ZXJJbiA9IDA7XG4gICAgICAgIGZvciAodmFyIGsgPSBidWlsZGluZ3MubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcbiAgICAgICAgICAgIHZhciBidWlsZGluZyA9IGJ1aWxkaW5nc1trXTtcbiAgICAgICAgICAgIGlmIChidWlsZGluZy5wb3dlckluICYmIGJ1aWxkaW5nLnRlYW0gPT0gY3VyUGxheWVyVGVhbSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG93ZXJJbiArPSBidWlsZGluZy5wb3dlckluO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1aWxkaW5nLnBvd2VyT3V0ICYmIGJ1aWxkaW5nLnRlYW0gPT0gY3VyUGxheWVyVGVhbSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG93ZXJPdXQgKz0gYnVpbGRpbmcucG93ZXJPdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICAvL2FsZXJ0KHRoaXMucG93ZXJHcmVlbik7XG4gICAgICAgIHZhciByZWQgPSAncmdiYSgxNzQsNTIsMjgsMC43KSc7XG4gICAgICAgIC8vdmFyIHJlZCA9ICdyZ2JhKDI0MCw3NSwzNSwwLjYpJztcbiAgICAgICAgdmFyIG9yYW5nZSA9ICdyZ2JhKDI1MCwxMDAsMCwwLjYpJztcbiAgICAgICAgLy92YXIgZ3JlZW4gPSAncmdiYSg0OCw4NSw0NCwwLjYpJztcbiAgICAgICAgdmFyIGdyZWVuID0gJ3JnYmEoODQsMjUyLDg0LDAuMyknO1xuICAgICAgICAvL2NvbnRleHQuZHJhd0ltYWdlKHRoaXMucG93ZXJSZWQsb2Zmc2V0WCxvZmZzZXRZK2JhckhlaWdodC10aGlzLnBvd2VyT3V0L3RoaXMucG93ZXJTY2FsZSk7XG4gICAgICAgIGlmICh0aGlzLnBvd2VyT3V0IC8gdGhpcy5wb3dlckluID49IDEuMSkge1xuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmVlbjsgLy8ncmdiYSgxMDAsMjAwLDAsMC4zKSc7XG4gICAgICAgICAgICB0aGlzLmxvd1Bvd2VyTW9kZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucG93ZXJPdXQgLyB0aGlzLnBvd2VySW4gPj0gMSkge1xuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvcmFuZ2U7XG4gICAgICAgICAgICB0aGlzLmxvd1Bvd2VyTW9kZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucG93ZXJPdXQgPCB0aGlzLnBvd2VySW4pIHtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gcmVkO1xuICAgICAgICAgICAgaWYgKHRoaXMubG93UG93ZXJNb2RlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc291bmRzTWFuYWdlci5wbGF5KCdsb3dfcG93ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubG93UG93ZXJNb2RlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KG9mZnNldFggKyA4LCBvZmZzZXRZICsgYmFySGVpZ2h0IC0gdGhpcy5wb3dlck91dCAvIHRoaXMucG93ZXJTY2FsZSwgYmFyV2lkdGggLSAxNCwgdGhpcy5wb3dlck91dCAvIHRoaXMucG93ZXJTY2FsZSk7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMucG93ZXJJbmRpY2F0b3IsIG9mZnNldFgsIG9mZnNldFkgKyBiYXJIZWlnaHQgLSB0aGlzLnBvd2VySW4gLyB0aGlzLnBvd2VyU2NhbGUpO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICh1bml0cywgYnVpbGRpbmdzLCBpbmZhbnRyeUZhY3RvcnksIHZlaGljbGVzRmFjdG9yeSwgY29udGV4dCwgc291bmRzTWFuYWdlciwgc3ByaXRlQ29udGV4dCwgc3ByaXRlQ2FudmFzLCBzY3JlZW4sIGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy50YWJzSW1hZ2UsIDAsIHRoaXMudG9wIC0gdGhpcy50YWJzSW1hZ2UuaGVpZ2h0ICsgMik7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ2xpZ2h0Z3JlZW4nO1xuICAgICAgICBjb250ZXh0LmZvbnQgPSAnMTJweCBcIkNvbW1hbmQgYW5kIENvbnF1ZXJcIic7XG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGNhc2ggc2NvcmUgdG8gYSBzdHJpbmcgYW5kIHNwYWNlIHNlcGFyYXRlIHRvIHBpcm50IGl0IHByb2VybHlcbiAgICAgICAgdmFyIGMgPSAodGhpcy5jYXNoICsgJycpLnNwbGl0KCcnKS5qb2luKCcgJyk7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoYywgNDAwIC0gYy5sZW5ndGggKiA1IC8gMiwgMzEpO1xuICAgICAgICB0aGlzLmNoZWNrRGVwZW5kZW5jeShidWlsZGluZ3MsIHNvdW5kc01hbmFnZXIsIGN1clBsYXllclRlYW0pO1xuICAgICAgICB0aGlzLnRleHRCcmlnaHRuZXNzID0gdGhpcy50ZXh0QnJpZ2h0bmVzcyArIHRoaXMudGV4dEJyaWdodG5lc3NEZWx0YTtcbiAgICAgICAgaWYgKHRoaXMudGV4dEJyaWdodG5lc3MgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnRleHRCcmlnaHRuZXNzID0gMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVmdEJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0J1dHRvbignbGVmdCcsIGksIHNvdW5kc01hbmFnZXIsIGJ1aWxkaW5ncywgdW5pdHMsIGluZmFudHJ5RmFjdG9yeSwgdmVoaWNsZXNGYWN0b3J5LCBjdXJQbGF5ZXJUZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmlnaHRCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NCdXR0b24oJ3JpZ2h0JywgaSwgc291bmRzTWFuYWdlciwgYnVpbGRpbmdzLCB1bml0cywgaW5mYW50cnlGYWN0b3J5LCB2ZWhpY2xlc0ZhY3RvcnksIGN1clBsYXllclRlYW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc2lkZWJhckltYWdlLCB0aGlzLmxlZnQsIHRoaXMudG9wKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcGFpck1vZGUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnJlcGFpckJ1dHRvblByZXNzZWQsIHRoaXMubGVmdCArIDQsIHRoaXMudG9wICsgMTQ1KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGxNb2RlKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zZWxsQnV0dG9uUHJlc3NlZCwgdGhpcy5sZWZ0ICsgNTcsIHRoaXMudG9wICsgMTQ1KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tQb3dlcihidWlsZGluZ3MsIGNvbnRleHQsIHNvdW5kc01hbmFnZXIsIGN1clBsYXllclRlYW0pO1xuICAgICAgICAgICAgdmFyIG1heExlZnQgPSB0aGlzLmxlZnRCdXR0b25zLmxlbmd0aCA+IDYgPyA2IDogdGhpcy5sZWZ0QnV0dG9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heExlZnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0J1dHRvbignbGVmdCcsIGksIGNvbnRleHQsIHNwcml0ZUNvbnRleHQsIHNwcml0ZUNhbnZhcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWF4UmlnaHQgPSB0aGlzLnJpZ2h0QnV0dG9ucy5sZW5ndGggPiA2ID8gNiA6IHRoaXMucmlnaHRCdXR0b25zLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4UmlnaHQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0J1dHRvbigncmlnaHQnLCBpLCBjb250ZXh0LCBzcHJpdGVDb250ZXh0LCBzcHJpdGVDYW52YXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIHNjcmVlbi52aWV3cG9ydC50b3AgKyBzY3JlZW4udmlld3BvcnQuaGVpZ2h0LCBjb250ZXh0LmNhbnZhcy53aWR0aCwgMzApO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZGViYXI7XG59KFZpc3VhbE9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBTaWRlYmFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2lkZWJhci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBTb3VuZHMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU291bmRzKCkge1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBTb3VuZHMucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAobmFtZSwgcGF0aCkge1xuICAgICAgICB2YXIgc291bmQgPSBuZXcgQXVkaW8oJ2F1ZGlvLycgKyBwYXRoICsgJy8nICsgbmFtZSArICcub2dnJyk7XG4gICAgICAgIHNvdW5kLmxvYWQoKTtcbiAgICAgICAgLy9hbGVydChzb3VuZC5zcmMpO1xuICAgICAgICByZXR1cm4gc291bmQ7XG4gICAgfTtcbiAgICBTb3VuZHMucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc291bmRfbGlzdFtuYW1lXTtcbiAgICAgICAgLy9hbGVydChuYW1lKVxuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgb3B0aW9uc1swXS5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3Iob3B0aW9ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgIC8vYWxlcnQoaSArXCIgXCIgK29wdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIG9wdGlvbnNbaV0ucGxheSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTb3VuZHMucHJvdG90eXBlLmxvYWRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc291bmRfbGlzdFsnYnVpbGRpbmdfaW5fcHJvZ3Jlc3MnXSA9IFt0aGlzLmxvYWQoJ2J1aWxkaW5nX2luX3Byb2dyZXNzJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2luc3VmZmljaWVudF9mdW5kcyddID0gW3RoaXMubG9hZCgnaW5zdWZmaWNpZW50X2Z1bmRzJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2J1aWxkaW5nJ10gPSBbdGhpcy5sb2FkKCdidWlsZGluZycsICd2b2ljZScpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wydvbl9ob2xkJ10gPSBbdGhpcy5sb2FkKCdvbl9ob2xkJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2NhbmNlbGxlZCddID0gW3RoaXMubG9hZCgnY2FuY2VsbGVkJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2Nhbm5vdF9kZXBsb3lfaGVyZSddID0gW3RoaXMubG9hZCgnY2Fubm90X2RlcGxveV9oZXJlJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ25ld19jb25zdHJ1Y3Rpb25fb3B0aW9ucyddID0gW3RoaXMubG9hZCgnbmV3X2NvbnN0cnVjdGlvbl9vcHRpb25zJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2NvbnN0cnVjdGlvbl9jb21wbGV0ZSddID0gW3RoaXMubG9hZCgnY29uc3RydWN0aW9uX2NvbXBsZXRlJywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ25vdF9yZWFkeSddID0gW3RoaXMubG9hZCgnbm90X3JlYWR5JywgJ3ZvaWNlJyldO1xuICAgICAgICAvL3RoaXMuc291bmRfbGlzdFsncmVpbmZvcmNlbWVudHNfaGF2ZV9hcnJpdmVkJ10gPSBbdGhpcy5sb2FkKCdyZWluZm9yY2VtZW50c19oYXZlX2Fycml2ZWQnLCd2b2ljZScpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wydsb3dfcG93ZXInXSA9IFt0aGlzLmxvYWQoJ2xvd19wb3dlcicsICd2b2ljZScpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wyd1bml0X3JlYWR5J10gPSBbdGhpcy5sb2FkKCd1bml0X3JlYWR5JywgJ3ZvaWNlJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ21pc3Npb25fYWNjb21wbGlzaGVkJ10gPSBbdGhpcy5sb2FkKCdtaXNzaW9uX2FjY29tcGxpc2hlZCcsICd2b2ljZScpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0WydtaXNzaW9uX2ZhaWx1cmUnXSA9IFt0aGlzLmxvYWQoJ21pc3Npb25fZmFpbHVyZScsICd2b2ljZScpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wydjb25zdHJ1Y3Rpb24nXSA9IFt0aGlzLmxvYWQoJ2NvbnN0cnVjdGlvbicsICdzb3VuZHMnKV07XG4gICAgICAgIHRoaXMuc291bmRfbGlzdFsnY3J1bWJsZSddID0gW3RoaXMubG9hZCgnY3J1bWJsZScsICdzb3VuZHMnKV07XG4gICAgICAgIHRoaXMuc291bmRfbGlzdFsnc2VsbCddID0gW3RoaXMubG9hZCgnc2VsbCcsICdzb3VuZHMnKV07XG4gICAgICAgIHRoaXMuc291bmRfbGlzdFsnYnV0dG9uJ10gPSBbdGhpcy5sb2FkKCdidXR0b24nLCAnc291bmRzJyldO1xuICAgICAgICAvL3RoaXMuc291bmRfbGlzdFsnY2xvY2snXSA9IFt0aGlzLmxvYWQoJ2Nsb2NrJywnc291bmRzJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ21hY2hpbmVfZ3VuJ10gPSBbdGhpcy5sb2FkKCdtYWNoaW5lX2d1bi0wJywgJ3NvdW5kcycpLCB0aGlzLmxvYWQoJ21hY2hpbmVfZ3VuLTEnLCAnc291bmRzJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ3RhbmtfZmlyZSddID0gW3RoaXMubG9hZCgndGFuay1maXJlLTAnLCAnc291bmRzJyksIHRoaXMubG9hZCgndGFuay1maXJlLTEnLCAnc291bmRzJyksIHRoaXMubG9hZCgndGFuay1maXJlLTInLCAnc291bmRzJyksIHRoaXMubG9hZCgndGFuay1maXJlLTMnLCAnc291bmRzJyldO1xuICAgICAgICAvL3RoaXMuc291bmRfbGlzdFsndGFua19maXJlJ10gPSBbdGhpcy5sb2FkKCd0YW5rLWZpcmUtMCcsJ3NvdW5kcycpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wyd2ZWhpY2xlX3NlbGVjdCddID0gW3RoaXMubG9hZCgncmVhZHlfYW5kX3dhaXRpbmcnLCAndGFsaycpLCB0aGlzLmxvYWQoJ3ZlaGljbGVfcmVwb3J0aW5nJywgJ3RhbGsnKSwgdGhpcy5sb2FkKCdhd2FpdGluZ19vcmRlcnMnLCAndGFsaycpXTtcbiAgICAgICAgdGhpcy5zb3VuZF9saXN0Wyd2ZWhpY2xlX21vdmUnXSA9IFt0aGlzLmxvYWQoJ2FmZmlybWF0aXZlJywgJ3RhbGsnKSwgdGhpcy5sb2FkKCdtb3Zpbmdfb3V0JywgJ3RhbGsnKSwgdGhpcy5sb2FkKCdhY2tub3dsZWRnZWQnLCAndGFsaycpLCB0aGlzLmxvYWQoJ292ZXJfYW5kX291dCcsICd0YWxrJyldO1xuICAgICAgICB0aGlzLnNvdW5kX2xpc3RbJ2luZmFudHJ5X3NlbGVjdCddID0gW3RoaXMubG9hZCgncmVwb3J0aW5nJywgJ3RhbGsnKSwgdGhpcy5sb2FkKCd1bml0X3JlcG9ydGluZycsICd0YWxrJyksIHRoaXMubG9hZCgnYXdhaXRpbmdfb3JkZXJzJywgJ3RhbGsnKV07XG4gICAgICAgIHRoaXMuc291bmRfbGlzdFsnaW5mYW50cnlfbW92ZSddID0gW3RoaXMubG9hZCgnYWZmaXJtYXRpdmUnLCAndGFsaycpLCB0aGlzLmxvYWQoJ3llc19zaXInLCAndGFsaycpLCB0aGlzLmxvYWQoJ2Fja25vd2xlZGdlZCcsICd0YWxrJyksIHRoaXMubG9hZCgncmlnaHRfYXdheScsICd0YWxrJyldO1xuICAgIH07XG4gICAgcmV0dXJuIFNvdW5kcztcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNvdW5kcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgQnVpbGRpbmcgPSByZXF1aXJlKFwiLi9CdWlsZGluZ1wiKTtcbnZhciBUaWJlcml1bVJlZmluZXJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUaWJlcml1bVJlZmluZXJ5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRpYmVyaXVtUmVmaW5lcnkoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBUaWJlcml1bVJlZmluZXJ5LnByb3RvdHlwZS5hcHBseVN0YXR1c0R1cmluZ0RyYXcgPSBmdW5jdGlvbiAoY3VyUGxheWVyVGVhbSwgdW5pdHMsIHZlaGljbGVzRmFjdG9yeSwgc2lkZWJhciwgZW5lbXkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgIHVuaXRzLnB1c2godmVoaWNsZXNGYWN0b3J5LmFkZCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2hhcnZlc3RlcicsXG4gICAgICAgICAgICAgICAgdGVhbTogdGhpcy50ZWFtLFxuICAgICAgICAgICAgICAgIHg6IHRoaXMueCArIDAuNSxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnkgKyAyLFxuICAgICAgICAgICAgICAgIG1vdmVEaXJlY3Rpb246IDE0LFxuICAgICAgICAgICAgICAgIG9yZGVyczogeyB0eXBlOiAnaGFydmVzdCcsIGZyb206IHRoaXMgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdHVzID09ICd1bmxvYWQnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXJ2ZXN0ZXIudGliZXJpdW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VidHJhY3RBbW91bnQgPSB0aGlzLmhhcnZlc3Rlci50aWJlcml1bSA+IDQgPyA1IDogdGhpcy5oYXJ2ZXN0ZXIudGliZXJpdW07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGVhbSA9PSBjdXJQbGF5ZXJUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXIuY2FzaCArPSBzdWJ0cmFjdEFtb3VudCAqIDUwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkuY2FzaCArPSBzdWJ0cmFjdEFtb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5oYXJ2ZXN0ZXIudGliZXJpdW0gLT0gc3VidHJhY3RBbW91bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFydmVzdGVyLnRpYmVyaXVtKSB7XG4gICAgICAgICAgICAgICAgdW5pdHMucHVzaCh2ZWhpY2xlc0ZhY3RvcnkuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2hhcnZlc3RlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlYW06IHRoaXMudGVhbSxcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnkgKyAyLFxuICAgICAgICAgICAgICAgICAgICBoaXRQb2ludHM6IHRoaXMuaGFydmVzdGVyLmhpdFBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgbW92ZURpcmVjdGlvbjogMTQsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogeyB0eXBlOiAnaGFydmVzdCcsIGZyb206IHRoaXMsIHRvOiB0aGlzLmhhcnZlc3Rlci5vcmRlcnMuZnJvbSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFydmVzdGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5hcHBseVN0YXR1c0R1cmluZ0RyYXcuY2FsbCh0aGlzLCBjdXJQbGF5ZXJUZWFtLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSk7XG4gICAgfTtcbiAgICByZXR1cm4gVGliZXJpdW1SZWZpbmVyeTtcbn0oQnVpbGRpbmcpKTtcbm1vZHVsZS5leHBvcnRzID0gVGliZXJpdW1SZWZpbmVyeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRpYmVyaXVtUmVmaW5lcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIEJ1aWxkaW5nID0gcmVxdWlyZShcIi4vQnVpbGRpbmdcIik7XG52YXIgVHVycmV0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUdXJyZXQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVHVycmV0KGhlYWx0aCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gJ3R1cnJldCc7XG4gICAgICAgIF90aGlzLnN0YXR1cyA9ICcnO1xuICAgICAgICBfdGhpcy5hbmltYXRpb25TcGVlZCA9IDQ7XG4gICAgICAgIF90aGlzLmhpdFBvaW50cyA9IGhlYWx0aDtcbiAgICAgICAgX3RoaXMucGl4ZWxMZWZ0ID0gMDtcbiAgICAgICAgX3RoaXMucGl4ZWxUb3AgPSAwO1xuICAgICAgICBfdGhpcy5waXhlbE9mZnNldFggPSAwO1xuICAgICAgICBfdGhpcy5waXhlbE9mZnNldFkgPSAwO1xuICAgICAgICBfdGhpcy50dXJyZXREaXJlY3Rpb24gPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFR1cnJldC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjb250ZXh0LCBjdXJQbGF5ZXJUZWFtLCBncmlkU2l6ZSwgc2NyZWVuLCB1bml0cywgdmVoaWNsZXNGYWN0b3J5LCBzaWRlYmFyLCBlbmVteSkge1xuICAgICAgICB2YXIgdGVhbVlPZmZzZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy50ZWFtICE9IGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgICAgIHRlYW1ZT2Zmc2V0ID0gdGhpcy5waXhlbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlmZSA9IHRoaXMuZ2V0TGlmZSgpLCBpbWFnZUNhdGVnb3J5O1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gXCJidWlsZFwiIHx8IHRoaXMuc3RhdHVzID09IFwic2VsbFwiKSB7XG4gICAgICAgICAgICBpbWFnZUNhdGVnb3J5ID0gJ2J1aWxkJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICAgICAgICBpbWFnZUNhdGVnb3J5ID0gdGhpcy5saWZlO1xuICAgICAgICAgICAgaWYgKHRoaXMubGlmZSA9PSAndWx0cmEtZGFtYWdlZCcpIHsgLy8gdHVycmV0cyBkb24ndCBoYXZlIHVsdHJhIGRhbWFnZWQuIDopXG4gICAgICAgICAgICAgICAgaW1hZ2VDYXRlZ29yeSA9ICdkYW1hZ2VkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgaW1hZ2VMaXN0ID0gdGhpcy5zcHJpdGVBcnJheVtpbWFnZUNhdGVnb3J5XTtcbiAgICAgICAgdmFyIGltYWdlV2lkdGggPSB0aGlzLmdyaWRTaGFwZVswXS5sZW5ndGggKiBncmlkU2l6ZTtcbiAgICAgICAgdmFyIGltYWdlSGVpZ2h0ID0gdGhpcy5zcHJpdGVJbWFnZS5oZWlnaHQ7XG4gICAgICAgIHZhciB4ID0gdGhpcy54ICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnkgKiBncmlkU2l6ZSArIHNjcmVlbi52aWV3cG9ydEFkanVzdC55O1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIGltYWdlSW5kZXggPSBNYXRoLmZsb29yKHRoaXMudHVycmV0RGlyZWN0aW9uKTtcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3ByaXRlQ2FudmFzLCAoaW1hZ2VMaXN0Lm9mZnNldCArIGltYWdlSW5kZXgpICogaW1hZ2VXaWR0aCwgdGVhbVlPZmZzZXQsIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0LCB4LCB5LCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWFnZUxpc3QuY291bnQgPj0gTWF0aC5mbG9vcih0aGlzLmFuaW1hdGlvbkluZGV4IC8gdGhpcy5hbmltYXRpb25TcGVlZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2VJbmRleCA9IE1hdGguZmxvb3IodGhpcy5hbmltYXRpb25JbmRleCAvIHRoaXMuYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAnc2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJbmRleCA9IGltYWdlTGlzdC5jb3VudCAtIDEgLSBNYXRoLmZsb29yKHRoaXMuYW5pbWF0aW9uSW5kZXggLyB0aGlzLmFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zcHJpdGVDYW52YXMsIChpbWFnZUxpc3Qub2Zmc2V0ICsgaW1hZ2VJbmRleCkgKiBpbWFnZVdpZHRoLCB0ZWFtWU9mZnNldCwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQsIHgsIHksIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSW5kZXgrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkluZGV4IC8gdGhpcy5hbmltYXRpb25TcGVlZCA+PSBpbWFnZUxpc3QuY291bnQpIHtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMuYW5pbWF0aW9uSW5kZXggKyAnIC8gJysgdGhpcy5hbmltYXRpb25TcGVlZClcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09ICdzZWxsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdkZXN0cm95JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudHVycmV0RGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgIHZhciB0dXJyZXRMaXN0ID0gdGhpcy5zcHJpdGVBcnJheVsndHVycmV0J107XG4gICAgICAgICAgICBpZiAodHVycmV0TGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnR1cnJldERpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zcHJpdGVJbWFnZSwgKHR1cnJldExpc3Qub2Zmc2V0ICsgaW1hZ2VJbmRleCkgKiBpbWFnZVdpZHRoLCB0ZWFtWU9mZnNldCwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQsIHgsIHksIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdTZWxlY3Rpb24oY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbiwgc2lkZWJhcik7XG4gICAgfTtcbiAgICBUdXJyZXQucHJvdG90eXBlLnByb2Nlc3NPcmRlcnMgPSBmdW5jdGlvbiAoZ3JpZFNpemUsIHVuaXRzLCBidWlsZGluZ3MsIHR1cnJldHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9yZGVycykge1xuICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdndWFyZCcgfTtcbiAgICAgICAgfVxuICAgICAgICAvL3RoaXMub3JkZXJzID0ge3R5cGU6J21vdmUnLHRvOnt4OjExLHk6MTJ9fTsgLy97dHlwZTpwYXRyb2wsZnJvbTp7eDo5LHk6NX0sdG86e3g6MTEseTo1fX0gLy8ge3R5cGU6Z3VhcmR9IC8vIHt0eXBlOm1vdmUsdG86e3g6MTEseTo1fX0gLy8ge3R5cGU6YXR0YWNrfSAvLyB7dHlwZTpwcm90ZWN0fVxuICAgICAgICBpZiAodGhpcy5vcmRlcnMudHlwZSA9PSAnYXR0YWNrJykge1xuICAgICAgICAgICAgdmFyIGF0dGFja09yZGVyID0gdGhpcy5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLmluc3RydWN0aW9ucyA9IFtdO1xuICAgICAgICAgICAgaWYgKGF0dGFja09yZGVyLnRhcmdldC5zdGF0dXMgPT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdndWFyZCcgfTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBbTWF0aC5mbG9vcih0aGlzLngpLCBNYXRoLmZsb29yKHRoaXMueSldO1xuICAgICAgICAgICAgLy9hZGp1c3QgdG8gY2VudGVyIG9mIHRhcmdldCBmb3IgYnVpbGRpbmdzXG4gICAgICAgICAgICB2YXIgdGFyZ2V0WCA9IGF0dGFja09yZGVyLnRhcmdldC54O1xuICAgICAgICAgICAgdmFyIHRhcmdldFkgPSBhdHRhY2tPcmRlci50YXJnZXQueTtcbiAgICAgICAgICAgIGlmIChhdHRhY2tPcmRlci50YXJnZXQudHlwZSA9PSAndHVycmV0Jykge1xuICAgICAgICAgICAgICAgIHRhcmdldFggKz0gYXR0YWNrT3JkZXIudGFyZ2V0LnBpeGVsV2lkdGggLyAoMiAqIGdyaWRTaXplKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRZICs9IGF0dGFja09yZGVyLnRhcmdldC5waXhlbEhlaWdodCAvICgyICogZ3JpZFNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dGFja09yZGVyLnRhcmdldC50eXBlID09ICdidWlsZGluZycpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRYICs9IGF0dGFja09yZGVyLnRhcmdldC5ncmlkV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRhcmdldFkgKz0gYXR0YWNrT3JkZXIudGFyZ2V0LmdyaWRIZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1hdGgucG93KHRhcmdldFggLSB0aGlzLngsIDIpICsgTWF0aC5wb3codGFyZ2V0WSAtIHRoaXMueSwgMikgPj0gTWF0aC5wb3codGhpcy5zaWdodCwgMikpIHtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KCdub3QgYXR0YWNraW5nICcrdGhpcy5vcmRlcnMudGFyZ2V0Lm5hbWUpXG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdndWFyZCcgfTsgLy8gb3V0IG9mIHJhbmdlIGdvIGJhY2sgdG8gZ3VhcmQgbW9kZS5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9yZGVycy50eXBlID09ICdhdHRhY2snKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0dXJyZXRBbmdsZSA9IHRoaXMuZmluZEFuZ2xlKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9LCB0aGlzLCAzMik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR1cnJldERpcmVjdGlvbiAhPSB0dXJyZXRBbmdsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMucHVzaCh7IHR5cGU6ICdhaW0nLCB0b0RpcmVjdGlvbjogdHVycmV0QW5nbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KCdwdXNpbmcgZGlyZWN0aW9uICcgKyB0dXJyZXRBbmdsZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFpbWluZyB0dXJyZXQgYXQgaGltIGFuZCB3aXRoaW4gcmFuZ2UuLi4gRklSRSEhISEhXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHR1cnJldEFuZ2xlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMucHVzaCh7IHR5cGU6ICdmaXJlJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgb25seSBwcm9jZXNzZXMgaWYgdGhlIGd1eSBoYXMgc29tZSBhbW1vXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZy4uLiB3YWl0Li4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlcnMudHlwZSA9PSAnZ3VhcmQnKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBzZWUgaWYgYW4gZXZpbCB1bml0IGlzIGluIHNpZ2h0IGFuZCB0cmFjayBpdCA6KVxuICAgICAgICAgICAgdmFyIGVuZW1pZXNJblJhbmdlID0gdGhpcy5maW5kRW5lbWllc0luUmFuZ2UodGhpcywgMCwgdW5pdHMsIGJ1aWxkaW5ncywgdHVycmV0cyk7XG4gICAgICAgICAgICBpZiAoZW5lbWllc0luUmFuZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBlbmVteSA9IGVuZW1pZXNJblJhbmdlWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMub3JkZXJzID0geyB0eXBlOiAnYXR0YWNrJywgdGFyZ2V0OiBlbmVteSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBUdXJyZXQucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc291bmRzLCBidWxsZXREcmF3ZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RydWN0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaW5zdHIgPSB0aGlzLmluc3RydWN0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmIChpbnN0ci50eXBlID09ICdhaW0nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFpbUluc3RyID0gaW5zdHI7XG4gICAgICAgICAgICAgICAgLy9hbGVydCgnYWltaW5nOiAnICsgaW5zdHIudG9EaXJlY3Rpb24gKyAnIGFuZCB0dXJyZXQgaXMgYXQgJyt0aGlzLnR1cnJldERpcmVjdGlvbilcbiAgICAgICAgICAgICAgICBpZiAoYWltSW5zdHIudG9EaXJlY3Rpb24gPT0gdGhpcy50dXJyZXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zdHJ1Y3Rpb24gY29tcGxldGUuLi5cbiAgICAgICAgICAgICAgICAgICAgaW5zdHIudHlwZSA9ICdkb25lJztcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoYWltSW5zdHIudG9EaXJlY3Rpb24gPiB0aGlzLnR1cnJldERpcmVjdGlvbiAmJiAoYWltSW5zdHIudG9EaXJlY3Rpb24gLSB0aGlzLnR1cnJldERpcmVjdGlvbikgPCAxNilcbiAgICAgICAgICAgICAgICAgICAgfHwgKGFpbUluc3RyLnRvRGlyZWN0aW9uIDwgdGhpcy50dXJyZXREaXJlY3Rpb24gJiYgKHRoaXMudHVycmV0RGlyZWN0aW9uIC0gYWltSW5zdHIudG9EaXJlY3Rpb24pID4gMTYpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWxlcnQodGhpcy50dXJuU3BlZWQqMC4wNSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJyZXREaXJlY3Rpb24gPSB0aGlzLnR1cnJldERpcmVjdGlvbiArIHRoaXMudHVyblNwZWVkICogMC4xO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMudHVycmV0RGlyZWN0aW9uIC0gYWltSW5zdHIudG9EaXJlY3Rpb24pICogKHRoaXMudHVycmV0RGlyZWN0aW9uICsgdGhpcy50dXJuU3BlZWQgKiAwLjEgLSBhaW1JbnN0ci50b0RpcmVjdGlvbikgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJyZXREaXJlY3Rpb24gPSBhaW1JbnN0ci50b0RpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJyZXREaXJlY3Rpb24gPSB0aGlzLnR1cnJldERpcmVjdGlvbiAtIHRoaXMudHVyblNwZWVkICogMC4xO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMudHVycmV0RGlyZWN0aW9uIC0gYWltSW5zdHIudG9EaXJlY3Rpb24pICogKHRoaXMudHVycmV0RGlyZWN0aW9uIC0gdGhpcy50dXJuU3BlZWQgKiAwLjEgLSBhaW1JbnN0ci50b0RpcmVjdGlvbikgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJyZXREaXJlY3Rpb24gPSBhaW1JbnN0ci50b0RpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy50dXJyZXREaXJlY3Rpb24gPiAzMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cnJldERpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHVycmV0RGlyZWN0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cnJldERpcmVjdGlvbiA9IDMxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMudHVycmV0RGlyZWN0aW9uKSAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluc3RyLnR5cGUgPT0gJ2ZpcmUnKSB7XG4gICAgICAgICAgICAgICAgLy8gYWxlcnQodGhpcy5maXJlQ291bnRlcilcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnVsbGV0RmlyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kcy5wbGF5KCd0YW5rX2ZpcmUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWxsZXRGaXJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSAodGhpcy50dXJyZXREaXJlY3Rpb24gLyAzMikgKiAyICogTWF0aC5QSTtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0RHJhd2VyLmZpcmVCdWxsZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHRoaXMuc2lnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYW1hZ2U6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfTtcbiAgICByZXR1cm4gVHVycmV0O1xufShCdWlsZGluZykpO1xubW9kdWxlLmV4cG9ydHMgPSBUdXJyZXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UdXJyZXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIFZpc3VhbE9iamVjdCA9IHJlcXVpcmUoXCIuL1Zpc3VhbE9iamVjdFwiKTtcbnZhciBUdXJyZXQgPSByZXF1aXJlKFwiLi9UdXJyZXRcIik7XG52YXIgVHVycmV0cyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVHVycmV0cywgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUdXJyZXRzKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZXMgPSBbXTtcbiAgICAgICAgX3RoaXMudHVycmV0RGV0YWlscyA9IHtcbiAgICAgICAgICAgICdndW4tdHVycmV0Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdndW4tdHVycmV0JyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0d1biBUdXJyZXQnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0dXJyZXQnLFxuICAgICAgICAgICAgICAgIHBvd2VySW46IDIwLFxuICAgICAgICAgICAgICAgIHByaW1hcnlXZWFwb246IDEyLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDYwMCxcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDIwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogNSxcbiAgICAgICAgICAgICAgICB0dXJuU3BlZWQ6IDUsXG4gICAgICAgICAgICAgICAgcmVsb2FkVGltZTogMTUwMCxcbiAgICAgICAgICAgICAgICBwaXhlbFdpZHRoOiAyNCxcbiAgICAgICAgICAgICAgICBwaXhlbEhlaWdodDogMjQsXG4gICAgICAgICAgICAgICAgaW1hZ2VzVG9Mb2FkOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkJywgY291bnQ6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2RhbWFnZWQnLCBjb3VudDogMzIgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcImhlYWx0aHlcIiwgY291bnQ6IDMyIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHBpeGVsT2Zmc2V0WDogLTEyLFxuICAgICAgICAgICAgICAgIHBpeGVsT2Zmc2V0WTogLTEyLFxuICAgICAgICAgICAgICAgIHBpeGVsVG9wOiAxMixcbiAgICAgICAgICAgICAgICBwaXhlbExlZnQ6IDEyLFxuICAgICAgICAgICAgICAgIGdyaWRXaWR0aDogMSxcbiAgICAgICAgICAgICAgICBncmlkSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIGdyaWRTaGFwZTogW1sxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnZ3VhcmQtdG93ZXInOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2d1YXJkLXRvd2VyJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0d1YXJkIFRvd2VyJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAndHVycmV0JyxcbiAgICAgICAgICAgICAgICBwb3dlckluOiAxMCxcbiAgICAgICAgICAgICAgICBwcmltYXJ5V2VhcG9uOiAxLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDUwMCxcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDIwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogNSxcbiAgICAgICAgICAgICAgICByZWxvYWRUaW1lOiAxMDAwLFxuICAgICAgICAgICAgICAgIHBpeGVsV2lkdGg6IDI0LFxuICAgICAgICAgICAgICAgIHBpeGVsSGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgICBwaXhlbE9mZnNldFg6IC0xMixcbiAgICAgICAgICAgICAgICBwaXhlbE9mZnNldFk6IC0xMixcbiAgICAgICAgICAgICAgICBwaXhlbFRvcDogMTIsXG4gICAgICAgICAgICAgICAgcGl4ZWxMZWZ0OiAxMixcbiAgICAgICAgICAgICAgICBpbWFnZXNUb0xvYWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnYnVpbGQnLCBjb3VudDogMjAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnZGFtYWdlZCcsIGNvdW50OiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJoZWFsdGh5XCIsIGNvdW50OiAxIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGdyaWRXaWR0aDogMSxcbiAgICAgICAgICAgICAgICBncmlkSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIGdyaWRTaGFwZTogW1sxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLnByZWxvYWRDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmxvYWRlZENvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBUdXJyZXRzLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGRldGFpbHMgPSB0aGlzLnR1cnJldERldGFpbHNbbmFtZV07XG4gICAgICAgIHZhciB0dXJyZXQgPSBuZXcgVHVycmV0KGRldGFpbHMubWF4SGl0UG9pbnRzKTtcbiAgICAgICAgdGhpcy5sb2FkU3ByaXRlU2hlZXQodHVycmV0LCBkZXRhaWxzLCAndHVycmV0cycpO1xuICAgICAgICAkLmV4dGVuZCh0dXJyZXQsIGRldGFpbHMpO1xuICAgICAgICB0aGlzLnR5cGVzW25hbWVdID0gdHVycmV0O1xuICAgIH07XG4gICAgVHVycmV0cy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBkZXRhaWxzLm5hbWU7XG4gICAgICAgIHZhciBuZXdUdXJyZXQgPSBuZXcgVHVycmV0KDApO1xuICAgICAgICBuZXdUdXJyZXQudGVhbSA9IGRldGFpbHMudGVhbTtcbiAgICAgICAgJC5leHRlbmQobmV3VHVycmV0LCB0aGlzLnR5cGVzW25hbWVdLmRlZmF1bHRzKTtcbiAgICAgICAgJC5leHRlbmQobmV3VHVycmV0LCB0aGlzLnR5cGVzW25hbWVdKTtcbiAgICAgICAgJC5leHRlbmQobmV3VHVycmV0LCBkZXRhaWxzKTtcbiAgICAgICAgaWYgKGRldGFpbHMuaGl0UG9pbnRzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBuZXdUdXJyZXQuaGl0UG9pbnRzID0gZGV0YWlscy5oaXRQb2ludHM7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1R1cnJldC5oaXRQb2ludHMgPSBuZXdUdXJyZXQubWF4SGl0UG9pbnRzO1xuICAgICAgICByZXR1cm4gbmV3VHVycmV0O1xuICAgIH07XG4gICAgcmV0dXJuIFR1cnJldHM7XG59KFZpc3VhbE9iamVjdCkpO1xubW9kdWxlLmV4cG9ydHMgPSBUdXJyZXRzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VHVycmV0cy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBEZXN0cnVjdGlibGVPYmplY3QgPSByZXF1aXJlKFwiLi9EZXN0cnVjdGlibGVPYmplY3RcIik7XG52YXIgQVN0YXIgPSByZXF1aXJlKFwiLi9BU3RhclwiKTtcbnZhciBWZWhpY2xlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhWZWhpY2xlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFZlaGljbGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd2ZWhpY2xlJykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uU3BlZWQgPSA0O1xuICAgICAgICBfdGhpcy5waXhlbExlZnQgPSAwO1xuICAgICAgICBfdGhpcy5waXhlbFRvcCA9IDA7XG4gICAgICAgIF90aGlzLnBpeGVsT2Zmc2V0WCA9IDA7XG4gICAgICAgIF90aGlzLnBpeGVsT2Zmc2V0WSA9IDA7XG4gICAgICAgIF90aGlzLm1vdmVEaXJlY3Rpb24gPSAwO1xuICAgICAgICBfdGhpcy50dXJyZXREaXJlY3Rpb24gPSAwO1xuICAgICAgICBfdGhpcy5zdGF0dXMgPSAnJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBWZWhpY2xlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNvbnRleHQsIGN1clBsYXllclRlYW0sIGdyaWRTaXplLCBzY3JlZW4sIHVuaXRzLCB2ZWhpY2xlc0ZhY3RvcnksIHNpZGViYXIsIGVuZW15LCBkZWJ1Z01vZGUpIHtcbiAgICAgICAgLy8gRmluYWxseSBkcmF3IHRoZSB0b3AgcGFydCB3aXRoIGFwcHJvcHJpYXRlIGFuaW1hdGlvblxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IHRoaXMucGl4ZWxXaWR0aDtcbiAgICAgICAgdmFyIGltYWdlSGVpZ2h0ID0gdGhpcy5waXhlbEhlaWdodDtcbiAgICAgICAgdmFyIHggPSBNYXRoLnJvdW5kKHRoaXMueCAqIGdyaWRTaXplICsgdGhpcy5waXhlbE9mZnNldFggKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueCk7XG4gICAgICAgIHZhciB5ID0gTWF0aC5yb3VuZCh0aGlzLnkgKiBncmlkU2l6ZSArIHRoaXMucGl4ZWxPZmZzZXRZICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnkpO1xuICAgICAgICB2YXIgdGVhbVlPZmZzZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy50ZWFtICE9IGN1clBsYXllclRlYW0pIHtcbiAgICAgICAgICAgIHRlYW1ZT2Zmc2V0ID0gdGhpcy5waXhlbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIGltYWdlTGlzdCA9IHRoaXMuc3ByaXRlQXJyYXlbXCJtb3ZlXCJdO1xuICAgICAgICAgICAgdmFyIGltYWdlSW5kZXggPSBNYXRoLmZsb29yKHRoaXMubW92ZURpcmVjdGlvbik7XG4gICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnNwcml0ZUNhbnZhcywgKGltYWdlTGlzdC5vZmZzZXQgKyBpbWFnZUluZGV4KSAqIGltYWdlV2lkdGgsIHRlYW1ZT2Zmc2V0LCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgeCwgeSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbkluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaW1hZ2VMaXN0ID0gdGhpcy5zcHJpdGVBcnJheVt0aGlzLnN0YXR1c107XG4gICAgICAgICAgICBpZiAoaW1hZ2VMaXN0LmNvdW50ID49IE1hdGguZmxvb3IodGhpcy5hbmltYXRpb25JbmRleCAvIHRoaXMuYW5pbWF0aW9uU3BlZWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlSW5kZXggPSBNYXRoLmZsb29yKHRoaXMuYW5pbWF0aW9uSW5kZXggLyB0aGlzLmFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnNwcml0ZUNhbnZhcywgKGltYWdlTGlzdC5vZmZzZXQgKyBpbWFnZUluZGV4KSAqIGltYWdlV2lkdGgsIHRlYW1ZT2Zmc2V0LCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgeCwgeSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnR1cnJldERpcmVjdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgdHVycmV0TGlzdCA9IHRoaXMuc3ByaXRlQXJyYXlbJ3R1cnJldCddO1xuICAgICAgICAgICAgaWYgKHR1cnJldExpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2VJbmRleCA9IE1hdGguZmxvb3IodGhpcy50dXJyZXREaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3ByaXRlQ2FudmFzLCAodHVycmV0TGlzdC5vZmZzZXQgKyBpbWFnZUluZGV4KSAqIGltYWdlV2lkdGgsIHRlYW1ZT2Zmc2V0LCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgeCwgeSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhd1NlbGVjdGlvbihjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuLCBzaWRlYmFyKTtcbiAgICAgICAgaWYgKGRlYnVnTW9kZSkge1xuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dCh0aGlzLm9yZGVycy50eXBlLCB4LCB5KTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQoTWF0aC5mbG9vcih0aGlzLngpICsgJywnICsgTWF0aC5mbG9vcih0aGlzLnkpLCB4LCB5ICsgMTApO1xuICAgICAgICAgICAgdGhpcy5vcmRlcnMudG8gJiYgY29udGV4dC5maWxsVGV4dCh0aGlzLm9yZGVycy50by54ICsgJywnICsgdGhpcy5vcmRlcnMudG8ueSwgeCwgeSArIDIwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVidWdNb2RlKSB7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDEwMCwyMDAsMTAwLDAuNCknO1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQuYXJjKHRoaXMueCAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LngsIHRoaXMueSAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LnksIHRoaXMuc29mdENvbGxpc2lvblJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDIwMCwwLDAsMC40KSc7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5hcmModGhpcy54ICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueCwgdGhpcy55ICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueSwgdGhpcy5jb2xsaXNpb25SYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWZWhpY2xlLnByb3RvdHlwZS5wcm9jZXNzT3JkZXJzID0gZnVuY3Rpb24gKHNwZWVkQWRqdXN0bWVudEZhY3RvciwgdW5pdHMsIGJ1aWxkaW5ncywgdHVycmV0cywgYWxsT3ZlcmxheXMsIGJ1aWxkaW5nc0ZhY3RvcnksIGZvZywgc291bmRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbikge1xuICAgICAgICB0aGlzLmNvbGxpZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbGxpc2lvblR5cGUgPSAnJztcbiAgICAgICAgdGhpcy5jb2xsaXNpb25EaXN0YW5jZSA9IHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyArIDE7XG4gICAgICAgIHRoaXMuY29sbGlzaW9uV2l0aCA9IG51bGw7XG4gICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IDA7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgICAgIGlmICghdGhpcy5vcmRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMub3JkZXJzID0geyB0eXBlOiAnZ3VhcmQnIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3JkZXJzLnR5cGUgPT0gJ21ha2Utd2F5Jykge1xuICAgICAgICAgICAgLy9hbGVydCgnTWFrZSB3YXkgZm9yICcrdGhpcy5vcmRlcnMuZm9yKVxuICAgICAgICAgICAgLy90aGlzLm9yZGVycyA9IHt0eXBlOidtb3ZlJyx0bzp7eDpNYXRoLnJvdW5kKHRoaXMub3JkZXJzLmZvci54KzIpLHk6TWF0aC5yb3VuZCh0aGlzLm9yZGVycy5mb3IueSsxKX19O1xuICAgICAgICAgICAgdmFyIGNvbGxEaXJlY3Rpb24gPSB0aGlzLmZpbmRBbmdsZSh0aGlzLm9yZGVycy5mb3IsIHRoaXMsIDMyKTtcbiAgICAgICAgICAgIC8vdmFyIGRUdXJuID0gYW5nbGVEaWZmKHRoaXMubW92ZURpcmVjdGlvbixjb2xsRGlyZWN0aW9uLDMyKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhjb2xsRGlyZWN0aW9uKSA+IDE2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMucHVzaCh7IHR5cGU6ICdtb3ZlJywgZGlzdGFuY2U6IDAuMjUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc3RydWN0aW9ucy5wdXNoKHsgdHlwZTogJ21vdmUnLCBkaXN0YW5jZTogLTAuMjUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xuICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdndWFyZCcgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVycy50eXBlID09ICdtb3ZlJykge1xuICAgICAgICAgICAgLy9hbGVydCh0aGlzLnByb2Nlc3NPcmRlcnMpXG4gICAgICAgICAgICB2YXIgbW92ZU9yZGVyID0gdGhpcy5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhtb3ZlT3JkZXIudG8sIGZhbHNlLCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIHVuaXRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbik7XG4gICAgICAgICAgICAvL2FsZXJ0KHRoaXMuY29sbGlzaW9uUmFkaXVzL2dhbWUuZ3JpZFNpemUpXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhNYXRoLnBvdyhtb3ZlT3JkZXIudG8ueSArIDAuNSAtIHRoaXMueSwgMikgKyBNYXRoLnBvdyhtb3ZlT3JkZXIudG8ueCArIDAuNSAtIHRoaXMueCwgMiksIDAuNSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3RhbmNlICsgJyAnKzEuNSoyKnRoaXMuc29mdENvbGxpc2lvblJhZGl1cy9nYW1lLmdyaWRTaXplKVxuICAgICAgICAgICAgdmFyIHJlYWNoZWRUaHJlc2hvbGQgPSB0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgLyBncmlkU2l6ZSA8IDAuNSA/IDAuNSArIHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyAvIGdyaWRTaXplIDogdGhpcy5zb2Z0Q29sbGlzaW9uUmFkaXVzIC8gZ3JpZFNpemU7XG4gICAgICAgICAgICBpZiAoKGRpc3RhbmNlIDw9IHJlYWNoZWRUaHJlc2hvbGQpXG4gICAgICAgICAgICAgICAgLy8odGhpcy5wYXRoLmxlbmd0aCA8PSAxKSBcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5jb2xsaWRpbmcgJiYgdGhpcy5jb2xsaXNpb25UeXBlID09ICdzb2Z0JyAmJiBkaXN0YW5jZSA8PSByZWFjaGVkVGhyZXNob2xkICsgdGhpcy5jb2xsaXNpb25SYWRpdXMgLyBncmlkU2l6ZSlcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5jb2xsaWRpbmcgJiYgdGhpcy5jb2xsaXNpb25UeXBlID09ICdzb2Z0LWhhcmQnICYmIGRpc3RhbmNlIDw9IHJlYWNoZWRUaHJlc2hvbGQgKyAyICogdGhpcy5jb2xsaXNpb25SYWRpdXMgLyBncmlkU2l6ZSlcbiAgICAgICAgICAgICAgICB8fCAodGhpcy5jb2xsaWRpbmcgJiYgdGhpcy5jb2xsaXNpb25UeXBlID09ICdoYXJkJyAmJiBkaXN0YW5jZSA8PSByZWFjaGVkVGhyZXNob2xkICsgMyAqIHRoaXMuY29sbGlzaW9uUmFkaXVzIC8gZ3JpZFNpemUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdndWFyZCcgfTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMuY29sbGlzaW9uVHlwZSArICcgJytkaXN0YW5jZSlcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLm5hbWUgPT0gJ2hhcnZlc3Rlcicpe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50aWJlcml1bSAmJiB0aGlzLnRpYmVyaXVtID49IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVycyA9IHt0eXBlOidoYXJ2ZXN0LXJldHVybid9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7dHlwZTonaGFydmVzdCd9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXJzLnR5cGUgPT0gJ3BhdHJvbCcpIHtcbiAgICAgICAgICAgIC8vIGlmIGkgc2VlIGVuZW15IHdoaWxlIHBhdHJvbGxpbmcsIGdvIGp1bXAgdG8gdGhlIGZpcnN0IGVuZW15IDopXG4gICAgICAgICAgICB2YXIgcGF0cm9sT3JkZXIgPSB0aGlzLm9yZGVycztcbiAgICAgICAgICAgIHZhciBlbmVtaWVzSW5SYW5nZSA9IHRoaXMuZmluZEVuZW1pZXNJblJhbmdlKHRoaXMsIDIsIHVuaXRzLCBidWlsZGluZ3MsIHR1cnJldHMpO1xuICAgICAgICAgICAgaWYgKGVuZW1pZXNJblJhbmdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZW5lbXkgPSBlbmVtaWVzSW5SYW5nZVswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm9yZGVycyA9IHsgdHlwZTogJ2F0dGFjaycsIHRhcmdldDogZW5lbXksIGxhc3RPcmRlcnM6IHRoaXMub3JkZXJzIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tb3ZlVG8ocGF0cm9sT3JkZXIudG8sIGZhbHNlLCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIHVuaXRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbik7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnBvdyhNYXRoLnBvdyhwYXRyb2xPcmRlci50by55IC0gdGhpcy55LCAyKSArIE1hdGgucG93KHBhdHJvbE9yZGVyLnRvLnggLSB0aGlzLngsIDIpLCAwLjUpO1xuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgNCAqIHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyAvIGdyaWRTaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlcnMgPSB7IHR5cGU6ICdwYXRyb2wnLCB0bzogcGF0cm9sT3JkZXIuZnJvbSwgZnJvbTogcGF0cm9sT3JkZXIudG8gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVycy50eXBlID09ICdwcm90ZWN0JyB8fCB0aGlzLm9yZGVycy50eXBlID09ICdhdHRhY2snKSB7XG4gICAgICAgICAgICB2YXIgcHJvdGVjdE9yZGVyID0gdGhpcy5vcmRlcnM7XG4gICAgICAgICAgICBpZiAocHJvdGVjdE9yZGVyLnRhcmdldC5zdGF0dXMgPT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVuZW1pZXNJblJhbmdlID0gdGhpcy5maW5kRW5lbWllc0luUmFuZ2UodGhpcywgMiwgdW5pdHMsIGJ1aWxkaW5ncywgdHVycmV0cyk7XG4gICAgICAgICAgICAgICAgaWYgKGVuZW1pZXNJblJhbmdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuZW15ID0gZW5lbWllc0luUmFuZ2VbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXJzID0geyB0eXBlOiAnYXR0YWNrJywgdGFyZ2V0OiBlbmVteSwgbGFzdE9yZGVyczogdGhpcy5vcmRlcnMgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3JkZXJzWydsYXN0T3JkZXJzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXJzID0gdGhpcy5vcmRlcnNbJ2xhc3RPcmRlcnMnXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXJzID0geyB0eXBlOiAnZ3VhcmQnIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9yZGVycy50eXBlID09ICdwcm90ZWN0Jykge1xuICAgICAgICAgICAgICAgIHZhciBlbmVtaWVzSW5SYW5nZSA9IHRoaXMuZmluZEVuZW1pZXNJblJhbmdlKHRoaXMsIDIsIHVuaXRzLCBidWlsZGluZ3MsIHR1cnJldHMpO1xuICAgICAgICAgICAgICAgIGlmIChlbmVtaWVzSW5SYW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbmVteSA9IGVuZW1pZXNJblJhbmdlWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVycyA9IHsgdHlwZTogJ2F0dGFjaycsIHRhcmdldDogZW5lbXksIGxhc3RPcmRlcnM6IHRoaXMub3JkZXJzIH07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3ZhciBzdGFydCA9IFtNYXRoLmZsb29yKHRoaXMueCksTWF0aC5mbG9vcih0aGlzLnkpXTtcbiAgICAgICAgICAgIC8vYWRqdXN0IHRvIGNlbnRlciBvZiB0YXJnZXQgZm9yIGJ1aWxkaW5nc1xuICAgICAgICAgICAgdmFyIHRhcmdldFggPSBwcm90ZWN0T3JkZXIudGFyZ2V0Lng7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0WSA9IHByb3RlY3RPcmRlci50YXJnZXQueTtcbiAgICAgICAgICAgIHZhciB0YXJnZXRDR1ggPSBwcm90ZWN0T3JkZXIudGFyZ2V0Lng7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0Q0dZID0gcHJvdGVjdE9yZGVyLnRhcmdldC55O1xuICAgICAgICAgICAgaWYgKHByb3RlY3RPcmRlci50YXJnZXQudHlwZSA9PSAndHVycmV0Jykge1xuICAgICAgICAgICAgICAgIHRhcmdldFggKz0gcHJvdGVjdE9yZGVyLnRhcmdldC5waXhlbFdpZHRoIC8gKDIgKiBncmlkU2l6ZSk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0WSArPSBwcm90ZWN0T3JkZXIudGFyZ2V0LnBpeGVsSGVpZ2h0IC8gKDIgKiBncmlkU2l6ZSk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Q0dYID0gdGFyZ2V0WDtcbiAgICAgICAgICAgICAgICB0YXJnZXRDR1kgPSB0YXJnZXRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3RlY3RPcmRlci50YXJnZXQudHlwZSA9PSAnYnVpbGRpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0WCArPSBwcm90ZWN0T3JkZXIudGFyZ2V0LmdyaWRXaWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGFyZ2V0WSArPSBwcm90ZWN0T3JkZXIudGFyZ2V0LmdyaWRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Q0dYID0gdGFyZ2V0WDtcbiAgICAgICAgICAgICAgICB0YXJnZXRDR1kgKz0gcHJvdGVjdE9yZGVyLnRhcmdldC5ncmlkSGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNYXRoLnBvdyh0YXJnZXRYIC0gdGhpcy54LCAyKSArIE1hdGgucG93KHRhcmdldFkgLSB0aGlzLnksIDIpID4gTWF0aC5wb3codGhpcy5zaWdodCAtIDEsIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG8oeyB4OiBNYXRoLmZsb29yKHRhcmdldFgpLCB5OiBNYXRoLmZsb29yKHRhcmdldFkpIH0sIHRydWUsIHNwZWVkQWRqdXN0bWVudEZhY3RvciwgdW5pdHMsIGN1clBsYXllclRlYW0sIG9ic3RydWN0aW9uR3JpZCwgaGVyb09ic3RydWN0aW9uR3JpZCwgZGVidWdNb2RlLCBjb250ZXh0LCBncmlkU2l6ZSwgc2NyZWVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNYXRoLnBvdyh0YXJnZXRYIC0gdGhpcy54LCAyKSArIE1hdGgucG93KHRhcmdldFkgLSB0aGlzLnksIDIpIDw9IE1hdGgucG93KHRoaXMuc2lnaHQsIDIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3JkZXJzLnR5cGUgPT0gJ2F0dGFjaycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR1cnJldEFuZ2xlID0gdGhpcy5maW5kQW5nbGUoeyB4OiB0YXJnZXRDR1gsIHk6IHRhcmdldENHWSB9LCB0aGlzLCAzMik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR1cnJldERpcmVjdGlvbiA9PSB0dXJyZXRBbmdsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWltaW5nIHR1cnJldCBhdCBoaW0gYW5kIHdpdGhpbiByYW5nZS4uLiBGSVJFISEhISFcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnB1c2goeyB0eXBlOiAnZmlyZScgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuaW5zdHJ1Y3Rpb25zPVt7dHlwZTonZmlyZSd9XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnB1c2goeyB0eXBlOiAnYWltJywgdG9EaXJlY3Rpb246IHR1cnJldEFuZ2xlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndHVycmV0ICcrdGhpcy50dXJyZXREaXJlY3Rpb24gKycgIC0+ICcrdHVycmV0QW5nbGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZy4uLiB3YWl0Li4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlcnMudHlwZSA9PSAnYnVpbGQnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlRGlyZWN0aW9uICE9IDE1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMucHVzaCh7IHR5cGU6ICd0dXJuJywgdG9EaXJlY3Rpb246IDE1IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnZGVzdHJveSc7XG4gICAgICAgICAgICAgICAgc291bmRzLnBsYXkoJ2NvbnN0cnVjdGlvbicpO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5ncy5wdXNoKGJ1aWxkaW5nc0ZhY3RvcnkuYWRkKHsgbmFtZTogJ2NvbnN0cnVjdGlvbi15YXJkJywgeDogTWF0aC5mbG9vcih0aGlzLngpIC0gMSwgeTogTWF0aC5mbG9vcih0aGlzLnkpIC0gMSwgc3RhdHVzOiAnYnVpbGQnLCB0ZWFtOiBjdXJQbGF5ZXJUZWFtIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVycy50eXBlID09ICdndWFyZCcpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IHNlZSBpZiBhbiBldmlsIHVuaXQgaXMgaW4gc2lnaHQgYW5kIHRyYWNrIGl0IDopXG4gICAgICAgICAgICB2YXIgZW5lbWllc0luUmFuZ2UgPSB0aGlzLmZpbmRFbmVtaWVzSW5SYW5nZSh0aGlzLCAyLCB1bml0cywgYnVpbGRpbmdzLCB0dXJyZXRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByaW1hcnlXZWFwb24gJiYgZW5lbWllc0luUmFuZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBlbmVteSA9IGVuZW1pZXNJblJhbmdlWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMub3JkZXJzID0geyB0eXBlOiAnYXR0YWNrJywgdGFyZ2V0OiBlbmVteSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBWZWhpY2xlLnByb3RvdHlwZS5tb3ZlVG8gPSBmdW5jdGlvbiAoZGVzdGluYXRpb24sIHR1cnJldEF0VGFyZ2V0LCBzcGVlZEFkanVzdG1lbnRGYWN0b3IsIHVuaXRzLCBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbikge1xuICAgICAgICB2YXIgc3RhcnQgPSBbTWF0aC5mbG9vcih0aGlzLngpLCBNYXRoLmZsb29yKHRoaXMueSldO1xuICAgICAgICB2YXIgZW5kID0gW2Rlc3RpbmF0aW9uLngsIGRlc3RpbmF0aW9uLnldO1xuICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmZpbmRQYXRoKHN0YXJ0LCBlbmQsIHRoaXMudGVhbSA9PSBjdXJQbGF5ZXJUZWFtLCBvYnN0cnVjdGlvbkdyaWQsIGhlcm9PYnN0cnVjdGlvbkdyaWQsIGRlYnVnTW9kZSwgY29udGV4dCwgZ3JpZFNpemUsIHNjcmVlbik7XG4gICAgICAgIC8vdGhpcy5wYXRoID0gW107XG4gICAgICAgIC8vdGhpcy5wYXRoID0gW3t4OnN0YXJ0WzBdLHk6c3RhcnRbMV19LHt4OmVuZFswXSx5OmVuZFsxXX1dO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5wYXRoLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy54IC0gZGVzdGluYXRpb24ueCkgPCAxICYmIE1hdGguYWJzKHRoaXMueSAtIGRlc3RpbmF0aW9uLnkpIDwgMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnggPT0gZW5kWzBdICYmIHRoaXMueSA9PSBlbmRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZWFjaGVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGggPSBbeyB4OiBzdGFydFswXSwgeTogc3RhcnRbMV0gfSwgeyB4OiBlbmRbMF0sIHk6IGVuZFsxXSB9XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgbmV3QW5nbGUgPSB0aGlzLmZpbmRBbmdsZSh0aGlzLnBhdGhbMV0sIHRoaXMucGF0aFswXSwgMzIpO1xuICAgICAgICAgICAgdmFyIG1vdmVtZW50ID0gdGhpcy5tb3ZlbWVudFNwZWVkICogc3BlZWRBZGp1c3RtZW50RmFjdG9yIC8gZ3JpZFNpemU7XG4gICAgICAgICAgICB2YXIgYW5nbGVSYWRpYW5zID0gKHRoaXMubW92ZURpcmVjdGlvbiAvIDMyKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMueCAtIG1vdmVtZW50ICogTWF0aC5zaW4oYW5nbGVSYWRpYW5zKSk7XG4gICAgICAgICAgICB0aGlzLnkgPSAodGhpcy55IC0gbW92ZW1lbnQgKiBNYXRoLmNvcyhhbmdsZVJhZGlhbnMpKTtcbiAgICAgICAgICAgIHRoaXMuY29sbGlkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY29sbGlzaW9uO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IHVuaXRzLmxlbmd0aCAtIDE7IGsgPj0gMDsgay0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uKHVuaXRzW2tdLCBncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbi5kaXN0YW5jZSA8IHRoaXMuY29sbGlzaW9uRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uVHlwZSA9IGNvbGxpc2lvbi50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EaXN0YW5jZSA9IGNvbGxpc2lvbi5kaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uV2l0aCA9IHVuaXRzW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9hbGVydCgnY29sbGlkaW5nJyArIHRoaXMuY29sbGlzaW9uVHlwZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgb2JzdHJ1Y3Rpb25HcmlkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBvYnN0cnVjdGlvbkdyaWRba10ubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic3RydWN0aW9uR3JpZFtrXVtsXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoKGsrMC41KSpnYW1lLmdyaWRTaXplICsnICcrKGwrMC41KSpnYW1lLmdyaWRTaXplICsgJyBnYW1lLmdyaWRTaXplKjAuNScpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAobCArIDAuNSksIHk6IChrICsgMC41KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25SYWRpdXM6IGdyaWRTaXplICogMC41LCBzb2Z0Q29sbGlzaW9uUmFkaXVzOiBncmlkU2l6ZSAqIDAuN1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbih0aWxlLCBncmlkU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGlzaW9uLmRpc3RhbmNlIDwgdGhpcy5jb2xsaXNpb25EaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvblR5cGUgPSBjb2xsaXNpb24udHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EaXN0YW5jZSA9IGNvbGxpc2lvbi5kaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25XaXRoID0gdGlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KCdjb2xsaWRpbmcnICsgdGhpcy5jb2xsaXNpb25UeXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMueCA9ICh0aGlzLnggKyBtb3ZlbWVudCAqIE1hdGguc2luKGFuZ2xlUmFkaWFucykpO1xuICAgICAgICAgICAgdGhpcy55ID0gKHRoaXMueSArIG1vdmVtZW50ICogTWF0aC5jb3MoYW5nbGVSYWRpYW5zKSk7XG4gICAgICAgICAgICAvL3RoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2xsaWRpbmcpIHtcbiAgICAgICAgICAgICAgICAvL2hpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgY29sbERpcmVjdGlvbiA9IHRoaXMuZmluZEFuZ2xlKHRoaXMuY29sbGlzaW9uV2l0aCwgdGhpcywgMzIpO1xuICAgICAgICAgICAgICAgIHZhciBkVHVybiA9IHRoaXMuYW5nbGVEaWZmKHRoaXMubW92ZURpcmVjdGlvbiwgY29sbERpcmVjdGlvbiwgMzIpO1xuICAgICAgICAgICAgICAgIHZhciBkVHVybkRlc3RpbmF0aW9uID0gdGhpcy5hbmdsZURpZmYobmV3QW5nbGUsIGNvbGxEaXJlY3Rpb24sIDMyKTtcbiAgICAgICAgICAgICAgICAvKmlmKHRoaXMuY29sbGlzaW9uV2l0aCAmJiB0aGlzLmNvbGxpc2lvbldpdGgudHlwZT09J3ZlaGljbGUnICYmIHRoaXMuY29sbGlzaW9uVHlwZS5pbmRleE9mKCdoYXJkJyk+LTEgJiYgTWF0aC5hYnMoZFR1cm4pPDkpe1xuICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY29sbGlzaW9uV2l0aC5pbnN0cnVjdGlvbnMubGVuZ3RoPT0wICYmIHRoaXMuY29sbGlzaW9uV2l0aC5vcmRlcnMudHlwZSA9PSAnZ3VhcmQnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25XaXRoLm9yZGVycyA9IHt0eXBlOidtYWtlLXdheScsZm9yOnRoaXN9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY29sbGlzaW9uVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdoYXJkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoJ2NvbGxEaXJlY3Rpb24nK2NvbGxEaXJlY3Rpb24gKyAnbW92ZURpcmVjdGlvbiAnK3RoaXMubW92ZURpcmVjdGlvbiArICcgZFR1cm4gJyArZFR1cm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkVHVybikgPT0gMCkgeyAvLyBCdW1waW5nIGludG8gc29tZXRoaW5nIGFoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRUdXJuRGVzdGluYXRpb24pID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtMSAqIGRUdXJuRGVzdGluYXRpb24gLyBNYXRoLmFicyhkVHVybkRlc3RpbmF0aW9uKSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLTEsIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vL2NvbnNvbGUubG9nKCdtb3Zpbmc6JyArIHRoaXMubW92ZURpcmVjdGlvbiArJyBjb2xsOiAnK3RoaXMuY29sbGlzaW9uVHlwZSsnICcrY29sbERpcmVjdGlvbiArICcgZFR1cm46JyArZFR1cm4gKyAnIFJFU1VMVDogbmV3QW5nbGU6JyArbmV3QW5nbGUgKycgc3BlZWQ6Jyt0aGlzLm1vdmVtZW50U3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IG5ld0FuZ2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZFR1cm4pIDw9IDIpIHsgLy8gQnVtcGluZyBpbnRvIHNvbWV0aGluZyBhaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKE1hdGguYWJzKGRUdXJuKTxNYXRoLmFicyhkVHVybkRlc3RpbmF0aW9uKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLTEgKiBkVHVybiAvIE1hdGguYWJzKGRUdXJuKSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9jb25zb2xlLmxvZygnbW92aW5nOicgKyB0aGlzLm1vdmVEaXJlY3Rpb24gKycgY29sbDogJyt0aGlzLmNvbGxpc2lvblR5cGUrJyAnK2NvbGxEaXJlY3Rpb24gKyAnIGRUdXJuOicgK2RUdXJuICsgJyBSRVNVTFQ6IG5ld0FuZ2xlOicgK25ld0FuZ2xlICsnIHNwZWVkOicrdGhpcy5tb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL25ld0FuZ2xlID0gdGhpcy5tb3ZlRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLC1kVHVybioxLDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGRUdXJuKSA8IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMubW92ZW1lbnRTcGVlZCAtPSB0aGlzLnNwZWVkLzI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAodGhpcy5tb3ZlbWVudFNwZWVkIDwgLXRoaXMuc3BlZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gLXRoaXMuc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAoTWF0aC5hYnMoZFR1cm4pPE1hdGguYWJzKGRUdXJuRGVzdGluYXRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtMSAqIGRUdXJuIC8gTWF0aC5hYnMoZFR1cm4pLCAzMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbW92aW5nOicgKyB0aGlzLm1vdmVEaXJlY3Rpb24gKycgY29sbDogJyt0aGlzLmNvbGxpc2lvblR5cGUrJyAnK2NvbGxEaXJlY3Rpb24gKyAnIGRUdXJuOicgK2RUdXJuICsgJyBSRVNVTFQ6IG5ld0FuZ2xlOicgK25ld0FuZ2xlICsnIHNwZWVkOicrdGhpcy5tb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGRUdXJuKSA8IDkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtZFR1cm4gLyBNYXRoLmFicyhkVHVybiksIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc29mdC1oYXJkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qaWYodGhpcy5jb2xsaXNpb25XaXRoICYmIHRoaXMuY29sbGlzaW9uV2l0aC50eXBlPT0ndmVoaWNsZScgJiYgTWF0aC5hYnMoZFR1cm4pPDIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb2xsaXNpb25XaXRoLmluc3RydWN0aW9ucy5sZW5ndGg9PTAgJiYgdGhpcy5jb2xsaXNpb25XaXRoLm9yZGVycy50eXBlID09ICdndWFyZCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25XaXRoLm9yZGVycyA9IHt0eXBlOidtYWtlLXdheScsZm9yOnRoaXN9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRUdXJuKSA9PSAwKSB7IC8vIEJ1bXBpbmcgaW50byBzb21ldGhpbmcgYWhlYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkVHVybkRlc3RpbmF0aW9uKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLTEgKiBkVHVybkRlc3RpbmF0aW9uIC8gTWF0aC5hYnMoZFR1cm5EZXN0aW5hdGlvbiksIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FuZ2xlID0gdGhpcy5hZGRBbmdsZSh0aGlzLm1vdmVEaXJlY3Rpb24sIC0xLCAzMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ21vdmluZzonICsgdGhpcy5tb3ZlRGlyZWN0aW9uICsnIGNvbGw6ICcrdGhpcy5jb2xsaXNpb25UeXBlKycgJytjb2xsRGlyZWN0aW9uICsgJyBkVHVybjonICtkVHVybiArICcgUkVTVUxUOiBuZXdBbmdsZTonICtuZXdBbmdsZSArJyBzcGVlZDonK3RoaXMubW92ZW1lbnRTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRGlyZWN0aW9uID0gbmV3QW5nbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkVHVybikgPD0gMikgeyAvLyBCdW1waW5nIGludG8gc29tZXRoaW5nIGFoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKnRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQqKHRoaXMuY29sbGlzaW9uRGlzdGFuY2UtdGhpcy5jb2xsaXNpb25SYWRpdXMpLyh0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgLSB0aGlzLmNvbGxpc2lvblJhZGl1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZW1lbnRTcGVlZDwwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLm1vdmVtZW50U3BlZWQgID10aGlzLnNwZWVkLzM7Ly8tPSB0aGlzLnNwZWVkKjEvMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtMSAqIGRUdXJuIC8gTWF0aC5hYnMoZFR1cm4pLCAzMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbW92aW5nOicgKyB0aGlzLm1vdmVEaXJlY3Rpb24gKycgY29sbDogJyt0aGlzLmNvbGxpc2lvblR5cGUrJyAnK2NvbGxEaXJlY3Rpb24gKyAnIGRUdXJuOicgK2RUdXJuICsgJyBSRVNVTFQ6IG5ld0FuZ2xlOicgK25ld0FuZ2xlICsnIHNwZWVkOicrdGhpcy5tb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGRUdXJuKSA8IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKE1hdGguYWJzKGRUdXJuKTxNYXRoLmFicyhkVHVybkRlc3RpbmF0aW9uKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLTEgKiBkVHVybiAvIE1hdGguYWJzKGRUdXJuKSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ21vdmluZzonICsgdGhpcy5tb3ZlRGlyZWN0aW9uICsnIGNvbGw6ICcrdGhpcy5jb2xsaXNpb25UeXBlKycgJytjb2xsRGlyZWN0aW9uICsgJyBkVHVybjonICtkVHVybiArICcgUkVTVUxUOiBuZXdBbmdsZTonICtuZXdBbmdsZSArJyBzcGVlZDonK3RoaXMubW92ZW1lbnRTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRGlyZWN0aW9uID0gbmV3QW5nbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkVHVybikgPCA5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLm1vdmVtZW50U3BlZWQgPSB0aGlzLnNwZWVkKih0aGlzLmNvbGxpc2lvbkRpc3RhbmNlLXRoaXMuY29sbGlzaW9uUmFkaXVzKS8odGhpcy5zb2Z0Q29sbGlzaW9uUmFkaXVzIC0gdGhpcy5jb2xsaXNpb25SYWRpdXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMubW92ZW1lbnRTcGVlZDwwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMubW92ZW1lbnRTcGVlZCA9dGhpcy5zcGVlZC8yOy8vLT0gdGhpcy5zcGVlZC8zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FuZ2xlID0gdGhpcy5hZGRBbmdsZSh0aGlzLm1vdmVEaXJlY3Rpb24sIC0xICogZFR1cm4gLyBNYXRoLmFicyhkVHVybiksIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdtb3Zpbmc6JyArIHRoaXMubW92ZURpcmVjdGlvbiArJyBjb2xsOiAnK3RoaXMuY29sbGlzaW9uVHlwZSsnICcrY29sbERpcmVjdGlvbiArICcgZFR1cm46JyArZFR1cm4gKyAnIFJFU1VMVDogbmV3QW5nbGU6JyArbmV3QW5nbGUgKycgc3BlZWQ6Jyt0aGlzLm1vdmVtZW50U3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IG5ld0FuZ2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gdGhpcy5zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdtb3Zpbmc6JyArIHRoaXMubW92ZURpcmVjdGlvbiArJyBjb2xsOiAnK3RoaXMuY29sbGlzaW9uVHlwZSsnICcrY29sbERpcmVjdGlvbiArICcgZFR1cm46JyArZFR1cm4gKyAnIFJFU1VMVDogbmV3QW5nbGU6JyArbmV3QW5nbGUgKycgc3BlZWQ6Jyt0aGlzLm1vdmVtZW50U3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbmV3QW5nbGUgPSB0aGlzLm1vdmVEaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc29mdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZFR1cm4pID09IDApIHsgLy8gQnVtcGluZyBpbnRvIHNvbWV0aGluZyBhaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQgKiAodGhpcy5jb2xsaXNpb25EaXN0YW5jZSAtIHRoaXMuY29sbGlzaW9uUmFkaXVzKSAvICh0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgLSB0aGlzLmNvbGxpc2lvblJhZGl1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZW1lbnRTcGVlZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRUdXJuRGVzdGluYXRpb24pID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtMSAqIGRUdXJuRGVzdGluYXRpb24gLyBNYXRoLmFicyhkVHVybkRlc3RpbmF0aW9uKSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLTEsIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbW92aW5nOicgKyB0aGlzLm1vdmVEaXJlY3Rpb24gKycgY29sbDogJyt0aGlzLmNvbGxpc2lvblR5cGUrJyAnK2NvbGxEaXJlY3Rpb24gKyAnIGRUdXJuOicgK2RUdXJuICsgJyBSRVNVTFQ6IG5ld0FuZ2xlOicgK25ld0FuZ2xlICsnIHNwZWVkOicrdGhpcy5tb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMubW92ZURpcmVjdGlvbiA9IG5ld0FuZ2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5tb3ZlRGlyZWN0aW9uID0gbmV3QW5nbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkVHVybikgPD0gMikgeyAvLyBCdW1waW5nIGludG8gc29tZXRoaW5nIGFoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gdGhpcy5zcGVlZCAqICh0aGlzLmNvbGxpc2lvbkRpc3RhbmNlIC0gdGhpcy5jb2xsaXNpb25SYWRpdXMpIC8gKHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyAtIHRoaXMuY29sbGlzaW9uUmFkaXVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlbWVudFNwZWVkIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBbmdsZSA9IHRoaXMuYWRkQW5nbGUodGhpcy5tb3ZlRGlyZWN0aW9uLCAtZFR1cm4gKiAxLCAzMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbW92aW5nOicgKyB0aGlzLm1vdmVEaXJlY3Rpb24gKycgY29sbDogJyt0aGlzLmNvbGxpc2lvblR5cGUrJyAnK2NvbGxEaXJlY3Rpb24gKyAnIGRUdXJuOicgK2RUdXJuICsgJyBSRVNVTFQ6IG5ld0FuZ2xlOicgK25ld0FuZ2xlICsnIHNwZWVkOicrdGhpcy5tb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMubW92ZURpcmVjdGlvbiA9IG5ld0FuZ2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZFR1cm4pIDwgNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQgKiAodGhpcy5jb2xsaXNpb25EaXN0YW5jZSAtIHRoaXMuY29sbGlzaW9uUmFkaXVzKSAvICh0aGlzLnNvZnRDb2xsaXNpb25SYWRpdXMgLSB0aGlzLmNvbGxpc2lvblJhZGl1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZW1lbnRTcGVlZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QW5nbGUgPSB0aGlzLmFkZEFuZ2xlKHRoaXMubW92ZURpcmVjdGlvbiwgLWRUdXJuICogMSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ21vdmluZzonICsgdGhpcy5tb3ZlRGlyZWN0aW9uICsnIGNvbGw6ICcrdGhpcy5jb2xsaXNpb25UeXBlKycgJytjb2xsRGlyZWN0aW9uICsgJyBkVHVybjonICtkVHVybiArICcgUkVTVUxUOiBuZXdBbmdsZTonICtuZXdBbmdsZSArJyBzcGVlZDonK3RoaXMubW92ZW1lbnRTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLm1vdmVEaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGRUdXJuKSA8IDkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FuZ2xlID0gdGhpcy5hZGRBbmdsZSh0aGlzLm1vdmVEaXJlY3Rpb24sIC1kVHVybiAqIDEsIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdtb3Zpbmc6JyArIHRoaXMubW92ZURpcmVjdGlvbiArJyBjb2xsOiAnK3RoaXMuY29sbGlzaW9uVHlwZSsnICcrY29sbERpcmVjdGlvbiArICcgZFR1cm46JyArZFR1cm4gKyAnIFJFU1VMVDogbmV3QW5nbGU6JyArbmV3QW5nbGUgKycgc3BlZWQ6Jyt0aGlzLm1vdmVtZW50U3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5tb3ZlRGlyZWN0aW9uID0gbmV3QW5nbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ21vdmluZzonICsgdGhpcy5tb3ZlRGlyZWN0aW9uICsnIGNvbGw6ICcrdGhpcy5jb2xsaXNpb25UeXBlKycgJytjb2xsRGlyZWN0aW9uICsgJyBkVHVybjonICtkVHVybiArICcgUkVTVUxUOiBuZXdBbmdsZTonICtuZXdBbmdsZSArJyBzcGVlZDonK3RoaXMubW92ZW1lbnRTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9uZXdBbmdsZSA9IHRoaXMubW92ZURpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlbWVudFNwZWVkID4gdGhpcy5zcGVlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmVtZW50U3BlZWQgPCAtdGhpcy5zcGVlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IC10aGlzLnNwZWVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZURpcmVjdGlvbiAhPSBuZXdBbmdsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnB1c2goeyB0eXBlOiAndHVybicsIHRvRGlyZWN0aW9uOiBuZXdBbmdsZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYWdUdXJuID0gTWF0aC5hYnModGhpcy5hbmdsZURpZmYodGhpcy5tb3ZlRGlyZWN0aW9uLCBuZXdBbmdsZSwgMzIpKTtcbiAgICAgICAgICAgIC8vaWYgKG1hZ1R1cm48MiB8fCB0aGlzLmNvbGxpZGluZyl7XG4gICAgICAgICAgICB2YXIgY29sbGlzaW9uMjtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgb2JzdHJ1Y3Rpb25HcmlkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBvYnN0cnVjdGlvbkdyaWRba10ubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic3RydWN0aW9uR3JpZFtrXVtsXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoKGsrMC41KSpnYW1lLmdyaWRTaXplICsnICcrKGwrMC41KSpnYW1lLmdyaWRTaXplICsgJyBnYW1lLmdyaWRTaXplKjAuNScpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAobCArIDAuNSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKGsgKyAwLjUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvblJhZGl1czogZ3JpZFNpemUgKiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29mdENvbGxpc2lvblJhZGl1czogZ3JpZFNpemUgKiAwLjdcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGlzaW9uMiA9IHRoaXMuY29sbGlzaW9uKHRpbGUsIGdyaWRTaXplKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgaWYgKG1hZ1R1cm4gPCAzIHx8IHRoaXMuY29sbGlkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMucHVzaCh7IHR5cGU6ICdtb3ZlJywgZGlzdGFuY2U6IDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHVycmV0QW5nbGU7XG4gICAgICAgICAgICBpZiAodHVycmV0QXRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0dXJyZXRBbmdsZSA9IHRoaXMuZmluZEFuZ2xlKGRlc3RpbmF0aW9uLCB0aGlzLCAzMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3R1cnJldEFuZ2xlID0gdGhpcy5tb3ZlRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMucGF0aC5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICB0dXJyZXRBbmdsZSA9IHRoaXMuZmluZEFuZ2xlKHRoaXMucGF0aFsxXSwgdGhpcy5wYXRoWzBdLCAzMik7XG4gICAgICAgICAgICAgICAgLy8gdHVycmV0QW5nbGUgPSBmaW5kQW5nbGUoe3g6dGFyZ2V0WCx5OnRhcmdldFl9LHRoaXMsMzIpO1xuICAgICAgICAgICAgICAgIC8vdGhpcy50dXJyZXREaXJlY3Rpb24gPSBuZXdBbmdsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnR1cnJldERpcmVjdGlvbiAhPSB0dXJyZXRBbmdsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnB1c2goeyB0eXBlOiAnYWltJywgdG9EaXJlY3Rpb246IHR1cnJldEFuZ2xlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBWZWhpY2xlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKHNwZWVkQWRqdXN0bWVudEZhY3RvciwgZ3JpZFNpemUsIHNvdW5kcywgYnVsbGV0RHJhd2VyKSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGluc3RyID0gdGhpcy5pbnN0cnVjdGlvbnNbaV07XG4gICAgICAgICAgICBpZiAoaW5zdHIudHlwZSA9PSAndHVybicpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHVybkluc3RyID0gaW5zdHI7XG4gICAgICAgICAgICAgICAgaWYgKHR1cm5JbnN0ci50b0RpcmVjdGlvbiA9PSB0aGlzLm1vdmVEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zdHJ1Y3Rpb24gY29tcGxldGUuLi5cbiAgICAgICAgICAgICAgICAgICAgaW5zdHIudHlwZSA9ICdkb25lJztcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgodHVybkluc3RyLnRvRGlyZWN0aW9uID4gdGhpcy5tb3ZlRGlyZWN0aW9uICYmICh0dXJuSW5zdHIudG9EaXJlY3Rpb24gLSB0aGlzLm1vdmVEaXJlY3Rpb24pIDwgMTYpXG4gICAgICAgICAgICAgICAgICAgIHx8ICh0dXJuSW5zdHIudG9EaXJlY3Rpb24gPCB0aGlzLm1vdmVEaXJlY3Rpb24gJiYgKHRoaXMubW92ZURpcmVjdGlvbiAtIHR1cm5JbnN0ci50b0RpcmVjdGlvbikgPiAxNikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hbGVydCh0aGlzLnR1cm5TcGVlZCowLjA1KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSB0aGlzLm1vdmVEaXJlY3Rpb24gKyB0aGlzLnR1cm5TcGVlZCAqIDAuMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLm1vdmVEaXJlY3Rpb24gLSB0dXJuSW5zdHIudG9EaXJlY3Rpb24pICogKHRoaXMubW92ZURpcmVjdGlvbiArIHRoaXMudHVyblNwZWVkICogMC4xIC0gdHVybkluc3RyLnRvRGlyZWN0aW9uKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSB0dXJuSW5zdHIudG9EaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IHRoaXMubW92ZURpcmVjdGlvbiAtIHRoaXMudHVyblNwZWVkICogMC4xO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMubW92ZURpcmVjdGlvbiAtIHR1cm5JbnN0ci50b0RpcmVjdGlvbikgKiAodGhpcy5tb3ZlRGlyZWN0aW9uIC0gdGhpcy50dXJuU3BlZWQgKiAwLjEgLSB0dXJuSW5zdHIudG9EaXJlY3Rpb24pIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURpcmVjdGlvbiA9IHR1cm5JbnN0ci50b0RpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlRGlyZWN0aW9uID4gMzEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZlRGlyZWN0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEaXJlY3Rpb24gPSAzMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5zdHIudHlwZSA9PSAnbW92ZScpIHtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KDEpO1xuICAgICAgICAgICAgICAgIHZhciBtb3ZlSW5zdHIgPSBpbnN0cjtcbiAgICAgICAgICAgICAgICBpZiAobW92ZUluc3RyLmRpc3RhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmluc3RydWN0aW9ucy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGluc3RyLnR5cGUgPSAnZG9uZSc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQodGhpcy5tb3ZlbWVudFNwZWVkKVxuICAgICAgICAgICAgICAgIHZhciBtb3ZlbWVudCA9IHRoaXMubW92ZW1lbnRTcGVlZCAqIHNwZWVkQWRqdXN0bWVudEZhY3RvciAvIGdyaWRTaXplO1xuICAgICAgICAgICAgICAgIG1vdmVJbnN0ci5kaXN0YW5jZSAtPSBtb3ZlbWVudDtcbiAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSAodGhpcy5tb3ZlRGlyZWN0aW9uIC8gMzIpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMueCAtIG1vdmVtZW50ICogTWF0aC5zaW4oYW5nbGUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAodGhpcy55IC0gbW92ZW1lbnQgKiBNYXRoLmNvcyhhbmdsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluc3RyLnR5cGUgPT0gJ2FpbScpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWltSW5zdHIgPSBpbnN0cjtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KCdhaW1pbmc6ICcgKyBpbnN0ci50b0RpcmVjdGlvbiArICcgYW5kIHR1cnJldCBpcyBhdCAnK3RoaXMudHVycmV0RGlyZWN0aW9uKVxuICAgICAgICAgICAgICAgIGlmIChhaW1JbnN0ci50b0RpcmVjdGlvbiA9PSB0aGlzLnR1cnJldERpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpbnN0cnVjdGlvbiBjb21wbGV0ZS4uLlxuICAgICAgICAgICAgICAgICAgICBpbnN0ci50eXBlID0gJ2RvbmUnO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YSA9IHRoaXMuYW5nbGVEaWZmKE1hdGguZmxvb3IodGhpcy50dXJyZXREaXJlY3Rpb24pLCBNYXRoLmZsb29yKGFpbUluc3RyLnRvRGlyZWN0aW9uKSwgMzIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLnR1cnJldERpcmVjdGlvbiA9IGluc3RyLnRvRGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cnJldERpcmVjdGlvbiA9IGFpbUluc3RyLnRvRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHIudHlwZSA9ICdkb25lJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHVycmV0RGlyZWN0aW9uID0gdGhpcy5hZGRBbmdsZSh0aGlzLnR1cnJldERpcmVjdGlvbiwgZGVsdGEgLyBNYXRoLmFicyhkZWx0YSksIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnN0ci50eXBlID09ICdmaXJlJykge1xuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KHRoaXMuZmlyZUNvdW50ZXIpXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ1bGxldEZpcmluZykge1xuICAgICAgICAgICAgICAgICAgICBzb3VuZHMucGxheSgndGFua19maXJlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0RmlyaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuZ2xlID0gKHRoaXMudHVycmV0RGlyZWN0aW9uIC8gMzIpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldERyYXdlci5maXJlQnVsbGV0KHsgeDogdGhpcy54LCB5OiB0aGlzLnksIGFuZ2xlOiBhbmdsZSwgcmFuZ2U6IHRoaXMuc2lnaHQsIHNvdXJjZTogdGhpcyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH07XG4gICAgVmVoaWNsZS5wcm90b3R5cGUuZmluZFBhdGggPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgaXNIZXJvVGVhbSwgb2JzdHJ1Y3Rpb25HcmlkLCBoZXJvT2JzdHJ1Y3Rpb25HcmlkLCBkZWJ1Z01vZGUsIGNvbnRleHQsIGdyaWRTaXplLCBzY3JlZW4pIHtcbiAgICAgICAgdmFyIGcgPSBpc0hlcm9UZWFtID8gaGVyb09ic3RydWN0aW9uR3JpZCA6IG9ic3RydWN0aW9uR3JpZDtcbiAgICAgICAgLy8gaGFjayB0byBmaW5kIHBhdGggdG8gYnVpbGRpbmdzXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBnW2VuZFsxXV1bZW5kWzBdXSA9IDA7XG4gICAgICAgICAgICBnW3N0YXJ0WzFdXVtzdGFydFswXV07XG4gICAgICAgICAgICAvL2FsZXJ0KGVuZC55KVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBbeyB4OiBzdGFydFswXSwgeTogc3RhcnRbMV0gfSwgeyB4OiBlbmRbMF0sIHk6IGVuZFsxXSB9XTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IEFTdGFyKGcsIHN0YXJ0LCBlbmQsICdFdWNsaWRlYW4nKTtcbiAgICAgICAgdGhpcy5zaG9ydGVuUGF0aChwYXRoLCBnKTtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID4gMSAmJiBkZWJ1Z01vZGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcGF0aC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIC8vZ2FtZS5oaWdobGlnaHRHcmlkKHBhdGhba10ueCxwYXRoW2tdLnksMSwxLCdyZ2JhKDEwMCwxMDAsMTAwLDAuMyknKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMTUwLDUwLDEwMCwwLjUpJztcbiAgICAgICAgICAgICAgICBjb250ZXh0LmFyYygocGF0aFtrXS54ICsgMC41KSAqIGdyaWRTaXplICsgc2NyZWVuLnZpZXdwb3J0QWRqdXN0LngsIChwYXRoW2tdLnkgKyAwLjUpICogZ3JpZFNpemUgKyBzY3JlZW4udmlld3BvcnRBZGp1c3QueSwgNSwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoO1xuICAgIH07XG4gICAgVmVoaWNsZS5wcm90b3R5cGUuc2hvcnRlblBhdGggPSBmdW5jdGlvbiAocGF0aCwgZ3JpZCkge1xuICAgICAgICAvL2FsZXJ0KDEpO1xuICAgICAgICAvL3JldHVybjtcbiAgICAgICAgdmFyIG5leHRDZWxsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHZhciBzdGFydCA9IHBhdGhbMF07XG4gICAgICAgIC8vYWxlcnQoMClcbiAgICAgICAgd2hpbGUgKG5leHRDZWxsVmlzaWJsZSAmJiBwYXRoLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIC8vYWxlcnQoMC41KVxuICAgICAgICAgICAgdmFyIG5leHQgPSBwYXRoWzJdO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKG5leHQueSAtIHN0YXJ0LnkpID4gTWF0aC5hYnMobmV4dC54IC0gc3RhcnQueCkpIHtcbiAgICAgICAgICAgICAgICAvL2Fsb25nIHlcbiAgICAgICAgICAgICAgICB2YXIgc2xvcGUgPSAobmV4dC54IC0gc3RhcnQueCkgLyAobmV4dC55IC0gc3RhcnQueSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhWSA9IDAuNCAqIChuZXh0LnkgLSBzdGFydC55KSAvIE1hdGguYWJzKChuZXh0LnkgLSBzdGFydC55KSk7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSBkZWx0YVk7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB7IHg6IHN0YXJ0LnggKyB5ICogc2xvcGUsIHk6IHN0YXJ0LnkgKyB5IH07XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5leHRDZWxsVmlzaWJsZSAmJiBNYXRoLmFicyh0ZXN0LnkgLSBuZXh0LnkpID4gMC4zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWxlcnQodGVzdC55KVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JpZFtNYXRoLmZsb29yKHRlc3QueSldW01hdGguZmxvb3IodGVzdC54KV0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q2VsbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB5ICs9IGRlbHRhWTtcbiAgICAgICAgICAgICAgICAgICAgdGVzdCA9IHsgeDogc3RhcnQueCArIHkgKiBzbG9wZSwgeTogc3RhcnQueSArIHkgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9uZXh0Q2VsbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vYWxlcnQoMik7XG4gICAgICAgICAgICAgICAgdmFyIHNsb3BlID0gKG5leHQueSAtIHN0YXJ0LnkpIC8gKG5leHQueCAtIHN0YXJ0LngpO1xuICAgICAgICAgICAgICAgIHZhciBkZWx0YVggPSAwLjQgKiAobmV4dC54IC0gc3RhcnQueCkgLyBNYXRoLmFicyhuZXh0LnggLSBzdGFydC54KTtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGRlbHRhWDtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHsgeDogc3RhcnQueCArIHgsIHk6IHN0YXJ0LnkgKyBzbG9wZSAqIHggfTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV4dENlbGxWaXNpYmxlICYmIE1hdGguYWJzKHRlc3QueCAtIG5leHQueCkgPj0gMC4zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncmlkW01hdGguZmxvb3IodGVzdC55KV1bTWF0aC5mbG9vcih0ZXN0LngpXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDZWxsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHggKz0gZGVsdGFYO1xuICAgICAgICAgICAgICAgICAgICB0ZXN0ID0geyB4OiBzdGFydC54ICsgeCwgeTogc3RhcnQueSArIHNsb3BlICogeCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2Fsb25nIHhcbiAgICAgICAgICAgICAgICAvL25leHRDZWxsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5leHRDZWxsVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHBhdGguc3BsaWNlKDEsIDEpO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQocGF0aC5sZW5ndGgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFZlaGljbGUucHJvdG90eXBlLmNvbGxpc2lvbiA9IGZ1bmN0aW9uIChvdGhlclVuaXQsIGdyaWRTaXplKSB7XG4gICAgICAgIGlmICh0aGlzID09IG90aGVyVW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy9hbGVydChvdGhlclVuaXQueCArICcgJyArIG90aGVyVW5pdC55KVxuICAgICAgICB2YXIgZGlzdGFuY2VTcXVhcmVkID0gTWF0aC5wb3codGhpcy54IC0gb3RoZXJVbml0LngsIDIpICsgTWF0aC5wb3codGhpcy55IC0gb3RoZXJVbml0LnksIDIpO1xuICAgICAgICB2YXIgcmFkaXVzU3F1YXJlZCA9IE1hdGgucG93KCh0aGlzLmNvbGxpc2lvblJhZGl1cyArIG90aGVyVW5pdC5jb2xsaXNpb25SYWRpdXMpIC8gZ3JpZFNpemUsIDIpO1xuICAgICAgICB2YXIgc29mdEhhcmRSYWRpdXNTcXVhcmVkID0gTWF0aC5wb3coKHRoaXMuc29mdENvbGxpc2lvblJhZGl1cyArIG90aGVyVW5pdC5jb2xsaXNpb25SYWRpdXMpIC8gZ3JpZFNpemUsIDIpO1xuICAgICAgICB2YXIgc29mdFJhZGl1c1NxdWFyZWQgPSBNYXRoLnBvdygodGhpcy5zb2Z0Q29sbGlzaW9uUmFkaXVzICsgb3RoZXJVbml0LnNvZnRDb2xsaXNpb25SYWRpdXMpIC8gZ3JpZFNpemUsIDIpO1xuICAgICAgICBpZiAoZGlzdGFuY2VTcXVhcmVkIDw9IHJhZGl1c1NxdWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdoYXJkJywgZGlzdGFuY2U6IE1hdGgucG93KGRpc3RhbmNlU3F1YXJlZCwgMC41KSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpc3RhbmNlU3F1YXJlZCA8IHNvZnRIYXJkUmFkaXVzU3F1YXJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3NvZnQtaGFyZCcsIGRpc3RhbmNlOiBNYXRoLnBvdyhkaXN0YW5jZVNxdWFyZWQsIDAuNSkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaXN0YW5jZVNxdWFyZWQgPD0gc29mdFJhZGl1c1NxdWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdzb2Z0JywgZGlzdGFuY2U6IE1hdGgucG93KGRpc3RhbmNlU3F1YXJlZCwgMC41KSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBWZWhpY2xlO1xufShEZXN0cnVjdGlibGVPYmplY3QpKTtcbm1vZHVsZS5leHBvcnRzID0gVmVoaWNsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZlaGljbGUuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgVmlzdWFsT2JqZWN0ID0gcmVxdWlyZShcIi4vVmlzdWFsT2JqZWN0XCIpO1xudmFyIFZlaGljbGUgPSByZXF1aXJlKFwiLi9WZWhpY2xlXCIpO1xudmFyIEhhcnZlc3RlciA9IHJlcXVpcmUoXCIuL0hhcnZlc3RlclwiKTtcbnZhciBWZWhpY2xlcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVmVoaWNsZXMsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVmVoaWNsZXMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMudHlwZXMgPSBbXTtcbiAgICAgICAgX3RoaXMudmVoaWNsZURldGFpbHMgPSB7XG4gICAgICAgICAgICAnbWN2Jzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdtY3YnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTW9iaWxlIENvbnN0cnVjdGlvbiBWZWhpY2xlJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAndmVoaWNsZScsXG4gICAgICAgICAgICAgICAgdHVyblNwZWVkOiA1LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAxMixcbiAgICAgICAgICAgICAgICBjb3N0OiA1MDAwLFxuICAgICAgICAgICAgICAgIG1heEhpdFBvaW50czogMjAwLFxuICAgICAgICAgICAgICAgIHNpZ2h0OiAyLFxuICAgICAgICAgICAgICAgIG1vdmVJbWFnZUNvdW50OiAzMixcbiAgICAgICAgICAgICAgICBwaXhlbFdpZHRoOiA0OCxcbiAgICAgICAgICAgICAgICBwaXhlbEhlaWdodDogNDgsXG4gICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRYOiAtMjQsXG4gICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRZOiAtMjQsXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uUmFkaXVzOiAxMiwgLy8yMFxuICAgICAgICAgICAgICAgIHNvZnRDb2xsaXNpb25SYWRpdXM6IDE2LFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdtb3ZlJywgY291bnQ6IDMyIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdoYXJ2ZXN0ZXInOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2hhcnZlc3RlcicsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdIYXJ2ZXN0ZXInLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd2ZWhpY2xlJyxcbiAgICAgICAgICAgICAgICB0dXJuU3BlZWQ6IDUsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDEyLFxuICAgICAgICAgICAgICAgIGNvc3Q6IDE0MDAsXG4gICAgICAgICAgICAgICAgbWF4SGl0UG9pbnRzOiA2MDAsXG4gICAgICAgICAgICAgICAgc2lnaHQ6IDIsXG4gICAgICAgICAgICAgICAgdGliZXJpdW06IDAsXG4gICAgICAgICAgICAgICAgbW92ZUltYWdlQ291bnQ6IDMyLFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdtb3ZlJywgY291bnQ6IDMyIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2hhcnZlc3QtMDAnLCBjb3VudDogNCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdoYXJ2ZXN0LTA0JywgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnaGFydmVzdC0wOCcsIGNvdW50OiA0IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2hhcnZlc3QtMTInLCBjb3VudDogNCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdoYXJ2ZXN0LTE2JywgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnaGFydmVzdC0yMCcsIGNvdW50OiA0IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2hhcnZlc3QtMjQnLCBjb3VudDogNCB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdoYXJ2ZXN0LTI4JywgY291bnQ6IDQgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHBpeGVsV2lkdGg6IDQ4LFxuICAgICAgICAgICAgICAgIHBpeGVsSGVpZ2h0OiA0OCxcbiAgICAgICAgICAgICAgICBwaXhlbE9mZnNldFg6IC0yNCxcbiAgICAgICAgICAgICAgICBwaXhlbE9mZnNldFk6IC0yNCxcbiAgICAgICAgICAgICAgICBjb2xsaXNpb25SYWRpdXM6IDYsIC8vMjBcbiAgICAgICAgICAgICAgICBzb2Z0Q29sbGlzaW9uUmFkaXVzOiAxMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdsaWdodC10YW5rJzoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaWdodC10YW5rJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0xpZ2h0IFRhbmsnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd2ZWhpY2xlJyxcbiAgICAgICAgICAgICAgICB0dXJuU3BlZWQ6IDUsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDE4LFxuICAgICAgICAgICAgICAgIGNvc3Q6IDYwMCxcbiAgICAgICAgICAgICAgICBzaWdodDogMyxcbiAgICAgICAgICAgICAgICBtYXhIaXRQb2ludHM6IDMwMCxcbiAgICAgICAgICAgICAgICBwcmltYXJ5V2VhcG9uOiA5LFxuICAgICAgICAgICAgICAgIHJlbG9hZFRpbWU6IDIwMDAsXG4gICAgICAgICAgICAgICAgbW92ZUltYWdlQ291bnQ6IDMyLFxuICAgICAgICAgICAgICAgIHR1cnJldEltYWdlQ291bnQ6IDMyLFxuICAgICAgICAgICAgICAgIGltYWdlc1RvTG9hZDogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdtb3ZlJywgY291bnQ6IDMyIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ3R1cnJldCcsIGNvdW50OiAzMiB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBwaXhlbFdpZHRoOiAyNCxcbiAgICAgICAgICAgICAgICBwaXhlbEhlaWdodDogMjQsXG4gICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRYOiAtMTIsXG4gICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRZOiAtMTIsXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHNvZnRDb2xsaXNpb25SYWRpdXM6IDkgLy8xMFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5wcmVsb2FkQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5sb2FkZWRDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLm1vdmVtZW50U3BlZWQgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFZlaGljbGVzLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGRldGFpbHMgPSB0aGlzLnZlaGljbGVEZXRhaWxzW25hbWVdO1xuICAgICAgICB2YXIgdmVoaWNsZSA9IG5hbWUgPT0gdGhpcy52ZWhpY2xlRGV0YWlscy5oYXJ2ZXN0ZXIubmFtZVxuICAgICAgICAgICAgPyBuZXcgSGFydmVzdGVyKClcbiAgICAgICAgICAgIDogbmV3IFZlaGljbGUoKTtcbiAgICAgICAgdGhpcy5sb2FkU3ByaXRlU2hlZXQodmVoaWNsZSwgZGV0YWlscywgJ3VuaXRzL3ZlaGljbGVzJyk7XG4gICAgICAgICQuZXh0ZW5kKHZlaGljbGUsIGRldGFpbHMpO1xuICAgICAgICB2ZWhpY2xlLmhpdFBvaW50cyA9IGRldGFpbHMubWF4SGl0UG9pbnRzO1xuICAgICAgICB0aGlzLnR5cGVzW25hbWVdID0gdmVoaWNsZTtcbiAgICB9O1xuICAgIFZlaGljbGVzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgICAgICB2YXIgbmV3VmVoaWNsZSA9IGRldGFpbHMubmFtZSA9PSB0aGlzLnZlaGljbGVEZXRhaWxzLmhhcnZlc3Rlci5uYW1lXG4gICAgICAgICAgICA/IG5ldyBIYXJ2ZXN0ZXIoKVxuICAgICAgICAgICAgOiBuZXcgVmVoaWNsZSgpO1xuICAgICAgICBuZXdWZWhpY2xlLnRlYW0gPSBkZXRhaWxzLnRlYW07XG4gICAgICAgIHZhciBuYW1lID0gZGV0YWlscy5uYW1lO1xuICAgICAgICAkLmV4dGVuZChuZXdWZWhpY2xlLCB0aGlzLnR5cGVzW25hbWVdLmRlZmF1bHRzKTtcbiAgICAgICAgJC5leHRlbmQobmV3VmVoaWNsZSwgdGhpcy50eXBlc1tuYW1lXSk7XG4gICAgICAgICQuZXh0ZW5kKG5ld1ZlaGljbGUsIGRldGFpbHMpO1xuICAgICAgICBpZiAoZGV0YWlscy5oaXRQb2ludHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIG5ld1ZlaGljbGUuaGl0UG9pbnRzID0gZGV0YWlscy5oaXRQb2ludHM7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1ZlaGljbGUuaGl0UG9pbnRzID0gbmV3VmVoaWNsZS5tYXhIaXRQb2ludHM7XG4gICAgICAgIHJldHVybiBuZXdWZWhpY2xlO1xuICAgIH07XG4gICAgcmV0dXJuIFZlaGljbGVzO1xufShWaXN1YWxPYmplY3QpKTtcbm1vZHVsZS5leHBvcnRzID0gVmVoaWNsZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1WZWhpY2xlcy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZpc3VhbE9iamVjdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWaXN1YWxPYmplY3QoKSB7XG4gICAgfVxuICAgIFZpc3VhbE9iamVjdC5wcm90b3R5cGUucHJlbG9hZEltYWdlID0gZnVuY3Rpb24gKGltZ1VybCwgY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1hZ2Uuc3JjID0gJ2ltYWdlcy8nICsgaW1nVXJsO1xuICAgICAgICB0aGlzLnByZWxvYWRDb3VudCsrO1xuICAgICAgICAkKGltYWdlKS5iaW5kKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubG9hZGVkQ291bnQrKztcbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkZWRDb3VudCA9PSBfdGhpcy5wcmVsb2FkQ291bnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0Z1bmN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW1hZ2U7XG4gICAgfTtcbiAgICBWaXN1YWxPYmplY3QucHJvdG90eXBlLmxvYWRJbWFnZUFycmF5ID0gZnVuY3Rpb24gKGltZ05hbWUsIGNvdW50LCBleHRuKSB7XG4gICAgICAgIGlmICghZXh0bikge1xuICAgICAgICAgICAgZXh0biA9ICcucG5nJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW1hZ2VBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGltYWdlQXJyYXkucHVzaCh0aGlzLnByZWxvYWRJbWFnZShpbWdOYW1lICsgJy0nICsgKGkgPCAxMCA/ICcwJyA6ICcnKSArIGkgKyBleHRuKSk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICByZXR1cm4gaW1hZ2VBcnJheTtcbiAgICB9O1xuICAgIFZpc3VhbE9iamVjdC5wcm90b3R5cGUubG9hZFNwcml0ZVNoZWV0ID0gZnVuY3Rpb24gKGZvck9iamVjdCwgZGV0YWlscywgZnJvbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3JPYmplY3Quc3ByaXRlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGZvck9iamVjdC5zcHJpdGVJbWFnZSA9IHRoaXMucHJlbG9hZEltYWdlKGZyb20gKyAnLycgKyBkZXRhaWxzLm5hbWUgKyAnLXNwcml0ZS1zaGVldC5wbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy50cmFuc2Zvcm1TcHJpdGVTaGVldChmb3JPYmplY3QsIGRldGFpbHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yT2JqZWN0LnNwcml0ZUFycmF5ID0gW107XG4gICAgICAgIGZvck9iamVjdC5zcHJpdGVDb3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGV0YWlscy5pbWFnZXNUb0xvYWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RJbWFnZUNvdW50ID0gZGV0YWlscy5pbWFnZXNUb0xvYWRbaV0uY291bnQ7XG4gICAgICAgICAgICB2YXIgY29uc3RydWN0SW1hZ2VOYW1lID0gZGV0YWlscy5pbWFnZXNUb0xvYWRbaV0ubmFtZTtcbiAgICAgICAgICAgIGZvck9iamVjdC5zcHJpdGVBcnJheVtjb25zdHJ1Y3RJbWFnZU5hbWVdID1cbiAgICAgICAgICAgICAgICB7IG5hbWU6IGNvbnN0cnVjdEltYWdlTmFtZSwgY291bnQ6IGNvbnN0cnVjdEltYWdlQ291bnQsIG9mZnNldDogZm9yT2JqZWN0LnNwcml0ZUNvdW50IH07XG4gICAgICAgICAgICBmb3JPYmplY3Quc3ByaXRlQ291bnQgKz0gY29uc3RydWN0SW1hZ2VDb3VudDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmlzdWFsT2JqZWN0LnByb3RvdHlwZS50cmFuc2Zvcm1TcHJpdGVTaGVldCA9IGZ1bmN0aW9uIChmb3JPYmplY3QsIGRldGFpbHMpIHtcbiAgICAgICAgZm9yT2JqZWN0LnNwcml0ZUNhbnZhcy53aWR0aCA9IGZvck9iamVjdC5zcHJpdGVJbWFnZS53aWR0aDtcbiAgICAgICAgZm9yT2JqZWN0LnNwcml0ZUNhbnZhcy5oZWlnaHQgPSBmb3JPYmplY3Quc3ByaXRlSW1hZ2UuaGVpZ2h0ICogMjtcbiAgICAgICAgLy9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvck9iamVjdC5zcHJpdGVDYW52YXMpO1xuICAgICAgICB2YXIgc3ByaXRlQ29udGV4dCA9IGZvck9iamVjdC5zcHJpdGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KTtcbiAgICAgICAgc3ByaXRlQ29udGV4dC5kcmF3SW1hZ2UoZm9yT2JqZWN0LnNwcml0ZUltYWdlLCAwLCAwKTtcbiAgICAgICAgc3ByaXRlQ29udGV4dC5kcmF3SW1hZ2UoZm9yT2JqZWN0LnNwcml0ZUltYWdlLCAwLCBmb3JPYmplY3Quc3ByaXRlSW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgdmFyIGNvbG9yTWFwID0gW1xuICAgICAgICAgICAgLy8gZ3VuIHR1cnJldFxuICAgICAgICAgICAgeyBnZGk6IFsxOTgsIDE3MCwgOTNdLCBub2Q6IFsyMTgsIDAsIDBdIH0sXG4gICAgICAgICAgICB7IGdkaTogWzE3OCwgMTQ5LCA4MF0sIG5vZDogWzE5MSwgMjYsIDddIH0sXG4gICAgICAgICAgICB7IGdkaTogWzk3LCA3NiwgMzZdLCBub2Q6IFsxMDgsIDAsIDBdIH0sXG4gICAgICAgICAgICAvL3Bvd2VyIHBsYW50XG4gICAgICAgICAgICB7IGdkaTogWzE0NSwgMTM3LCA3Nl0sIG5vZDogWzE2OSwgMjcsIDI2XSB9LFxuICAgICAgICAgICAgeyBnZGk6IFsxMjUsIDExNywgNjRdLCBub2Q6IFsxMzMsIDM5LCAzMF0gfSxcbiAgICAgICAgICAgIHsgZ2RpOiBbMTA5LCAxMDEsIDU2XSwgbm9kOiBbMTI1LCAxLCAwXSB9LFxuICAgICAgICAgICAgeyBnZGk6IFs4OSwgODUsIDQ0XSwgbm9kOiBbOTYsIDQxLCAyNF0gfSxcbiAgICAgICAgICAgIHsgZ2RpOiBbMTcwLCAxNTMsIDg1XSwgbm9kOiBbMTkwLCAyNiwgN10gfSxcbiAgICAgICAgICAgIHsgZ2RpOiBbMTk0LCAxNzQsIDk3XSwgbm9kOiBbMjIwLCAwLCAwXSB9LFxuICAgICAgICAgICAgeyBnZGk6IFsyNDYsIDIxNCwgMTIxXSwgbm9kOiBbMjU1LCAwLCAxXSB9LFxuICAgICAgICAgICAgeyBnZGk6IFsyMjIsIDE5MCwgMTA1XSwgbm9kOiBbMjQ2LCAxLCAwXSB9LFxuICAgICAgICBdO1xuICAgICAgICB2YXIgaW1nRGF0YSA9IHNwcml0ZUNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIGZvck9iamVjdC5zcHJpdGVDYW52YXMud2lkdGgsIGZvck9iamVjdC5zcHJpdGVDYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdmFyIGltZ0RhdGFBcnJheSA9IGltZ0RhdGEuZGF0YTtcbiAgICAgICAgdmFyIHNpemUgPSBpbWdEYXRhQXJyYXkubGVuZ3RoIC8gNDtcbiAgICAgICAgZm9yICh2YXIgcCA9IHNpemUgLyAyOyBwIDwgc2l6ZTsgcCsrKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHApXG4gICAgICAgICAgICB2YXIgciA9IGltZ0RhdGFBcnJheVtwICogNF07XG4gICAgICAgICAgICB2YXIgZyA9IGltZ0RhdGFBcnJheVtwICogNCArIDFdO1xuICAgICAgICAgICAgdmFyIGIgPSBpbWdEYXRhQXJyYXlbcCAqIDQgKyAyXTtcbiAgICAgICAgICAgIHZhciBhID0gaW1nRGF0YUFycmF5W3AgKiA0ICsgMl07XG4gICAgICAgICAgICBpZiAoZGV0YWlscy50eXBlID09ICd0dXJyZXQnIHx8IGRldGFpbHMudHlwZSA9PSAnYnVpbGRpbmcnIHx8IGRldGFpbHMubmFtZSA9PSAnbWN2JyB8fCBkZXRhaWxzLm5hbWUgPT0gJ2hhcnZlc3RlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBsb25nIGNvbG9yIG1hcCBjb252ZXJ0IGVhY2ggeWVsbG93IHRvIHJlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGNvbG9yTWFwLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoMSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgPT0gY29sb3JNYXBbaV0uZ2RpWzBdICYmIGcgPT0gY29sb3JNYXBbaV0uZ2RpWzFdICYmIGIgPT0gY29sb3JNYXBbaV0uZ2RpWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdEYXRhQXJyYXlbcCAqIDQgKyAwXSA9IGNvbG9yTWFwW2ldLm5vZFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ0RhdGFBcnJheVtwICogNCArIDFdID0gY29sb3JNYXBbaV0ubm9kWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nRGF0YUFycmF5W3AgKiA0ICsgMl0gPSBjb2xvck1hcFtpXS5ub2RbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkZXRhaWxzLnR5cGUgPT0gJ3ZlaGljbGUnIHx8IGRldGFpbHMudHlwZSA9PSAnaW5mYW50cnknKSB7XG4gICAgICAgICAgICAgICAgLy8gcXVpY2sgaGFjay4gSnVzdCBtYWtlIGl0IGdyYXlzY2FsZVxuICAgICAgICAgICAgICAgIGltZ0RhdGFBcnJheVtwICogNCArIDBdID0gKHIgKyBnICsgYikgLyAzO1xuICAgICAgICAgICAgICAgIGltZ0RhdGFBcnJheVtwICogNCArIDFdID0gKHIgKyBnICsgYikgLyAzO1xuICAgICAgICAgICAgICAgIGltZ0RhdGFBcnJheVtwICogNCArIDJdID0gKHIgKyBnICsgYikgLyAzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBzaXplOyBwKyspIHtcbiAgICAgICAgICAgIHZhciByID0gaW1nRGF0YUFycmF5W3AgKiA0XTtcbiAgICAgICAgICAgIHZhciBnID0gaW1nRGF0YUFycmF5W3AgKiA0ICsgMV07XG4gICAgICAgICAgICB2YXIgYiA9IGltZ0RhdGFBcnJheVtwICogNCArIDJdO1xuICAgICAgICAgICAgdmFyIGEgPSBpbWdEYXRhQXJyYXlbcCAqIDQgKyAyXTtcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gdHJhbnNwYXJlbnQgc2hhZG93XG4gICAgICAgICAgICBpZiAoZyA9PSAyNTUgJiYgKGIgPT0gOTYgfHwgYiA9PSA4OSB8fCBiID09IDg1KSAmJiAociA9PSAwIHx8IHIgPT0gODUpKSB7XG4gICAgICAgICAgICAgICAgaW1nRGF0YUFycmF5W3AgKiA0XSA9IDA7XG4gICAgICAgICAgICAgICAgaW1nRGF0YUFycmF5W3AgKiA0ICsgMV0gPSAwO1xuICAgICAgICAgICAgICAgIGltZ0RhdGFBcnJheVtwICogNCArIDJdID0gMDtcbiAgICAgICAgICAgICAgICBpbWdEYXRhLmRhdGFbcCAqIDQgKyAzXSA9IDAuODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHNwcml0ZUNvbnRleHQucHV0SW1hZ2VEYXRhKGltZ0RhdGEsIDAsIDApO1xuICAgIH07XG4gICAgcmV0dXJuIFZpc3VhbE9iamVjdDtcbn0oKSk7XG5tb2R1bGUuZXhwb3J0cyA9IFZpc3VhbE9iamVjdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpc3VhbE9iamVjdC5qcy5tYXBcbiJdfQ==
