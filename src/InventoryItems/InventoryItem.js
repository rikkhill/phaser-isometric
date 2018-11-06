import 'phaser';

export default class InventoryItem extends Phaser.GameObjects.Image {
  constructor(config) {
    console.log(config);
    super(config.scene, config.x, config.y, config.key);
    this.name = config.name;
    this.description = config.description;

    this.setInteractive({cursor: 'pointer'});
    this.on('pointerdown', () => {
      console.log("Clicked on " + this.name);
      if(this.description) {
        console.log(this.description);
      }
    });
  }
}