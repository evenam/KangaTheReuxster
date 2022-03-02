function placePlatform(x, y) { 
    var ground = platforms.create(x*256, -73*y + game.world.height - 73/2, 'ground');
    ground.anchor.setTo(0.5, 0.5);
    if(x%2)
        ground.scale.setTo(-1, 1);
    ground.body.immovable = true;
    ground.body.setSize(256, 73-25, 0, 25);
}
function placePlatformWithOffset(x, y, offsetX, offsetY) { 
    var ground = platforms.create(x*256+offsetX, -73*y + game.world.height - 73/2 - offsetY, 'ground');
    ground.anchor.setTo(0.5, 0.5);
    if(x%2)
        ground.scale.setTo(-1, 1);
    ground.body.immovable = true;
    ground.body.setSize(256, 73-25, 0, 25);
}

function placeWall(x, y) {    
    var ground = platforms.create(x*256+75, -255*y + game.world.height+ 73, 'vertical');
    ground.body.setSize(64, 256, 20, 0);
    ground.anchor.setTo(0.5, 0.5);
    ground.body.immovable = true;
}

function placeWallStretch(x, y, height){    
    var ground = platforms.create(x*256+75, -255*y + game.world.height+ 73 - height*73/2, 'vertical');
    ground.body.setSize(64, 256, 20, 0);
    ground.anchor.setTo(0.5, 0.5);
    ground.scale.setTo(1,height);
    ground.body.immovable = true;
}

function placeWallWithOffset(x, y, offsetX, offsetY) {    
    var ground = platforms.create(x*256+75+offsetX, -255*y + game.world.height+ 73 - offsetY, 'vertical');
    ground.body.setSize(64, 256, 20, 0);
    ground.anchor.setTo(0.5, 0.5);
    ground.body.immovable = true;
}
function addRat(x, y, minX, maxX) {
    var rat = new Rat(game, 256*x, game.world.height - 256*y, 170*minX, 170*maxX, this.rats.length);
    this.rats.push(rat);
}

function addRatWithOffset(x, y, minX, maxX, xOffset, yOffset) {
    var rat = new Rat(game, 256*x - xOffset, game.world.height - 256*y - yOffset, 170*minX, 170*maxX, this.rats.length);
    this.rats.push(rat);
}

