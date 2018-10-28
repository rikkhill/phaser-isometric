import 'phaser';

// Base class for isometric map scenes
export default class HUD extends Phaser.Scene {
  constructor(config) {
    super({
      key: "HUD",
    });

    this.width = null;
    this.height = null;

    console.log(this);

  }

  create() {
    console.log(this.game);

    this.width = game.canvas.width;
    this.height = game.canvas.height;

    this.drawTitleBar();
    this.drawToolBar();
    this.scene.bringToTop();
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

}
