var Game = function() {
    var game = this;
    this.c = document.getElementById('canvas');
    this.ctx = this.c.getContext('2d');
    this.pixelWidth = 1.0 * this.c.width;
    this.pixelHeight = 1.0 * this.c.height;
    this.boardWidth = 32;
    this.boardHeight = 32;
    this.board = new Array();
    for (var i = 0; i < this.boardWidth; i++) {
        this.board.push(new Array(this.boardHeight));
        for (var j = 0; j < this.boardHeight; j++) {
            this.board[i][j] = '#'+Math.floor(Math.random()*16777215).toString(16); // random color
        }
    }
    var playerSprite = new Image;
    playerSprite.src = 'img/sprite01112.png';
    this.player = new Character('Player 1', playerSprite);
    this.player.x = 10;
    this.player.y = 10;
    playerSprite.onload = function() {
        $(document).keypress(game, function(e) {e.data.onKeyDown(e);});
    game.drawBoard();
    };
};

Game.prototype.onKeyDown = function(e) {
    var game = e.data;
    var key = e.keyCode || e.which;
    console.log(key);
    if (key == 87 || key == 119) { // up
        if (game.player.y > 0) {
            game.player.y -= 1;
        }
        game.drawBoard();
    } else if (key == 83 || key == 115) { // down
        if (game.player.y < game.boardHeight - 1) {
            game.player.y += 1;
        }
        game.drawBoard();
    } else if (key == 65 || key == 97) { // left
        if (game.player.x > 0) {
            game.player.x -= 1;
        }
        game.drawBoard();
    } else if (key == 68 || key == 100) { // right
        if (game.player.x < game.boardWidth - 1) {
            game.player.x += 1;
        }
        game.drawBoard();
    }
};

Game.prototype.play = function() {
};

Game.prototype.drawBoard = function() {
    for (var i = 0; i < this.boardWidth; i++) {
        for (var j = 0; j < this.boardHeight; j++) {
            this.ctx.fillStyle = this.board[i][j];
            var x = this.pixelWidth * i / this.boardWidth;
            var y = this.pixelHeight * j / this.boardHeight;
            var xstep = this.pixelWidth / this.boardWidth;
            var ystep = this.pixelHeight / this.boardHeight;
            this.ctx.fillRect(x, y, xstep, ystep);
        }
    }
    this.player.drawSprite(this);
};

var game;
$(document).ready(function() {
    game = new Game();
    game.play();
});