import 'phaser';

export default class InventoryItem extends Phaser.GameObjects.Image {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    this.name = config.name;

    this.setInteractive({cursor: 'pointer'});
    this.on('pointerdown', () => {
      console.log("Clicked on " + this.name);
    });
  }
}