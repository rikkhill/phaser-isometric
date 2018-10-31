import 'phaser';

export class ClickableText extends Phaser.GameObjects.Text {
  constructor(config) {
    super(config.scene, config.x, config.y, config.text, config.style);
    this.originalStyle = config.style;
    this.hoverStyle = config.hoverStyle;
    this.callback = config.callback;

    this.setInteractive({ useHandCursor: true });
    console.log(this.style);

    this.on('pointerover', () => {
      this.setStyle(this.hoverStyle);
    });

    this.on('pointerout', () => {
      this.setStyle(this.originalStyle);
    });

    this.on('pointerdown', this.callback);
  }
}