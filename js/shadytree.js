var ShadyTree = {

    preload : function() {        
        game.load.image('shadytree', 'assets/shady_tree.png'); 
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above) 


        var bmd = game.add.bitmapData(1440, 900);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, 1440, 900);
        bmd.ctx.fillStyle = '#000000';
        bmd.ctx.fill();
        var button = this.add.button(0, 0, 'shadytree', this.startGame, this);
        button.scale.setTo(game.width / 3507, game.height / 2550);
        if (backgroundSound)
            backgroundSound.stop();

        game.time.events.add(5000, function() {
            this.state.start('Menu');
        }, this);
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.startGame, this); 
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Menu');

    }

};