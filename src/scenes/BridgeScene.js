import MovableSprite from "../MovableSprite";
import IsoScene from "./IsoScene";

export default class BridgeScene extends IsoScene {
  constructor() {
    super({
      key: 'BridgeScene',
      mapProjection: "isometric",
      tileWidth: 64,
      tileHeight: 32,
    });
  }

  preload() {
    this.load.json(this.key + 'Map', 'assets/isomap_1.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
  }

  create(state) {
    this.state = state;
    this.mapData =  this.cache.json.get(this.key + 'Map');

    //this.enableDebug();

    this.buildMap();



    // Add sprite
    let start = this.getEntryPoint().world();
    this.PC = new MovableSprite({
      scene: this,
      x: start.x,
      y: start.y,
      key: 'skeleton',
      level: 5,  // the tile layer the sprite is level with
    });

    // Centre the camera on the scene
    const cameraStart = this.stageMarkers["cameraStart"].world();
    this.cameras.main.scrollX = cameraStart.x - this.centerX + this.tileWidth;
    this.cameras.main.scrollY = (cameraStart.y - this.centerY * 2);


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
  }
}

