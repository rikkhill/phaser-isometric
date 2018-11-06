import 'phaser';
import DialogueParser from '../system/DialogueParser';

// This is duplicating a lot of code from MovableSprite
// Some more sensible inheritance structure is probably a good idea

export default class MovableSprite extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    this.name = config.key;
    this.scene = config.scene;
    this.direction = config.direction;
    this.sheetWidth = config.sheetWidth;
    this.script = new DialogueParser(config.script, this.scene.state);
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

    this.interaction = () => {
      this.scene.HUD.dialogue.slideOpen();
      this.script.ResetState();
      this.sayNext();
    };

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(55, 40, 16, 64),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "pointer"});
    this.on("pointerdown", () => {
      this.scene.events.emit('interactableclicked', this);
    });

    // Yeah, we definitely need to break this out somehow...
    // We can't just pass the object method, as it isn't bound to the


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

  // Do the next thing in the script
  sayNext() {

    // TODO: Basically refactor all of this into the DialogueParser
    if(this.script.canContinue) {
      // Whatever
    }
    const dialogue = this.script.getNext();

    if(this.script.currentChoices.length > 0) {
      this.scene.HUD.dialogue.choice(
        dialogue.speaker + ": " + dialogue.text, //this.script.currentText,
        this.script.currentChoices,
        (response) => {
          this.giveResponse(response);
        }
      );
    } else if (this.script.canContinue) {  // This tests for the end of the script
      this.scene.HUD.dialogue.converse(this.script.currentText, () => {this.sayNext()});
    } else {
      this.scene.HUD.dialogue.say(this.script.currentText);
    }
  }

  giveResponse(choice) {
    this.script.ChooseChoiceIndex(choice);
    this.scene.HUD.dialogue.clearAll();
    this.sayNext();
  }



}

