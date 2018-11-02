import 'phaser';
import {euc, cardinal} from '../spaceHelpers';

// This is duplicating a lot of code from MovableSprite
// Some more sensible inheritance structure is probably a good idea

export default class MovableSprite extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    this.name = config.key;
    this.scene = config.scene;
    this.direction = config.direction;
    this.sheetWidth = config.sheetWidth;
    this.originY = 0.75;  // distance between centre of the sprite and it's feet
    this.level = config.level; // The sprite's "height" in the map layers
    this.depthBonus = 1;
    this.standpoint = config.standpoint;

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

    this.anims.play(this.name + "Idle" + this.direction);

    this.depth = this.y * this.level + this.depthBonus;

    this.scene.add.existing(this);

    this.interact = () => {
      console.log("Interactable interacted with:", this);
      let HUD = this.scene.scene.get("HUD");
      HUD.dialogue.say("It's some green rocks.");
    };

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(55, 40, 16, 64),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "pointer"});
    this.on("pointerdown", () => {
      this.scene.events.emit('interactableclicked', this);
    });

  }

  registerAnims() {
    // Don't register this sprite's anims if it already has them
    if(this.scene.anims.get(this.name + "IdleWest")) {
      return;
    }

    // Create animations for all walking directions
    this.directions.forEach((c, i) => {
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

  idle() {
    this.anims.play(this.name + "Idle" + this.direction);
  }



}

