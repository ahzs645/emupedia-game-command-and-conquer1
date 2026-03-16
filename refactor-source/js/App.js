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
//# sourceMappingURL=App.js.map