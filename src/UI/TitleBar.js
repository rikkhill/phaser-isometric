import 'phaser';

export default class TitleBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    this.width = config.width;
    this.height = config.height;

    this.scene.add.existing(this);

    const bar = this.scene.add.graphics(0, 0);
    bar.fillStyle(0xAAAA77, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    bar.fillRectShape(rect);

    this.add(bar);

    this.title = this.scene.add.text(
      this.width / 2,
      this.height / 2,
      "",
      {
        fontFamily: 'Almendra, serif',
        fontSize: 16,
        color: '#2a2a2a',
        fontStyle: 'bold',
        wordWrap: {
          width: this.width,
          useAdvancedWrap: true
        }
      });

    this.title.setOrigin(0.5);

    this.add(this.title);
  }

  setTitle(text) {
    this.title.setText(text.toUpperCase());
  }
}