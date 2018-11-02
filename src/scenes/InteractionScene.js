import MovableSprite from "../sprites/MovableSprite";
import StaticNPC from "../sprites/StaticNPC";
import IsoScene from "./IsoScene";
import Interactable from "../environment/Interactable";
import DialogueRunner from "../DialogueRunner";

export default class InteractionScene extends IsoScene {
  constructor() {
    super({
      key: 'InteractionScene',
      mapProjection: "isometric",
      tileWidth: 64,
      tileHeight: 32,
    });
  }

  preload() {
    this.load.json(this.key + 'Map', 'assets/InteractionScene.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
    this.load.spritesheet('clive', 'assets/zombie_0.png', { frameWidth: 128, frameHeight: 128});
    this.load.image("crystal", "assets/crystals/crystal01.png");
    this.load.json('testScript', "assets/InkScripts/TestScript.json");
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
      level: 3,  // the tile layer the sprite is level with
    });

    let crystalMarker = this.stageMarkers["crystal"].world();
    let crystalStandpoint = this.stageMarkers["crystalStandpoint"].world();
    let crystal = new Interactable({
      scene: this,
      x: crystalMarker.x,
      y: crystalMarker.y,
      level: 3,
      key: "crystal",
      standpoint: crystalStandpoint,
      facing: 'NorthEast'
    });

    let cliveMarker = this.stageMarkers["clive"].world();
    let cliveStandpoint = this.stageMarkers["cliveStandpoint"].world();
    let clive = new StaticNPC({
      key: 'clive',
      scene: this,
      x: cliveMarker.x,
      y: cliveMarker.y,
      direction: 'SouthWest',
      sheetWidth: 36,
      level: 3,
      standpoint: cliveStandpoint,
      facing: "NorthEast"
    });

    this.add.image(crystalMarker.x, crystalMarker.y, 'crystal');
    crystal.depth = crystalMarker.y * 3;

    // Put the camera at the start marker
    const cameraStart = this.stageMarkers["cameraStart"].world();
    this.cameras.main.scrollX = this.centerX / 2 + 100;
    this.cameras.main.scrollY = this.centerY / 2 + 350;
    this.cameras.main.zoom = 1;

    this.dialogueRunner = new DialogueRunner(this.cache.json.get("testScript"));

    window.dialogue = this.dialogueRunner;

  }

  update() {
    // Check to see if we need to move
    this.PC.movement.checkMovement();
    this.portalZones.checkZones(this.PC);
  }
}


