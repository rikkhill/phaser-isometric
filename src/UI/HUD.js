import 'phaser';
import DialogueBox from './DialogueBox';

// Base class for isometric map scenes
export default class HUD extends Phaser.Scene {
  constructor(config) {
    super({
      key: "HUD",
    });

    this.width = null;
    this.height = null;
    this.dialogue = null;




  }

  create() {

    this.width = game.canvas.width;
    this.height = game.canvas.height;

    this.dialogue = new DialogueBox({
      scene: this,
      x: this.width / 5,
      y: 3 * this.height / 4,
      width: 3 * this.width / 5
    });

    this.drawTitleBar();
    this.drawToolBar();
    this.scene.bringToTop();
    console.log("HUD dimensions:", this.width, this.height);
    console.log("Proposed dialogue dimensions", this.width / 4, 4 * this.height / 5);
  }

  drawTitleBar() {
    const bar = this.add.graphics(0, 0);
    bar.fillStyle(0xAAAA77, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height/20);
    bar.fillRectShape(rect);
  }

  drawToolBar() {
    const bar = this.add.graphics(0, 0);
    bar.fillStyle(0xAAAA77, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 3 * this.height / 4, this.width, this.height / 4);
    bar.fillRectShape(rect);
  }

  drawDialogueBox() {
    const box = this.add.graphics(0, 0);
    box.fillStyle(0x555533, 0.9);
    const rect = new Phaser.Geom.Rectangle(
      1 * this.width / 4,
      3 * this.height / 4,
      1 * this.width / 2,
      3 * this.height / 4
    );

    box.fillRectShape(rect);
  }
}