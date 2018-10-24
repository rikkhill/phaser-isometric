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
    this.originY = 0.75;  // distance between centre of the sprite and it's feet

    // Speed in approximate tiles per second
    this.speed = 2;

    this.moving = false;

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

  // Return the x, y coords as a convenient object
  position() {
    return {x: this.x, y: this.y};
  }

  // Moves this sprite to these world coordinates
  move(coords) {

    const oldCoords = this.scene.unproject({x: this.x, y: this.y});
    const newCoords = this.scene.unproject(coords);

    const distance = euc(oldCoords.x, newCoords.x, oldCoords.y, newCoords.y);
    this.direction = cardinal(oldCoords.x, newCoords.x, oldCoords.y, newCoords.y);
    const duration = (distance) / (this.speed / 1000);

    // Stop the current movement tween
    this.stop();

    // Start a new one
    this.moving = true;

    this.tween = this.scene.tweens.add({
      targets: this,
      x: coords.x,
      y: coords.y,
      onStart: function (t, spriteArray) {
        const sprite = spriteArray[0];
        sprite.anims.play(sprite.name + "Walk" + sprite.direction);
      },
      onComplete: function (t, spriteArray) {
        const sprite = spriteArray[0];
        sprite.moving = false;
        sprite.anims.play(sprite.name + "Idle" + sprite.direction);

      },
      duration: duration,
    });

  }

  stop() {
    if(this.tween) {
      this.tween.stop();
      this.moving = false;
    }
  }

}