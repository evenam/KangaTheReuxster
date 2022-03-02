function Truck(game, initX, initY, bama) {
	if(bama == true)
		this.truck = game.add.sprite(initX, initY, 'truck');
	else
		this.truck = game.add.sprite(initX, initY, 'truck0'); // Do the LSU truck
    this.truck.animations.add('roll', [0, 1], 8, true);
    game.physics.arcade.enable(this.truck);
    this.truck.enableBody = true;
    this.truck.body.setSize(512, 302-100, 0, 100);
    this.truck.body.gravity.y = 400;
    this.sound = game.add.audio('vehicle_vroom');

	this.update = function() {
		if(this.truck.body.velocity.x != 0) {
            if(this.truck.body.velocity.x > 0){
                this.truck.body.velocity.x -= 3;
                if(this.truck.body.velocity.x < 0)
                    this.truck.body.velocity.x = 0;
            }
            if(this.truck.body.velocity.x < 0){
                this.truck.body.velocity.x += 3;
                if(this.truck.body.velocity.x > 0)
                    this.truck.body.velocity.x = 0;
            }
            this.truck.animations.play('roll');
            if (!this.sound.isPlaying)
            {
                this.sound.play();
            }
        }
        else
            this.truck.animations.stop()
	};
};