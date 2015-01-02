var Game = function() {
    var game = this;
    game.c = document.getElementById('canvas');
    game.ctx = game.c.getContext('2d');
    game.pixelWidth = 1.0 * game.c.width;
    game.pixelHeight = 1.0 * game.c.height;
    game.boardWidth = 32;
    game.boardHeight = 32;
    game.board = new Array();
    for (var i = 0; i < game.boardWidth; i++) {
        game.board.push(new Array(game.boardHeight));
        for (var j = 0; j < game.boardHeight; j++) {
            //game.board[i][j] = '#'+Math.floor(Math.random()*16777215).toString(16); // random color
            game.board[i][j] = Math.random() < .8;
        }
    }
    game.cursorX = 5;
    game.cursorY = 5;
    game.cursorOn = true;
    game.playerNames = ['player1', 'player2', 'player3', 'player4'];
    game.focusOn = 0;
    game.menuOn = false;
    game.menuSelect = 0;
    game.menuOptions = ['menu0', 'menu1', 'menu2', 'menu3'];
    var spriteNames = {'player1': 'img/sprite01112.png',
                        'player2': 'img/sword.png',
                        'player3': 'img/person.png',
                        'player4': 'img/circle.png',
                        'grass': 'img/grass.png',
                        'wall': 'img/wall.png',
                        'cursor': 'img/cursor.png',
                        'focus': 'img/focus.png'};
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

Game.prototype.playerOn = function(game, x, y) {
    for (pnn in game.playerNames) {
        var pn = game.playerNames[pnn];
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
    console.log('Key ' + key + ' has been pressed.');
    var actionTaken = true;
    if (key == 87 || key == 119) { // W or w = up
        if (game.menuOn) {
            var mol = game.menuOptions.length;
            game.menuSelect = (game.menuSelect + mol - 1) % mol;
        } else {
            if (game.cursorY > 0 && this.board[game.cursorX][game.cursorY - 1]) {
                game.cursorY -= 1;
            }
        }
    } else if (key == 83 || key == 115) { // S or s = down
        if (game.menuOn) {
            game.menuSelect = (game.menuSelect + 1) % game.menuOptions.length;
        } else {
            if (game.cursorY < game.boardHeight - 1 && this.board[game.cursorX][game.cursorY + 1]) {
                game.cursorY += 1;
            }
        }
    } else if (key == 65 || key == 97) { // A or a = left
        if (game.cursorX > 0 && this.board[game.cursorX - 1][game.cursorY]) {
            game.cursorX -= 1;
        }
    } else if (key == 68 || key == 100) { // D or d = right
        if (game.cursorX < game.boardWidth - 1 && this.board[game.cursorX + 1][game.cursorY]) {
            game.cursorX += 1;
        }
    } else if (key == 13) { // enter = move or select
        var pnn = game.playerOn(game, game.cursorX, game.cursorY);
        if (pnn == -1) {
            var focused = game.players[game.playerNames[game.focusOn]];
            focused.x = game.cursorX;
            focused.y = game.cursorY;
        } else {
            game.focusOn = pnn;
        }
    } else if (key == 113) { // q = rotate left
        game.focusOn = (game.focusOn + 1) % game.playerNames.length;
    } else if (key == 101) { // e = rotate right
        var pnl = game.playerNames.length;
        game.focusOn = (game.focusOn + pnl - 1) % pnl;
    } else if (key == 34 || key == 39) { // ' or " = menu toggle
        game.menuOn = !game.menuOn;
    } else {
        actionTaken = false;
    }
    if (actionTaken) {
        game.drawBoard(game);
    }
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
    var focused = game.players[game.playerNames[game.focusOn]];
    game.ctx.drawImage(game.sprites['focus'], 
        focused.x * game.pixelWidth / game.boardWidth, 
        focused.y * game.pixelHeight / game.boardHeight);
    for (pnn in game.playerNames) {
        var pn = game.playerNames[pnn];
        game.players[pn].drawSprite(game);
    }
    if (game.cursorOn) {
        game.ctx.drawImage(game.sprites['cursor'], game.cursorX * game.pixelWidth / game.boardWidth, game.cursorY * game.pixelHeight / game.boardHeight);
    }
    if (game.menuOn) {
        var menuWidth = 80;
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
        for (mon in game.menuOptions) {
            var mo = game.menuOptions[mon];
            game.ctx.font = '18px Times New Roman';
            game.ctx.fillStyle = 'black';
            game.ctx.fillText(mo, 
                game.pixelWidth - menuWidth - menuXBuffer + 13,
                menuYBuffer + 25 + mon * 25);
        }
        game.ctx.beginPath();
        game.ctx.lineWidth = '2';
        game.ctx.strokeStyle = 'black';
        game.ctx.rect(game.pixelWidth - menuWidth - menuXBuffer + 8,
            menuYBuffer + 8 + game.menuSelect * 25,
            64,
            23);
        game.ctx.stroke();
    }
};

var game;
$(document).ready(function() {
    game = new Game();
    game.play();
});