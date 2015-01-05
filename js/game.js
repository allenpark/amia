var Game = function() {
    var game = this;
    game.c = document.getElementById('canvas');
    game.ctx = game.c.getContext('2d');
    game.pixelWidth = 1.0 * game.c.width;
    game.pixelHeight = 1.0 * game.c.height;
    game.boardWidth = 32;
    game.boardHeight = 32;
    game.viewWidth = 32;
    game.viewHeight = 32;
    game.viewX = 100;
    game.viewY = 100;
    game.board = new Array();
    for (var i = 0; i < game.boardWidth; i++) {
        game.board.push(new Array(game.boardHeight));
        for (var j = 0; j < game.boardHeight; j++) {
            game.board[i][j] = Math.random() < .8;
        }
    }
    game.cursorX = 5;
    game.cursorY = 5;
    game.cursorOn = true;
    game.playerNames = ['player1', 'player2', 'player3', 'player4'];
    game.turnNumber = 10;
    game.playersAvailable = game.playerNames.slice(0);
    game.playersDone = [];
    game.focusOn = 0;
    game.menuOn = false;
    game.menuSelect = 0;
    game.menuOptions = ['End Turn', 'Edit', 'Map Size', 'menu3'];
    var spriteNames = {'player1': 'img/sprite01112.png',
                        'player2': 'img/sword.png',
                        'player3': 'img/person.png',
                        'player4': 'img/circle.png',
                        'grass': 'img/grass.png',
                        'wall': 'img/wall.png',
                        'cursor': 'img/cursor.png',
                        'focus': 'img/focus.png',
                        'gray': 'img/gray.png'};
    game.sprites = {};
    var loadedCount = 0;
    for (var spriteName in spriteNames) {
        if (spriteNames.hasOwnProperty(spriteName)) {
            var sprite = new Image;
            sprite.src = spriteNames[spriteName];
            sprite.onload = function() {
                loadedCount ++;
                if (loadedCount == Object.keys(spriteNames).length) {
                    game.onLoadedSprites(game);
                }
            }
            game.sprites[spriteName] = sprite;
        }
    }
};

Game.prototype.playerOn = function(game, l, x, y) {
    for (pnn in l) {
        var pn = l[pnn];
        if (game.players[pn].x == x && game.players[pn].y == y) {
            return pnn;
        }
    }
    return -1;
};

Game.prototype.onLoadedSprites = function(game) {
    game.players = {};
    for (pnn in game.playerNames) {
        var pn = game.playerNames[pnn];
        game.players[pn] = new Character(pn, game.sprites[pn]);
        game.players[pn].x = pnn;
        game.players[pn].y = pnn;
    }
    $(document).keypress(game, function(e) {e.data.onKeyPress(e);});
    $('#canvas').mousedown(game, function(e) {e.data.onMouseDown(e);});
    game.drawLoop = setInterval(function() {
        game.cursorOn = !game.cursorOn;
        game.drawBoard(game);
    }, 500);
};

Game.prototype.onMouseDown = function(e) {
    var game = e.data;
    console.log(e);
};

Game.prototype.onKeyPress = function(e) {
    var game = e.data;
    var key = e.keyCode || e.which;
    if (game.menuOn) {
        game.menuAction(game, key);
        return;
    }
    console.log('Key ' + key + ' has been pressed.');
    var actionTaken = true;
    if (key == 87 || key == 119) { // W or w = up
        if (game.cursorY > 0) {
            game.cursorY -= 1;
        }
    } else if (key == 83 || key == 115) { // S or s = down
        if (game.cursorY < game.boardHeight - 1) {
            game.cursorY += 1;
        }
    } else if (key == 65 || key == 97) { // A or a = left
        if (game.cursorX > 0) {
            game.cursorX -= 1;
        }
    } else if (key == 68 || key == 100) { // D or d = right
        if (game.cursorX < game.boardWidth - 1) {
            game.cursorX += 1;
        }
    } else if (key == 13) { // enter = move or select
        var pnn = game.playerOn(game, game.playersAvailable, game.cursorX, game.cursorY);
        if (pnn == -1) {
            if (this.board[game.cursorX][game.cursorY] && game.playersAvailable.length > 0) {
                var focused = game.players[game.playersAvailable[game.focusOn]];
                focused.x = game.cursorX;
                focused.y = game.cursorY;
                var ele = game.playersAvailable.splice(game.focusOn, 1);
                game.playersDone.push(ele[0]);
                focused.moveTaken = true;
                if (game.focusOn == game.playersAvailable.length) {
                    game.focusOn --;
                }
                console.log(game.focusOn);
            }
        } else {
            game.focusOn = pnn;
        }
    } else if (key == 113) { // q = rotate left
        var pnl = game.playersAvailable.length;
        if (pnl > 0) {
            game.focusOn = (game.focusOn + 1) % pnl;
        }
    } else if (key == 101) { // e = rotate right
        var pnl = game.playersAvailable.length;
        if (pnl > 0) {
            game.focusOn = (game.focusOn + pnl - 1) % pnl;
        }
    } else if (key == 34 || key == 39) { // ' or " = menu toggle
        game.menuOn = !game.menuOn;
    } else {
        actionTaken = false;
    }
    if (actionTaken) {
        game.drawBoard(game);
    }
};

