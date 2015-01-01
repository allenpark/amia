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
    var actionTaken = false;
    if (key == 87 || key == 119) { // up
        if (game.cursorY > 0 && this.board[game.cursorX][game.cursorY - 1]) {
            game.cursorY -= 1;
            actionTaken = true;
        }
    } else if (key == 83 || key == 115) { // down
        if (game.cursorY < game.boardHeight - 1 && this.board[game.cursorX][game.cursorY + 1]) {
            game.cursorY += 1;
            actionTaken = true;
        }
    } else if (key == 65 || key == 97) { // left
        if (game.cursorX > 0 && this.board[game.cursorX - 1][game.cursorY]) {
            game.cursorX -= 1;
            actionTaken = true;
        }
    } else if (key == 68 || key == 100) { // right
        if (game.cursorX < game.boardWidth - 1 && this.board[game.cursorX + 1][game.cursorY]) {
            game.cursorX += 1;
            actionTaken = true;
        }
    } else if (key == 13) { // enter
        game.players[game.playerNames[game.focusOn]].x = game.cursorX;
        game.players[game.playerNames[game.focusOn]].y = game.cursorY;
        actionTaken = true;
    } else if (key == 113) {
        game.focusOn = (game.focusOn + 1) % game.playerNames.length;
        actionTaken = true;
    } else if (key == 101) {
        var pnl = game.playerNames.length;
        game.focusOn = (game.focusOn + pnl - 1) % pnl;
        actionTaken = true;
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
};

var game;
$(document).ready(function() {
    game = new Game();
    game.play();
});