function addTruck(x, y, bama) {
    var truck = new Truck(game, 256*x - 150, -73*y + game.world.height - 350, bama);
    this.trucks.push(truck);
}
function addReward(x, y) {
    var obj = collectables.create(256*x, game.world.height - 256*y, 'collectable');
    game.physics.arcade.enable(obj);
    obj.body.gravity.y = 100;
    obj.body.bounce.y = 1;
}
function addBacon(x, y) {
    var obj = collectableMeat.create(256*x, game.world.height - 256*y, 'meat');
    game.physics.arcade.enable(obj);
    obj.body.gravity.y = 100;
    obj.body.bounce.y = 1;
}
function addBaconWithOffset(x, y, offsetX, offsetY) {
    var obj = collectableMeat.create(256*x+offsetX, game.world.height - 256*y - offsetY, 'meat');
    game.physics.arcade.enable(obj);
    obj.body.gravity.y = 100;
    obj.body.bounce.y = 1;
}
function addRadio(x, y) {
    var obj = radio.create(256*x, game.world.height - 256*y, 'radio');
    game.physics.arcade.enable(obj);
    obj.body.gravity.y = 100;
    obj.body.bounce.y = 1;
}
function createLevel() {		
    for (var i = 0; i < (9*1600/256)+1 + 1; i++) {
        if (i < 9)
        {
            game.add.sprite(game.world.width - 350, game.world.height - 275, 'coup').sendToBack();
            game.add.sprite(game.world.width - 300, game.world.height - 175, 'helga').sendToBack();
            addTruck(55, 1, true);
            trucks[trucks.length - 1].truck.sendToBack();
        }
        if(i%3 == 0)
        {
            var board;
            if(i%2 == 0){
                board = game.add.sprite(i*256, 800, 'bama_board');
            }
            if(i%2 == 1){
                board = game.add.sprite(i*256, 800, 'beef_board');
            }
            board.sendToBack();
        }
        if(i != 3 &&
            i != 9 && i != 43 && i != 44 && i != 45 && i != 46){
            var ground = platforms.create(i*256, game.world.height - 73/2, 'ground');
            ground.anchor.setTo(0.5, 0.5);
            if(i%2)
                ground.scale.setTo(-1, 1);
            ground.body.immovable = true;
            ground.body.setSize(256, 73-25, 0, 25);
        }

    };

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 3; j++)
        {
            var x = Math.random() * 1600 + i * 1600;
            var y = Math.random() * 1200;
            
            var img = game.add.image(x, y, 'cloud' + Math.floor(Math.random() * 8) % 4, Math.random() % 4);
            img.sendToBack();
        }

    };

    placePlatform(3, 4);
    addRat(1, 1, 0, 2);
    addReward(3,2);
    addRadio(1, 1);
    placePlatform(5, 4);
    addRat(5, 1, -2, 1);
    addBacon(5, 1);
    placeWallStretch(6,1,2);
    addRat(7, 1, 0, 2);
    addReward(7,1);
    placeWallStretch(8,2,2);
    addRat(10, 1, 3, 4);
    placePlatformWithOffset(11, 0, 100, 20);
    addRat(12, 1, 0, 1);
    addReward(13,1);
    addRadio(13, 2);
    placePlatformWithOffset(13, 0, 100, 20);
    placeWallWithOffset(13,1, 135, 0);
    placeWallWithOffset(13,2, 135, 0);
    placePlatformWithOffset(13, 4, 100, 50);


    // LEVEL 3
    placePlatform(16, 4);
    placePlatform(17, 8);
    placePlatform(19, 5);
    placePlatform(20, 9);
    addRat(15, 4, 0, 2.5);
    addRat(16, 8, 0, 2.5);
    addRat(18, 5, 0, 2.5);
    addRat(19, 9, 0, 2.5);
    placeWall(21, 1);
    placePlatform(21, 4);
    placeWall(21, 3);
    placeWallWithOffset(21, 4, 0, -50);
    addRadio(21.2, 4.4);
    addReward(21.2, 1.9);

    // level 4
    addReward(24,1);
    placePlatform(24, 8);
    placeWall(25, 1);
    placePlatform(26, 4);
    placePlatform(27, 4);
    addTruck(27, 4, true);
    placePlatform(31, 4);
    placeWall(30, 1);
    placeWall(30, 3);
    placeWall(30, 4);
    addRat(26, 1, 0, 6);
    addRat(28, 1, -2, 2);

    // level 5
    addRadio(33,2);
    placePlatform(33, 4);
    placePlatform(36, 4);
    placeWallWithOffset(36, 2, -80, 0);
    placePlatform(39, 4);
    placeWallStretch(34, 1, 2);
    placeWall(38, 1);
    addBaconWithOffset(38, 1, 140, 0);
    addReward(35, 1);
    addReward(36, 1);
    addReward(37, 1);
    addRat(36, 1, -2, 2);
    addRat(35, 1, 0, 3);
    addRat(37, 1, -3, 0);
    addRatWithOffset(35, 1, -1, 2, -50, 0);
    addRatWithOffset(37, 1, -3, 2, +50, 0);

    // level 6
    placePlatform(40, 4);
    placePlatform(42, 6);
    placeWallWithOffset(44, 0, -50, 30);
    addTruck(42, 6, false);

    addTruck(48, 1, false);
    for (var i = 0; i < 2; i++) {    
        addRat(51+i, 1, 0, 2); 
        addRat(51+i, 1, 0, 3); 
        addRat(51+i, 1, 0, 1); 
    };
    

    //  A simple background for our game
    for(var i = 0; i < (9*1600)/800; i++){            
        var sky = game.add.sprite(i*800, 0, 'sky');
        sky.scale.y = 2;
        sky.sendToBack();
    }
}

