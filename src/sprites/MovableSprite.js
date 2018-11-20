import 'phaser';
import {euc, cardinal} from '../spaceHelpers';

export default class MovableSprite extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    window.sprite = this;

    this.name = config.key;
    this.scene = config.scene;
    this.direction = "South"; //config.direction;
    this.cameraZone = "default";
    this.portalZone = "none";
    this.sheetWidth = 13;// config.sheetWidth;
    this.originY = 0.75;  // distance between centre of the sprite and it's feet
    this.level = config.level; // The sprite's "height" in the map layers
    this.depthBonus = 1;  // Make the sprite appear in front of environmental objects
                           // it's standing next to, to help prevent clipping

    this.movement = new MovementTracker(this);

    // Speed in approximate tiles per second
    this.speed = 1.5;

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

    this.depth = this.y * this.level + this.depthBonus;

    this.scene.add.existing(this);

    this.scene.events.on("walkablesurfaceclicked", (pointer) => {
      // Get orthogonal positions for character start and end
      let charFrom = this.scene.point.fromWorld(this.position());
      let charTo = this.scene.point.fromClick(pointer);

      const path = this.scene.getPath(charFrom, charTo);

      if(path.length > 0) {
        this.movement.setPath(path);
      } else {
        console.log("No path!");
        // Some sort of message needs to go here
      }

    });

    this.scene.events.on("interactableclicked", (interactable) => {
      // Get orthogonal positions for character start and end
      let charFrom = this.scene.point.fromWorld(this.position());
      let charTo = this.scene.point.fromWorld(interactable.standpoint);

      const path = this.scene.getPath(charFrom, charTo);

      if(path.length > 0) {
        this.movement.setPath(path, () => {
          this.direction = interactable.facing;
          this.idle();
          interactable.interaction();

        });
      } else {
        console.log("No path!");
        // Some sort of message needs to go here
      }

    });
    // Miscellaneous stuff we need to exist beforehand
    this.tween = null;

  }

  registerAnims() {
    // Don't register this sprite's anims if it already has them
    if(this.scene.anims.get(this.name + "WalkWest")) {
      return;
    }

    // Create animations for all walking directions
    this.directions.forEach((c, i, a) => {
      this.scene.anims.create({
        key: this.name + "Walk" + c,
        frames: this.scene.anims.generateFrameNumbers(
          this.name,
          {start: (i * this.sheetWidth) + 4, end: (i * this.sheetWidth + 12)}),
        frameRate: 9,
        repeat: -1,
        yoyo: false
      });

      // Create animations for all idle directions
      this.scene.anims.create({
        key: this.name + "Idle" + c,
        frames: this.scene.anims.generateFrameNumbers(
          this.name,
          {start: (i * this.sheetWidth), end: (i * this.sheetWidth + 3)}),
        frameRate: 2,
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

    // In the event of being directed to exactly the same point
    // the tween will NaN out and our sprite will disappear
    // in a puff of mathematics
    if(distance === 0) {
      return;
    }

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
      depth: coords.y * this.level + this.depthBonus,
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

  idle() {
    this.anims.play(this.name + "Idle" + this.direction);
  }

  stop() {
    if(this.tween) {
      this.tween.stop();
      this.moving = false;
    }
  }

}


class MovementTracker {
  constructor(sprite) {
    this.sprite = sprite;
    this.movementQueue = [];
    this.callback = null;
  }

  setPath(path, callback) {
    // If the sprite is moving, stop it moving
    this.sprite.stop();

    this.callback = typeof callback === "undefined" ? null : callback;

    //const worldPath = path.map(c => c.world());
    //this.sprite.scene.debugDrawPath(worldPath);

    // The path includes the sprite's current location
    // so we should decapitate the queue first
    this.movementQueue = path.slice(1);

  }

  checkMovement() {
    if(!this.sprite.moving && this.movementQueue.length > 0) {
      this.sprite.move(this.movementQueue.shift().world());
      return true;
    } else if(!this.sprite.moving && this.callback) {
      this.callback();
      this.callback = null;
      return true;
    }
    return false;
  }
}