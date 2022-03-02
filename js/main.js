var game;

game = new Phaser.Game(1280, 800, Phaser.CANVAS, '');

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);
game.state.add('BeginGame', BeginGame);
game.state.add('EndGame', EndGame);
game.state.add('ShadyTree', ShadyTree);

game.state.start('ShadyTree');