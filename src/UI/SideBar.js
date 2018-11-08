import 'phaser';

export default class SideBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    this.buttonCount = 0;

    this.width = config.width;
    this.height = config.height;

    this.scene.add.existing(this);

    this.bar = this.scene.add.graphics(0, 0);
    this.bar.fillStyle(0x424242, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.bar.fillRectShape(rect);

    // We setInteractive mostly to make sure it doesn't
    // trigger any onclick effects on objects beneath it
    this.bar.setInteractive({
      hitArea: rect,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: 'default'
    });

    this.depth = 220;

    this.add(this.bar);

  }

  addButton(name, key) {
    const button = this.scene.add.image(0, this.buttonCount * 32, key);
    button.setScale(0.5);
    button.setOrigin(0, 0);
    button.depth = 225;

    button.setInteractive({cursor: 'pointer'});
    button.name = name;
    button.on('pointerdown', () => {
      this.scene.events.emit('menuitemclicked', button);
    });

    this.add(button);
    this.buttonCount++;
  }
}