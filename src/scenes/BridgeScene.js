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
    this.load.json('map', 'assets/isomap_1.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
  }

  create() {
    this.mapData =  this.cache.json.get('map');

    //this.enableDebug();

    this.buildMap();

    // Centre the camera on the scene
    this.cameras.main.scrollX = this.mapWidth / 2 + 100;
    this.cameras.main.scrollY = this.mapHeight / 2;
    this.cameras.main.zoom = 0.8;

    // Add sprite
    let start = this.project({x: 1, y: 5});
    const character = new MovableSprite({
      scene: this,
      x: start.x,
      y: start.y,
      key: 'skeleton',
      level: 5,  // the tile layer the sprite is level with
    });

    this.charMovement = new MovementTracker(character);

    this.input.on('pointerdown', function(pointer) {

      // Get orthogonal positions for character start and end
      let charFrom = this.point.fromWorld(character.position());
      let charTo = this.point.fromClick(pointer);

      const path = this.getPath(charFrom, charTo);

      if(path.length > 0) {
        this.charMovement.setPath(path);
      } else {
        console.log("No path!");
        // Some sort of message needs to go here
      }
    }, this);
  }

  update() {
    // Check to see if we need to move
    this.charMovement.checkMovement();
  }
}

class MovementTracker {
  constructor(sprite) {
    this.sprite = sprite;
    this.movementQueue = [];
  }

  setPath(path) {
    // If the sprite is moving, stop it moving
    this.sprite.stop();

    const worldPath = path.map(c => c.world());
    //this.sprite.scene.debugDrawPath(worldPath);

    // The path includes the sprite's current location
    // so we should decapitate the queue first
    this.movementQueue = path.slice(1);
  }

  checkMovement() {
    if(!this.sprite.moving && this.movementQueue.length > 0) {
      this.sprite.move(this.movementQueue.shift().world());
      return true;
    } else {
      return false;
    }
  }
}