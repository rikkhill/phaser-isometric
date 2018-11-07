import 'phaser';
import SlidingContainer from './SlidingContainer';
import InventoryItem from '../InventoryItems/InventoryItem';

export default class InventoryBox extends SlidingContainer {

  constructor(config){
    super(config);
    this.scene = config.scene;
    this.width = config.width;
    this.height = config.height;
    this.cols = 3;
    this.iconWidth = 64;
    this.margin = 4;


    this.scene.add.existing(this);

    window.inventory = this;

    let box = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0xd2d2d2, 0.9);
    graphics.fillRectShape(box);
    this.add(graphics);

    this.depth = 200;



  }

  drawInventory(inventory) {
    for(let [i, itemKey] of Object.keys(inventory).entries()) {
      let row = Math.floor(i / this.cols);
      let col = i % this.cols;

      console.log("InventoryItem: ", row, col);
      let itemConfig = inventory[itemKey];

      let item = new InventoryItem({
        scene: this.scene,
        x: col * this.iconWidth + this.margin,
        y: row * this.iconWidth + this.margin,
        key: itemKey + "Inventory",
        ...itemConfig,
      });

      this.scene.add.existing(item);
      item.setOrigin(0);
      this.add(item);

    }

  }

}