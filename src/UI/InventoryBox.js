import 'phaser';
import SlidingContainer from './SlidingContainer';

export default class InventoryBox extends SlidingContainer {

  constructor(config){
    super(config);
    this.scene = config.scene;
    this.width = config.width;
    this.height = config.height;


    this.scene.add.existing(this);

    window.inventory = this;

    let box = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0xd2d2d2, 0.9);
    graphics.fillRectShape(box);
    this.add(graphics);

    this.depth = 200;
  }


}