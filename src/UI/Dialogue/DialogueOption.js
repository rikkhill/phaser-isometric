import 'phaser';

export default class DialogueOption extends Phaser.GameObjects.Text {
  constructor(config) {
    super(config.scene, config.x, config.y, config.text, config.style);
    this.originalStyle = config.style;
    this.hoverStyle = config.hoverStyle;
    this.value = config.value;
    this.callback = config.callback;

    this.setInteractive({ useHandCursor: true });

    this.on('pointerover', () => {
      this.setStyle(this.hoverStyle);
    });

    this.on('pointerout', () => {
      this.setStyle(this.originalStyle);
    });

    this.on('pointerdown', () => {
      this.input.enabled = false;
      this.callback(this.value);
    });

    this.scene.add.existing(this);
  }
}

