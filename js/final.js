var EndGame = {

    preload : function() {        
        game.load.image('final_screen', 'assets/final_screen.png'); 
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above) 


        var sky = game.add.sprite(0, 0, 'sky');
        sky.scale.y = 2;
        sky.scale.x = 100;
        var button = this.add.button(0, 0, 'final_screen', this.startGame, this);
        button.scale.setTo(game.width / 1440, game.height / 1113);
        game.sound.play('BWAAAAK');
        if (backgroundSound)
            backgroundSound.stop();
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.startGame, this); 
        game.sound.play('win_music');
    },
    startGame: function () {

        // Change the state to the actual game.
        this.state.start('ShadyTree');

    }

};