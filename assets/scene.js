class Scene extends Phaser.Scene {

  constructor() {
    // Key scene
    super({key: "Scene"});
  }

  preload() {
    // Preload resources.
    this.load.tilemapTiledJSON("map", "assets/tilemap.json");
    this.load.image('tiles', ['assets/tileset.png', 'assets/map.png']);
    this.load.atlas("atlas", ["assets/player.png", "assets/map.png"], "assets/atlas.json");
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
  }

  create() {
    // Controls.
    this.createJoystick();
    this.createCursors();

    // World.
    this.createMap();

    // Player.
    this.createPlayer();

    // Lights.
    this.createLights();

    // Fade in.
    this.cameras.main.fadeIn(3000);
  }

  createCursors() {
    // Arrow keys controls the camera.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createJoystick() {
    // Joystick.
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 60,
      y: 240,
      radius: 24,
      base: this.add.circle(0, 0, 40, 0x777777).setAlpha(0.5),
      thumb: this.add.circle(0, 0, 20, 0x999999).setAlpha(0.5),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      forceMin: 16,
      enable: true
    });
    this.joyStick.thumb.setDepth(20);
    this.joyStick.base.setDepth(20);
    this.joystikCursors = this.joyStick.createCursorKeys();
  }

  createMap() {
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tiles", "tilesx", 32, 32, 1, 2);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const groundLayer = map.createStaticLayer("bund", tileset, 0, 0);
    groundLayer.setCollisionByProperty({ collides: true });
    const worldLayer = map.createStaticLayer("verden", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    const aboveLayer = map.createStaticLayer("over", tileset, 0, 0);
    aboveLayer.setDepth(10);

    // Restrict world.
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Save references.
    this.map = {map: map, ground: groundLayer, world: worldLayer, sky: aboveLayer};
  }

  createPlayer() {
    // Add player.
    this.player = this.physics.add
      .sprite(272, 1220, "atlas", "misa-back")
      .setSize(14, 14)
      .setOffset(9, 18);


    this.player.setCollideWorldBounds(true);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, this.map.world);
    this.physics.add.collider(this.player, this.map.ground);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.cameras.main.startFollow(this.player);
  }

  createLights() {
    // flood light, so the player chracter doesn't disappear.
    this.lights.addLight(map.widthInPixels/2, map.heightInPixels/2, 1000).setIntensity(0.1);

    // Add everything to pipeline.
    this.player.setPipeline("Light2D");
    this.map.ground.setPipeline("Light2D");
    this.map.world.setPipeline("Light2D");
    this.map.sky.setPipeline("Light2D");

  }

  update(time, delta) {
    updatePlayer();
  }

  updatePlayer() {
    const speed = 80;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame.
    this.player.body.setVelocity(0);

    var left = this.cursors.left.isDown || this.joystikCursors.left.isDown;
    var right = this.cursors.right.isDown || this.joystikCursors.right.isDown;
    var up = this.cursors.up.isDown || this.joystikCursors.up.isDown;
    var down = this.cursors.down.isDown || this.joystikCursors.down.isDown;

    // Horizontal movement.
    if (left) {
      this.player.body.setVelocityX(-100);
    } else if (right) {
      this.player.body.setVelocityX(100);
    }

    // Vertical movement.
    if (up) {
      this.player.body.setVelocityY(-100);
    } else if (down) {
      this.player.body.setVelocityY(100);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal.
    this.player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations.
    if (left) {
      this.player.anims.play("misa-left-walk", true);
    } else if (right) {
      this.player.anims.play("misa-right-walk", true);
    } else if (up) {
      this.player.anims.play("misa-back-walk", true);
    } else if (down) {
      this.player.anims.play("misa-front-walk", true);
    } else {
      this.player.anims.stop();

      // If we were moving, pick and idle frame to use.
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
    }
  }

}