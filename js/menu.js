var Menu = {

    preload : function() {        
        game.load.image('menu', './assets/menu.png');
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/road_platform.png');
        game.load.image('life', 'assets/life.png');
        game.load.image('radio', 'assets/remote.png');
        game.load.image('rat', 'assets/rat.png');
        game.load.image('meat', 'assets/bacon.png');
        game.load.spritesheet('eggs', 'assets/egg_drop_strip.png', 200, 86);
        game.load.spritesheet('chikn', 'assets/kanga_reauxster_strip6.png', 125, 128, 6);
        game.load.spritesheet('truck', 'assets/bama_truck_strip_funny.png', 512, 302);
        game.load.spritesheet('truck0', 'assets/lsu_truck_strip_funny.png', 512, 302);
        game.load.image('road', 'assets/road.png');
        game.load.spritesheet('bok', 'assets/BWAAAAK_strip2.png', 150, 138);
        game.load.image('warn0', 'assets/warn1.png');
        game.load.image('warn1', 'assets/warn2.png');
        game.load.image('warn2', 'assets/scared.png');
        game.load.image('warn3', 'assets/listen.png');
        game.load.image('helga', 'assets/helga.png');
        game.load.image('target', 'assets/target.png');
        game.load.image('dead_mouse', 'assets/dead_mouse.png');
        game.load.image('bama_board', 'assets/beat_bama_bilboard.png');
        game.load.image('beef_board', 'assets/beef_filet_bilboard.png');
        game.load.image('cloud0', 'assets/cloud1.png');
        game.load.image('cloud1', 'assets/cloud2.png');
        game.load.image('cloud2', 'assets/cloud3.png');
        game.load.image('cloud3', 'assets/cloud4.png');
        game.load.image('vertical', 'assets/vertical.png');
        game.load.image('collectable', 'assets/collectable.png');
        game.load.image('coup', 'assets/coup.png');
        game.load.audio('jump', 'assets/jump.wav');
        //game.load.audio('land', 'assets/land.wav');
        game.load.audio('bacon_throw', 'assets/bacon_throw.wav');
        game.load.audio('bacon', 'assets/bacon.wav');
        game.load.audio('BWAAAAK', 'assets/BWAAAAK.wav');
        game.load.audio('collect', 'assets/collect.wav');
        game.load.audio('call_in', 'assets/call_in.wav');
        game.load.audio('egg_drop', 'assets/egg_drop.wav');
        game.load.audio('egg_splode', 'assets/egg_splode.wav');
        game.load.audio('game_over_bok', 'assets/game_over_bok.wav');
        game.load.audio('hurt', 'assets/hurt.wav');
        game.load.audio('rat_death', 'assets/rat_death.wav');
        game.load.audio('rat_hiss', 'assets/rat_hiss.wav');
        game.load.audio('rat_squeal', 'assets/rat_squeal.wav');
        game.load.audio('target_aquired', 'assets/target_aquired.wav');
        game.load.audio('vehicle_vroom', 'assets/vehicle_vroom.wav');
        game.load.audio('music', 'assets/kanga.wav');
        game.load.audio('win_music', 'assets/win_music.wav');
        game.load.image('kanga_hurt', 'assets/kanga_reauxster_hurt.png');

        
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above) 

        var button = this.add.button(0, 0, 'menu', this.startGame, this);
        button.scale.setTo(game.width / 800, game.height / 600);
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.startGame, this); 
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('BeginGame');
        game.sound.play('BWAAAAK');

    }

};