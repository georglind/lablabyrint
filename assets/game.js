// Config.
var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    },
    scene: [Scene]
};

var game = new Phaser.Game(config);
