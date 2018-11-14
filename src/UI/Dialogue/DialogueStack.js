import 'phaser';
import DialoguePanel from "./DialoguePanel";

export default class DialogueStack extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.name = config.name;
    this.width = config.width;
    this.unadjustedY = config.y;
    this.heightOffset = 0;

    this.stack = [];

    this.scene.add.existing(this);

    this.scene.events.on("scrollbarmoved", (scrollData) => {

      // How much of the text is over the top of the viewport?
      let overflowHeight = this.heightOffset - scrollData.portHeight;

      // If it's less than zero, zero it out
      overflowHeight = Math.max(0, overflowHeight);

      // Shift the frame by a proportion of the overflow height
      let yShift = scrollData.proportion * overflowHeight;

      this.y = this.unadjustedY - this.heightOffset + yShift;
    });

  }

  addPanel(config) {
    const panel = new DialoguePanel({
      scene: this.scene,
      x: 0,
      y: this.heightOffset,
      width: this.width,
      header: config.header,
      body: config.body,
      options: config.options,
      optionsCallback: config.optionsCallback,
      button: config.button,
      buttonCallback: config.buttonCallback,
      continuation: config.continuation,
      continuationCallback: config.continuationCallback
    });

    this.add(panel);
    this.stack.push(panel);

    this.heightOffset += panel.height;

    this.scene.tweens.add({
      targets: this,
      y: "-=" + panel.height,
      duration: 100,
    });

  }

  recalculateHeight() {
    this.heightOffset = this.stack.reduce((a, b) => a + b.height, 0);
  }

  clear() {
    // Set the stack back to its original settings
    this.stack.forEach(panel => panel.destroy());
    this.stack = [];
    this.heightOffset = 0;
    this.y = this.unadjustedY;
  }
}