Game.prototype.menuAction = function(game, key) {
    console.log('Key ' + key + ' has been pressed on menu.');
    var actionTaken = true;
    if (key == 87 || key == 119) { // W or w = up
        var mol = game.menuOptions.length;
        game.menuSelect = (game.menuSelect + mol - 1) % mol;
    } else if (key == 83 || key == 115) { // S or s = down
        game.menuSelect = (game.menuSelect + 1) % game.menuOptions.length;
    } else if (key == 13) { // enter = move or select
        var smo = game.menuOptions[game.menuSelect];
        console.log(smo);
        if (smo == 'End Turn') {
            game.endTurn(game);
        } else if (smo == 'Edit') {
        } else if (smo == 'Map Size') {
        }
    } else if (key == 34 || key == 39) { // ' or " = menu toggle
        game.menuOn = !game.menuOn;
    } else {
        actionTaken = false;
    }
    if (actionTaken) {
        game.drawBoard(game);
    }
};

Game.prototype.endTurn = function(game) {
    game.playersAvailable = game.playerNames.slice(0);
    game.playersDone = [];
    for (pnn in game.playerNames) {
        var pn = game.playerNames[pnn];
        game.players[pn].moveTaken = false;
    }
    game.focusOn = 0;
    game.menuOn = false;
    game.turnNumber ++;
};

Game.prototype.play = function() {
};

Game.prototype.drawBoard = function(game) {
    for (var i = 0; i < game.boardWidth; i++) {
        for (var j = 0; j < game.boardHeight; j++) {
            var sprite = game.board[i][j] ? game.sprites['grass'] : game.sprites['wall'];
            var x = game.pixelWidth * i / game.boardWidth;
            var y = game.pixelHeight * j / game.boardHeight;
            game.ctx.drawImage(sprite, x, y);
        }
    }
    if (game.playersAvailable.length > 0) {
        var focused = game.players[game.playersAvailable[game.focusOn]];
        game.ctx.drawImage(game.sprites['focus'], 
            focused.x * game.pixelWidth / game.boardWidth, 
            focused.y * game.pixelHeight / game.boardHeight);
    }
    for (pnn in game.playerNames) {
        var pn = game.playerNames[pnn];
        game.players[pn].drawSprite(game);
    }
    for (pnn in game.playersDone) {
        var pn = game.playerNames[pnn];
        var p = game.players[pn];
        game.ctx.drawImage(game.sprites['gray'],
            p.x * game.pixelWidth / game.boardWidth,
            p.y * game.pixelHeight / game.boardHeight);
    }
    if (game.cursorOn) {
        game.ctx.drawImage(game.sprites['cursor'], game.cursorX * game.pixelWidth / game.boardWidth, game.cursorY * game.pixelHeight / game.boardHeight);
    }
    if (game.menuOn) {
        var menuWidth = 90;
        var menuXBuffer = 10;
        var menuYBuffer = 10;
        game.ctx.beginPath();
        game.ctx.fillStyle = 'white';
        game.ctx.fillRect(game.pixelWidth - menuWidth - menuXBuffer,
            menuYBuffer,
            menuWidth,
            game.pixelHeight - menuYBuffer * 2);
        game.ctx.beginPath();
        game.ctx.lineWidth = '8';
        game.ctx.strokeStyle = 'red';
        game.ctx.rect(game.pixelWidth - menuWidth - menuXBuffer,
            menuYBuffer,
            menuWidth,
            game.pixelHeight - menuYBuffer * 2);
        game.ctx.stroke();
        game.ctx.beginPath();
        game.ctx.font = '18px Times New Roman';
        game.ctx.fillStyle = 'black';
        game.ctx.fillText('Turn ' + game.turnNumber,
            game.pixelWidth - menuWidth - menuXBuffer + 15,
            menuYBuffer + 25);
        for (mon in game.menuOptions) {
            var mo = game.menuOptions[mon];
            game.ctx.fillText(mo, 
                game.pixelWidth - menuWidth - menuXBuffer + 11,
                menuYBuffer + 25 + (parseInt(mon) + 1) * 25);
        }
        game.ctx.beginPath();
        game.ctx.lineWidth = '2';
        game.ctx.strokeStyle = 'black';
        game.ctx.rect(game.pixelWidth - menuWidth - menuXBuffer + 6,
            menuYBuffer + 33 + game.menuSelect * 25,
            menuWidth - 12,
            23);
        game.ctx.stroke();
    }
};

var game;
$(document).ready(function() {
    game = new Game();
    game.play();
});