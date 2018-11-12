import 'phaser';
import DialogueOption from './DialogueOption';

// This is the container for dialogue options.
// It is responsible for messaging which options have been selected
// When an option has been selected
export default class DialogueOptionStack extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.width = config.width;
    this.callback = config.callback;

    this.scene.add.existing(this);

    this.continuation = this.scene.add.existing(new DialogueOption({
      scene: this.scene,
      x: 0,
      y: this.height,
      text: "...",
      value: 0,
      style: {fontFamily: 'Gill Sans, sans-serif', fontSize: 18, color: '#aaffaa', fontStyle: ""},
      hoverStyle: {fontFamily: 'Gill Sans, sans-serif', fontSize: 18, color: '#448844', fontStyle: 'bold'},
      callback: () => this.continue()
    }));

    this.add(this.continuation);

    this.height += this.continuation.displayHeight;
  }

  continue() {

    this.continuation.destroy();
    this.height = 0;
    this.parentContainer.recalculateHeight();

    if(this.callback) {
      this.callback();
    }
  }
}