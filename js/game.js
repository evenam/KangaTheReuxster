var platforms;
var radio, hasRadio, radioStock;
var meat, throwing, meatStock;
var lifeStock;
var bama_truck;
var boks;
var target;
var egg;
var eggLoc;
var strikeMode;
var canBok;
var rats = [];
var trucks = [];
var collectables;
var collectableMeat;
var collected;
var ratKills;
var scoreText;
var knockBack;
var backgroundSound;
var playerFlash;

var keyZ;
var keyX;
var keyC;
var Game = {
    preload: function() {
    },

    create: function() {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.OVERLAP_BIAS = 8;
        game.world.setBounds(0, 0, 9*1600, 1200);

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        meat = game.add.group();
        boks = game.add.group();
        radioStock = game.add.group();
        collectables = game.add.group();
        collectableMeat = game.add.group();
        radio = game.add.group();

        rats = [];
        trucks = [];

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        meat.enableBody = true;

        // Here we create the ground.
        createLevel();
        egg = 0;
        strikeMode = 0;
        eggLoc = 0;
        canBok = true;
        collected = 0;
        ratKills = 0;
        knockBack = false;

        var drawnObject;
        var width = 270 // example;
        var height = 70 // example;
        var bmd = game.add.bitmapData(width, height);
         
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = '#4444EE';
        bmd.ctx.fill();
        bmd.ctx.strokeStyle = "#EEEEFF";
        bmd.ctx.lineWidth = 4;
        bmd.ctx.stroke();
        drawnObject = game.add.sprite(510, 10, bmd);
        drawnObject.fixedToCamera = true;
        drawnObject.alpha = 0.4;
        backgroundSound = game.add.audio('music');
        backgroundSound.volume = 0.4;
        backgroundSound.play();

        scoreText = game.add.text(550, 20, "Score: 0", { font: "40px Arial Black", fill: "#EEEEEE", align: "right"});
        scoreText.fixedToCamera = true;

        player = game.add.sprite(100 + 0*1600, game.world.centerY, 'chikn');
        //player.scale.set(0.5, 0.5);
        player.animations.add('right', [0,1,2,3], 10, true);
        player.animations.add('jump', [4], 10, true);

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(meat);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.0;
        player.body.gravity.y = 800;
        //player.body.collideWorldBounds = true;
        player.body.setSize(125-40, 128-60, 40/2, 60/2);
        player.anchor.setTo(0.5, 0.5);

        //  Our two animations, walking left and right.
        cursors = game.input.keyboard.createCursorKeys();

        throwing = false;

        game.camera.follow(player);

        meatStock = game.add.group(); 
        meatStock.scale.set(0.7, 0.7);
        for (var i = 0; i < 3; i++) {
            meatStock.create(20 + i*60, 86, 'meat');     
        };
        meatStock.fixedToCamera = true;

        lifeStock = game.add.group();
        for (var i = 0; i < 3; i++) {
            lifeStock.create(10 + i*40, 10, 'life'); 
        };
        lifeStock.fixedToCamera = true;

        keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        keyZ.onDown.add(this.throwMeat, this);
        keyX = game.input.keyboard.addKey(Phaser.Keyboard.X);
        keyX.onDown.add(this.bok, this);
        keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
        keyC.onDown.add(this.setTarget, this);  
        var escape = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escape.onDown.add(function() {this.state.start('Menu'); backgroundSound.stop();}, this);        

        for (var i = trucks.length - 1; i >= 0; i--) {
            trucks[i].truck.bringToTop();
        };

    },

    update: function() {        
        //game.camera.setPosition((player.body.x + player.body.width/2)-400, (player.body.y + player.body.height/2)-300);
        //  Collide the player and the stars with the platformsA
        scoreText.setText("Score: " + (collected + ratKills*2));
        for (var i = trucks.length - 1; i >= 0; i--) {
            trucks[i].update(player, meat.getTop());
            game.physics.arcade.collide(trucks[i].truck, platforms);
            game.physics.arcade.collide(trucks[i].truck, player); 
            game.physics.arcade.collide(trucks[i].truck, meat, this.onStrike);
        };

        //rat.update(player, meat.getTop());
        game.physics.arcade.overlap(player, collectables, this.collectReward, null, this);
        game.physics.arcade.overlap(player, collectableMeat, this.collectBacon, null, this);
        game.physics.arcade.overlap(player, radio, this.collectRadio, null, this);
        game.physics.arcade.collide(collectables, platforms);
        game.physics.arcade.collide(radio, platforms);
        game.physics.arcade.collide(collectableMeat, platforms);
        game.physics.arcade.collide(player, platforms);
        if (target && target.body)
            game.physics.arcade.collide(target, platforms);

        for (var i = rats.length - 1; i >= 0; i--) {
            rats[i].update(player, meat.getTop());
            game.physics.arcade.collide(rats[i].rat, platforms);
            if(!knockBack)
                game.physics.arcade.overlap(rats[i].rat, player, this.playerHit);
        };


        game.physics.arcade.collide(meat, platforms, this.onStrike);

        for (var i = rats.length - 1; i >= 0; i--) {
            game.physics.arcade.overlap(meat, rats[i].rat, this.eatMeat, null, this);
            for (var j = trucks.length - 1; j >= 0; j--){
                if(trucks[j].truck.body.velocity.x != 0 || Math.abs(trucks[j].truck.body.velocity.y) < 1)
                    game.physics.arcade.overlap(rats[i].rat, trucks[j].truck, rats[i].kill, null, this);
            } 
        };

        //  Reset the players velocity (movement)
        if(knockBack == false){
            player.body.velocity.x = 0;
        }

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -250;

            player.animations.play('right');
            player.scale.setTo(-1, 1);
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 250;

            player.animations.play('right');
            player.scale.setTo(1, 1);
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 0;
        }

        //if (knockBack)
        //    player.animations.play('knockback', [0], 10, true);

        if(player.body.y + player.body.height > game.world.height)
            game.state.start('GameOver');
        if(player.body.x > game.world.width - 300)
            game.state.start("EndGame");
        if(player.body.x <= 0){
            player.body.x++;
            player.body.velocity.x = 0;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -750;
            game.sound.play('jump');
        }

        if(!player.body.touching.down){
            player.animations.stop();
            player.frame = 4;
        }

        if(strikeMode == 2){
            game.physics.arcade.overlap(target, egg, this.explodeEgg, null, this);
        }

        if (!backgroundSound.isPlaying)
        {
            backgroundSound.play();
        }
    },

    throwMeat: function() {
        if(throwing === false && meatStock.getTop()){
            throwing = true;
            var obj = meat.create(player.body.x+player.body.width/2-32, player.body.y, 'meat');
            obj.body.velocity.x = player.body.velocity.x*1.5;
            obj.body.velocity.y = (player.body.velocity.y >= 0) ? (-200) : (player.body.velocity.y - 50);
            obj.body.gravity.y = 400;
            //meat.body.collideWorldBounds = true;
            obj.body.bounce.x = 0.5;
            obj.timerInstance = undefined;
            obj.meatState = 0;
            meatStock.remove(meatStock.getTop(), true);
            game.sound.play('bacon_throw');
        }
    },

    onStrike: function(obj, platform) {
        if(obj.body.touching.down){
            obj.body.velocity.x = 0;
            obj.body.velocity.y = 0;
            obj.body.immovable = true;
            obj.body.gravity.y = 0;
            obj.enableBody = false;
            throwing = false;
            game.sound.play('bacon');

            obj.timerInstance = game.time.events.add(30000, function(){
                obj.destroy();
            }, this);
        }
    },

    collectRadio: function(player, radio) {
        radio.destroy();
        var obj = radioStock.create(20 + 60*(radioStock.countLiving()), 108, 'radio');
        radioStock.fixedToCamera = true;
        game.sound.play('collect');
    },
    collectReward: function(player, reward) {
        reward.destroy();
        collected += 1;
        game.sound.play('collect');
    },
    collectBacon: function(player, meat){
        meat.destroy();
        meatStock.create(20+ (meatStock.countLiving())*60, 86, 'meat');
        game.sound.play('collect');
    },
    playerHit: function(rat, player){
        if(knockBack == false){
            if(lifeStock.getTop()){

                knockBack = true;
                //Player gets knocked back
                if(player.body.x + player.body.width/2 <= rat.body.x + rat.body.width/2)
                    player.body.velocity.x = -200;
                if(player.body.x + player.body.width/2 > rat.body.x + rat.body.width/2)
                    player.body.velocity.x = 200;
                rats[rat.index].walkItOut(rat.body.x - player.body.velocity.x);
                rat.body.velocity.x = -1*player.body.velocity.x;
                player.body.velocity.y = -500;//-10*(rat.body.y - player.body.y);

                lifeStock.remove(lifeStock.getTop(), true);
                if(!lifeStock.getTop())
                {
                    game.state.start('GameOver');
                    return;
                }

                game.time.events.add(200, function() {
                    player.alpha = 0;
                }, null);
                game.time.events.add(400, function() {
                    player.alpha = 1;
                }, null);
                game.time.events.add(600, function() {
                    player.alpha = 0;
                }, null);
                game.time.events.add(800, function() {
                    player.alpha = 1;
                }, null);
                game.time.events.add(1000, function() {
                    player.alpha = 0;
                }, null);
                game.time.events.add(1200, function() {
                    player.alpha = 1;
                }, null);
                game.time.events.add(1400, function() {
                    player.alpha = 0;
                }, null);
                game.time.events.add(1600, function() {
                    player.alpha = 1;
                }, null);
                game.time.events.add(1800, function() {
                    player.alpha = 0;
                }, null);
                game.time.events.add(2000, function() {
                    player.alpha = 1;
                }, null);
                game.time.events.add(2000, function(){
                    knockBack = false;
                },this);
                game.sound.play('hurt');
            }
            
        }
    },
    bok: function() {
        if (!canBok) return;
        canBok = false;
        var bok = boks.create(player.x + player.width, player.y-28, 'bok');
        bok.animations.add('bokAnim', [0,1], 10, true);
        bok.animations.play('bokAnim');
        game.sound.play('BWAAAAK');
        bok.anchor.setTo(0.5, 0.5);
        bok.scale.setTo(player.scale.x*-1, 1);
        game.time.events.add(500, function() {
            game.add.tween(bok).to({alpha: 0}, 250, Phaser.Easing.Linear.None, true, 0);
        }, this);
        game.time.events.add(1500, function() {
            canBok = true;
        }, this);
        for (var i = rats.length - 1; i >= 0; i--) {
            if (rats[i].pointDistance(player) < 220)
                rats[i].scare(player.body.center.x);
            else if (rats[i].pointDistance(player) < 1200)
            {
                rats[i].listen(player.body.center.x);
            }
        };
    },
    setTarget: function() {
        if (strikeMode == 0 && radioStock.getTop())
        {
            if(player.scale.x == 1)
            {
                eggLoc = player.body.center.x  - 100;
                target = game.add.sprite(player.body.center.x - 55, player.y+30, 'target');
            }
            if(player.scale.x == -1)
            {
                eggLoc = player.body.center.x  - 100;
                target = game.add.sprite(player.body.center.x - 90, player.y+30, 'target');
            }
            strikeMode = 1;
            game.physics.arcade.enable(target);
            target.body.setSize(target.body.width, target.body.height - 30, 0, 0);
            target.body.gravity.y = 1200;
            radioStock.remove(radioStock.getTop(), true);
            game.sound.play('target_aquired');
        }
        else if (strikeMode == 1)
        {
            strikeMode = 2;
            egg = game.add.sprite(eggLoc, -100, 'eggs');
            game.physics.arcade.enable(egg);
            egg.body.gravity.y = 1200;
            egg.body.enable = true;
            game.sound.play('call_in');
            game.sound.play('egg_drop');
        }
    },

    explodeEgg: function() {
        var position = { x: egg.body.x, y: egg.body.y + 40};
        egg.destroy();
        target.destroy();
        var explosion = game.add.sprite(position.x, position.y, 'eggs');
        game.time.events.add(3000, function() { explosion.destroy(); }, this);
        var anim = explosion.animations.add('eggSplode', [0, 1, 2, 3, 4], 10, false);
        explosion.animations.play('eggSplode');
        game.physics.arcade.enable(explosion);
        game.sound.play('egg_splode');
        for (var i = rats.length - 1; i >= 0; i--) {
            game.physics.arcade.overlap(rats[i].rat, explosion, rats[i].kill, null, this);
        };
        // add player kill
        explosion.body.destroy();
        anim.onComlete = function() {
            explosion.destroy();
        };
        strikeMode = 0;
    },

    eatMeat: function(theRat, theMeat) 
    {
        if (theMeat.meatState != 0) return;
        theMeat.meatState = 1;
        if (theMeat.timerInstance === undefined)
        {
            theMeat.timerInstance = game.time.events.add(5000, function() {
                theMeat.meatState = 0;
                theMeat.destroy();
            }, this);
        }
        else
        {
            theMeat.timerInstance.delay = 5000;
        }
        theMeat.meatState = true;
        game.sound.play('rat_hiss');
    }
};