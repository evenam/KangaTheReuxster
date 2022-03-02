function Rat(game, initX, initY, leftX, rightX, index) {
	// state 0: wandering - normal
	// state 1: alert - normal but indication to player that the enemy is aware of presence
	// state 2: chase - player sighted, full speed run
	// state 3: dead - motionless, dead rat. Disappears after a few seconds
	// state 4: scared - running away form scared point for a second
	this.state = 0;
	this.runningLeft = false;
	this.rat = game.add.sprite(initX, initY, 'rat');
	this.rat.index = index;

	this.rat.enableBody = true;
    game.physics.arcade.enable(this.rat);
    this.rat.body.gravity.y = 800;
    this.rat.anchor.setTo(0.5, 0.5);
    this.warn0 = game.add.image(initX, initY - 100, 'warn0'); // alert
    this.warn1 = game.add.image(initX, initY - 100, 'warn1'); // chase
    this.warn2 = game.add.image(initX, initY - 100, 'warn2'); // scared
    this.warn3 = game.add.image(initX, initY - 100, 'warn3'); // listen

	this.listened = false;
	this.listenedDirection = 0;

	this.constSightlineDistance = 120.0;
	this.constDetectionHeight = 150.0;
	this.constDetectionWidth = 300.0;

	this.maxRightX = rightX + initX;
	this.minLeftX = leftX + initX;

	this.scared = false;
	this.scaredPoint = 0;

	this.update = function(player, meat) {
		if(this.state != 3 && this.rat.body && (this.rat.body.y > game.world.height)){
			this.kill(this.rat, null);
			this.state = 3;
			return;
		}
		if (!this.rat.body) 
		{
			this.warn0.visible = false;
			this.warn1.visible = false;
			return;
		}

		this.warn0.x = this.rat.body.center.x - this.warn0.width / 2
		this.warn1.x = this.rat.body.center.x - this.warn1.width / 2;
		this.warn0.y = this.rat.body.center.y - 100;
		this.warn1.y = this.rat.body.center.y - 100;
		this.warn2.x = this.rat.body.center.x - this.warn2.width / 2
		this.warn3.x = this.rat.body.center.x - this.warn3.width / 2;
		this.warn2.y = this.rat.body.center.y - 100;
		this.warn3.y = this.rat.body.center.y - 100;
		if (this.state == 0 || this.state == 6) // nothing
		{
			this.warn0.visible = false;
			this.warn1.visible = false;
			this.warn2.visible = false;
			this.warn3.visible = false;
		}

		if (this.state == 1){ // alert
			this.warn0.visible = true;
			this.warn1.visible = false;
			this.warn2.visible = false;
			this.warn3.visible = false;
		}
		if (this.state == 2){ // chase
			this.warn0.visible = false;
			this.warn1.visible = true;
			this.warn2.visible = false;
			this.warn3.visible = false;
		}
		if (this.state == 4){ // scared
			this.warn3.visible = false;
			this.warn2.visible = true;
			this.warn1.visible = false;
			this.warn0.visible = false;
		}
		if (this.state == 5){ // listen
			this.warn3.visible = true;
			this.warn2.visible = false;
			this.warn1.visible = false;
			this.warn0.visible = false;
		}

		if (this.state == 4 && this.scared) // scared :O
		{
			this.updateScared();
			return;
		}
		else if (this.state == 5 && this.listened) // listning
		{
			this.updateListen();
			if ((this.isInSightLine(player) || this.pointDistance(player) < 75.0) || (this.isInSightLine(player) || this.pointDistance(player) < 75.0))
				state = 2;
			return;
		}
		else if (this.state == 6 && this.listened) 
			this.updateListen();

		if(this.rat.body.velocity.x > 0)
			this.rat.scale.setTo(1, 1);
		if(this.rat.body.velocity.x < 0)
			this.rat.scale.setTo(-1, 1);
		var notState = this.state;
		if (this.isInSightLine(player) || this.pointDistance(player) < 75.0)
		{
			if (this.state != 2)
        		game.sound.play('rat_hiss');
			this.state = 2;
			this.updateChase(player);
		}
		else if (this.isInSightLine(meat) || this.pointDistance(meat) < 75.0)
		{
			if (this.state != 2)
        		game.sound.play('rat_hiss');
			this.state = 2;
			this.updateChase(meat);
		}
		else if (this.isInDetectionBox(player) || this.isInDetectionBox(meat))
		{
			this.state = 1;
			this.updateAlert();
		}
		else
		{
			this.state = 0;
			this.updateNormal();
		}
	};

	this.updateNormal = function() {
		if (this.rat.body.x < this.minLeftX && this.runningLeft)
		{
			this.runningLeft = false;
		}

		if (this.rat.body.x + this.rat.body.width > this.maxRightX && !this.runningLeft)
		{
			this.runningLeft = true;
		}
		if(this.runningLeft)
		{
			this.rat.body.velocity.x = -2*60;
		}
		else 
		{
			this.rat.body.velocity.x = 2*60;
		}
	}; 

	this.updateAlert = function() {
		if (this.rat.body.x < this.minLeftX && this.runningLeft)
		{
			this.runningLeft = false;
		}

		if (this.rat.body.x > this.maxRightX && !this.runningLeft)
		{
			this.runningLeft = true;
		}
		if(this.runningLeft)
		{
			this.rat.body.velocity.x = -4*60;
		}
		else 
		{
			this.rat.body.velocity.x = 4*60;
		}
	};

	this.updateChase = function(chasingObject) {
		if (this.pointDistance(chasingObject) < 50)
		{
			this.rat.body.velocity.x = 0;
			return;
		}
		if (chasingObject.body.center.x < this.rat.body.center.x)
		{
			this.runningLeft = true;
		}
		else if (chasingObject.body.center.x> this.rat.body.center.x)
		{
			this.runningLeft = false;
		}
		if(this.runningLeft)
		{
			this.rat.body.velocity.x = -5*60;
		}
		else 
		{
			this.rat.body.velocity.x = 5*60;
		}
	};

	this.kill = function(rat, truck) {
		var spr = game.add.sprite(rat.body.x, rat.body.y, 'dead_mouse');
		rat.destroy();
		game.time.events.add(3000, function() {
			spr.destroy();
		}, null);
		ratKills++;

		rats[rat.index].warn0.visible = false;
		rats[rat.index].warn1.visible = false;
		rats[rat.index].warn2.visible = false;
		rats[rat.index].warn3.visible = false;

		game.sound.play('rat_death');
	};

	this.isInSightLine = function(testObject)
	{
		if (testObject === undefined) return false;
		var rect1 = new Phaser.Rectangle(testObject.body.x, testObject.body.y, testObject.body.width, testObject.body.height);
		var rect2 = new Phaser.Rectangle(this.rat.body.center.x + (this.constSightlineDistance * (this.rat.scale.x == 1? 0: -1)), this.rat.body.center.y, this.constSightlineDistance, 1);
		
		return (Phaser.Rectangle.intersects(rect1, rect2));
	};

	this.isInDetectionBox = function(testObject)
	{
		if (testObject === undefined) return false;
		var rect1 = new Phaser.Rectangle(testObject.body.x, testObject.body.y, testObject.body.width, testObject.body.height);
		var rect2 = new Phaser.Rectangle(this.rat.body.x + this.rat.body.width / 2 - this.constDetectionWidth / 2, this.rat.body.y + this.rat.body.height / 2 - this.constDetectionHeight / 2, this.constDetectionWidth, this.constDetectionHeight);
		
		return (Phaser.Rectangle.intersects(rect1, rect2));
	};

	this.pointDistance = function(testObject)
	{
		if (!testObject) return 99999;
		var otherx = testObject.body.center.x, othery = testObject.body.center.y;
		var myx = this.rat.body.center.x, myy = this.rat.body.center.y;
		return Math.sqrt(Math.pow(otherx - myx, 2) + Math.pow(othery - myy, 2));
	},

	this.scare = function(point)
	{
		this.scaredPoint = point;
		this.scared = true;
		this.state = 4;
		this.rat.body.velocity.y = -300;
		game.time.events.add(800, function() {
			this.state = 1;
			this.scaredPoint = 0;
			this.scared = false;
		}, this);
		game.time.events.add(1200, function() {
        	game.sound.play('rat_squeal');
    	}, this);
	},

	this.listen = function(point)
	{
		if (this.state != 4)
		{
			this.listenedDirection = (this.rat.body.center.x < point) ? 1 : -1;
			this.listened = true;
			this.state = 5;
			game.time.events.add(2500, function() {
				this.state = 1;
				this.listenedPoint = 0;
				this.listened = false;
			}, this);
		}
	},

	this.walkItOut = function(point)
	{
		if (this.state != 4 && this.state != 5)
		{
			this.listenedDirection = (this.rat.body.center.x < point) ? 1 : -1;
			this.listened = true;
			this.state = 6;
			game.time.events.add(2000, function() {
				this.state = 1;
				this.listenedPoint = 0;
				this.listened = false;
			}, this);
		}
	},

	this.updateListen = function()
	{
		this.rat.scale.setTo(this.listenedDirection, 1);
		this.rat.body.velocity.x = this.listenedDirection * 60 * 3;

		if (this.rat.body.x < this.minLeftX - 500)
		{
			this.listenedDirection = 1;
		}

		if (this.rat.body.x + this.rat.body.width > this.maxRightX + 500)
		{
			this.listenedDirection = -1;
		}
	},

	this.updateWalkItOut = function()
	{
		this.rat.scale.setTo(this.listenedDirection, 1);
		this.rat.body.velocity.x = this.listenedDirection * 60 * 3;

		if (this.rat.body.x < this.minLeftX)
		{
			this.listenedDirection = 1;
		}

		if (this.rat.body.x + this.rat.body.width > this.maxRightX)
		{
			this.listenedDirection = -1;
		}
	},

	this.updateScared = function()
	{
		var direction = 1;
		if (this.rat.body.center.x > this.scaredPoint)
			direction = 1;
		else
			direction = -1;
		this.rat.scale.setTo(-direction, 1);
		this.rat.body.velocity.x = direction * 60 * 6;
	}
};