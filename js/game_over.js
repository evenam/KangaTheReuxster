var GameOver = {

    preload : function() {        
        game.load.image('died_screen', 'assets/died_screen.png'); 
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above) 


        var bmd = game.add.bitmapData(1440, 900);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, 1440, 900);
        bmd.ctx.fillStyle = '#000000';
        bmd.ctx.fill();
        var button = this.add.button(0, 0, 'died_screen', this.startGame, this);
        button.scale.setTo(game.width / 1440, game.height / 1113);
        game.sound.play('game_over_bok');
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.startGame, this); 
        if (backgroundSound)
            backgroundSound.stop();
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Menu');

    }

};