var Character = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.moveTaken = false;
};

Character.prototype.drawSprite = function(game) {
    game.ctx.drawImage(this.sprite, this.x * game.pixelWidth / game.boardWidth, this.y * game.pixelHeight / game.boardHeight);
};