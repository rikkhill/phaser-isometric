import 'phaser';
import {euc, cardinal} from './spaceHelpers';

export default class MovableSprite extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    window.sprite = this;

    this.name = config.key;
    this.scene = config.scene;
    this.direction = "South"; //config.direction;
    this.sheetWidth = 28;// config.sheetWidth;
    this.heightOffset = 32;  // distance between centre of the sprite and it's feet

    // Speed in approximate tiles per second
    this.speed = 2;

    // A list of directions, ordered clockwise west to south west
    // (This should be their order on the sprite sheet)
    this.directions = ["West",
      "NorthWest",
      "North",
      "NorthEast",
      "East",
      "SouthEast",
      "South",
      "SouthWest"];

    this.registerAnims();

    this.anims.play(this.name + "IdleSouth");

    this.depth = 100000;

    this.scene.add.existing(this);
    this.create();

    // Miscellaneous stuff we need to exist beforehand
    this.tween = null;
  }

  registerAnims() {

    // Create animations for all walking directions
    this.directions.forEach((c, i, a) => {
      this.scene.anims.create({
        key: this.name + "Walk" + c,
        frames: this.scene.anims.generateFrameNumbers(
          this.name,
          {start: (i * this.sheetWidth) + 4, end: (i * this.sheetWidth + 11)}),
        frameRate: 8,
        repeat: -1,
        yoyo: false
      });

      // Create animations for all idle directions
      this.scene.anims.create({
        key: this.name + "Idle" + c,
        frames: this.scene.anims.generateFrameNumbers(
          this.name,
          {start: (i * this.sheetWidth), end: (i * this.sheetWidth + 3)}),
        frameRate: 5,
        repeat: -1,
        yoyo: true
      });
    });



  }

  create() {

  }

  // Moves this sprite from x to y
  move(x, y) {

    const [tileOldX, tileOldY] = this.scene.unproject(this.x, this.y);
    const [tileNewX, tileNewY] = this.scene.unproject(x, y);

    const distance = euc(tileOldX, tileNewX, tileOldY, tileNewY);
    this.direction = cardinal(tileOldX, tileNewX, tileOldY, tileNewY);
    const duration = (distance) / (this.speed / 1000);

    // Stop the current movement tween
    if(this.tween) {
      this.tween.stop();
    }

    // Start a new one
    this.tween = this.scene.tweens.add({
      targets: this,
      x: x,
      y: y - this.heightOffset,
      onStart: function (t, spriteArray) {
        console.log("arguments of onStart", arguments);
        const sprite = spriteArray[0];
        sprite.anims.play(sprite.name + "Walk" + sprite.direction);
      },
      onComplete: function (t, spriteArray) {
        const sprite = spriteArray[0];
        sprite.anims.play(sprite.name + "Idle" + sprite.direction);
      },
      duration: duration,
    });

  }

}