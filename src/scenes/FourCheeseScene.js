import MovableSprite from "../MovableSprite";
import IsoScene from "./IsoScene";

export default class FourCheeseScene extends IsoScene {
  constructor() {
    super({
      key: 'FourCheeseScene',
      mapProjection: "isometric",
      tileWidth: 64,
      tileHeight: 32,
    });
  }

  preload() {
    this.load.json(this.key + 'Map', 'assets/FourCheeseScene.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
  }

  create(data) {
    console.log("FourCheeseScene created!");
    console.log("Scene started with data:", data);
    //this.scene.bringToTop();
    window.scene = this;
    this.mapData =  this.cache.json.get(this.key + 'Map');

    //this.enableDebug();

    this.buildMap();

    // Centre the camera on the scene
    this.cameras.main.scrollX = 1200;
    this.cameras.main.scrollY = 400;
    this.cameras.main.zoom = 0.8;

    // Add sprite
    let start = this.project({x: 1, y: 5});
    this.PC = new MovableSprite({
      scene: this,
      x: start.x,
      y: start.y,
      key: 'skeleton',
      level: 5,  // the tile layer the sprite is level with
    });


    this.input.on('pointerdown', function(pointer) {

      // Get orthogonal positions for character start and end
      let charFrom = this.point.fromWorld(this.PC.position());
      let charTo = this.point.fromClick(pointer);

      const path = this.getPath(charFrom, charTo);

      if(path.length > 0) {
        this.PC.movement.setPath(path);
      } else {
        console.log("No path!");
        // Some sort of message needs to go here
      }
    }, this);

  }

  update() {
    // Check to see if we need to move
    this.PC.movement.checkMovement();
    this.portalZones.checkZones(this.PC);
    this.cameraZones.checkZones(this.PC);
  }
}

