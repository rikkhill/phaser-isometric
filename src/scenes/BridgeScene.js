import MovableSprite from "../MovableSprite";
import IsoScene from "./IsoScene";

export default class BridgeScene extends IsoScene {
  constructor() {
    super({
      key: 'BridgeScene',
      tileWidth: 64,
      tileHeight: 32,
    });
  }

  preload() {
    console.log("Preload of BridgeScene");
    this.load.json('map', 'assets/isomap_1.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
  }

  create() {
    this.mapData =  this.cache.json.get('map');

    this.buildMap();

    // Centre the camera on the scene
    this.cameras.main.scrollX = this.mapWidth / 2 + 100;
    this.cameras.main.scrollY = this.mapHeight / 2;
    this.cameras.main.zoom = 0.8;

    // Add sprite
    let [startX, startY] = this.project(1, 5);
    const character = new MovableSprite({scene: this, x: startX, y: startY, key: 'skeleton'});

    this.input.on('pointerdown', function(pointer) {
      let wX = pointer.worldX;
      let wY = pointer.worldY;
      character.move(wX, wY);


    }, this);
  }
}