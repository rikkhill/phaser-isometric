import 'phaser';

export default class InventoryItem extends Phaser.GameObjects.Image {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
  }
}