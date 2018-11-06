import 'phaser';
import DialogueBox from './DialogueBox';
import InventoryBox from './InventoryBox';
import TitleBar from './TitleBar';



// Base class for isometric map scenes
export default class HUD extends Phaser.Scene {
  constructor(config) {
    super({
      key: "HUD",
    });

    this.width = game.canvas.width;
    this.height = game.canvas.height;

  }

  create() {


    this.dialogue = new DialogueBox({
      scene: this,
      openX: this.width / 5,
      x: this.width / 5,
      openY: 3 * this.height / 4,
      y: this.height,
      width: 3 * this.width / 5,
      height: 200
    });

    this.inventory = new InventoryBox({
      scene: this,
      x: this.width,
      openX: 3 * this.width / 4,
      y: this.height / 25,
      openY: this.height / 25,
      width: this.width / 4,
      height: 24 * this.height / 25
    });

    this.title = new TitleBar({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height / 25,
      scene: this
    });

    this.drawToolBar();
    this.scene.bringToTop();
  }

  drawToolBar() {
    const bar = this.add.graphics(0, 0);
    bar.fillStyle(0xAAAA77, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 3 * this.height / 4, this.width, this.height / 4);
    bar.fillRectShape(rect);
  }


}