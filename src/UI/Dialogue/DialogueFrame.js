import 'phaser';
import DialogueStack from "./DialogueStack";

export default class DialogueFrame extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.width = config.width;
    this.height = config.height;

    this.scene.add.existing(this);

    // For now at least, let's see the box
    let box = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0x202020, 0.9);
    graphics.fillRectShape(box);

    this.add(graphics);

    // Define the viewport through which we see the dialogue stack
    // We are going to take 30 horizontal pixels for margins and scrollbars
    // and 20 vertical pixels for margins


    this.stack = new DialogueStack({
      name: 'dialogueStack',
      scene: this.scene,
      x: 10,
      y: this.height - 10,
      width: this.width - 30,
    });

    this.add(this.stack);

    this.addScrollBar();

  }

  // Horrible hacky scrollbar we'll make nicer in future
  addScrollBar() {
    let track = this.scene.add.graphics(0, 0);
    track.fillStyle(0x90d090);
    let trackLine = new Phaser.Geom.Rectangle(
      this.width - 12,
      10,
      4,
      this.height - 20);
    track.fillRectShape(trackLine);
    this.add(track);

    // Handle is 50px tall and 10px wide
    let handle = new Phaser.GameObjects.Container(
      this.scene,
      this.width - 15,
      this.height - 60,
    );

    this.add(handle);

    let handleBoxGraphic = this.scene.add.graphics(0, 0);
    handleBoxGraphic.fillStyle(0xd09090); // Reddish
    let handleBox = new Phaser.Geom.Rectangle(0, 0, 10, 50);
    handleBoxGraphic.fillRectShape(handleBox);

    handle.add(handleBoxGraphic);

    handle.setInteractive({
      hitArea: handleBox,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: 'pointer',
      draggable: true

    });

    this.handlePosition = null;

    handle.on("drag", (pointer, dragX, dragY, a, b, c) => {
      // Force it to be in the interval (0, depth)

      let min = 10;
      let max = this.height - 60;

      this.handlePosition  = Math.min(Math.max(min, dragY), max);
      handle.y = this.handlePosition;
      let proportion = 1 - (this.handlePosition - min) / (max - min);

      // We'll emit the proportion, and let the attached object
      // figure out how it's supposed to display itself
      this.scene.events.emit("scrollbarmoved", {
        proportion: proportion,
        handles: "dialogueStack",
        portHeight: this.height - 10
      });
    });
  }

  addPanel(...args) {
    this.stack.addPanel(...args);
  }
}