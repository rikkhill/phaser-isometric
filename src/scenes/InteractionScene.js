import MovableSprite from "../sprites/MovableSprite";
import StaticNPC from "../sprites/StaticNPC";
import IsoScene from "./IsoScene";
import Interactable from "../environment/Interactable";
import CollectableObject from "../environment/CollectableObject";
import DialogueParser from '../system/DialogueParser';

export default class InteractionScene extends IsoScene {
  constructor() {
    super({
      key: 'InteractionScene',
      mapProjection: "isometric",
      tileWidth: 64,
      tileHeight: 32,
    });

    this.title = "Interaction Test Scene";
  }

  preload() {
    this.load.json(this.key + 'Map', 'assets/InteractionScene.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('skeleton', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
    this.load.spritesheet('clive', 'assets/zombie_0.png', { frameWidth: 128, frameHeight: 128});
    this.load.image("crystal", "assets/crystals/crystal01.png");
    this.load.image("apple", "assets/apple.png");
    this.load.image("banana", "assets/banana.png");
    this.load.image("note", "assets/note.png");
    this.load.image("whiskey", "assets/whiskey.png");
    this.load.json('cliveScript', "assets/InkScripts/bartleby.json");
    this.load.json('greenRockScript', "assets/InkScripts/greenRocks.json");
  }

  create(state) {
    this.state = state;
    this.mapData =  this.cache.json.get(this.key + 'Map');

    this.HUD = this.scene.get("HUD");
    this.HUD.title.setTitle(this.title);
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
      facing: 'NorthEast',
      interaction: () => {
        this.HUD.showDialogue();
        (new DialogueParser(this.cache.json.get('greenRockScript'), this.state)).sayNext();
      }
    });

    // We're repeating this Market/Standpoint/Entity thing a lot
    // Probably want a generic "place this in the scene" method
    let appleMarker = this.stageMarkers["apple"].world();
    let appleStandpoint = this.stageMarkers["appleStandpoint"].world();
    let apple = new CollectableObject({
      scene: this,
      x: appleMarker.x,
      y: appleMarker.y,
      level: 3,
      key: "apple",
      standpoint: appleStandpoint,
      facing: 'SouthWest',
      pickupLine: "An apple a day keeps the doctor away! I hate doctors, so I'm going to keep this.",
      itemConfig: {
        name: "Apple",
        description: "A lovely shiny red apple",
      }
    });

    apple.setScale(0.2);


    let bananaMarker = this.stageMarkers["banana"].world();
    let bananaStandpoint = this.stageMarkers["bananaStandpoint"].world();
    let banana = new CollectableObject({
      scene: this,
      x: bananaMarker.x,
      y: bananaMarker.y,
      level: 3,
      key: "banana",
      standpoint: bananaStandpoint,
      facing: 'East',
      pickupLine: "It's a banana. They are high in potassium. I'm going to keep hold of this.",
      itemConfig: {
        name: "Banana",
        description: "A banana"
      }
    });

    banana.setScale(0.2);

    let whiskeyMarker = this.stageMarkers["whiskey"].world();
    let whiskey = new CollectableObject({
      scene: this,
      x: whiskeyMarker.x,
      y: whiskeyMarker.y,
      level: 3,
      key: "whiskey",
      standpoint: whiskeyMarker,
      facing: 'East',
      pickupLine: "It's a nice big jug of moonshine. I think I'll keep it.",
      itemConfig: {
        name: "Whiskey",
        description: "A large jug of moonshine"
      }
    });

    whiskey.setScale(0.4);


    let noteMarker = this.stageMarkers["note"].world();
    let note = new CollectableObject({
      scene: this,
      x: noteMarker.x,
      y: noteMarker.y,
      level: 3,
      key: "note",
      standpoint: noteMarker,
      facing: 'South',
      pickupLine: "It's a note. I'm going to keep hold of this.",
      itemConfig: {
        name: "A handwritten note",
        description: "\"Run! Run from this place as fast as you possibly can!\""
      }
    });

    note.setScale(0.3);

    let cliveMarker = this.stageMarkers["clive"].world();
    let cliveStandpoint = this.stageMarkers["cliveStandpoint"].world();
    let clive = new StaticNPC({
      key: 'clive',
      scene: this,
      x: cliveMarker.x,
      y: cliveMarker.y,
      direction: 'SouthWest',
      script: this.cache.json.get('cliveScript'),
      sheetWidth: 36,
      level: 3,
      standpoint: cliveStandpoint,
      facing: "NorthEast"
    });

    //this.add.image(crystalMarker.x, crystalMarker.y, 'crystal');
    //crystal.depth = crystalMarker.y * 3;

    // Put the camera at the start marker
    const cameraStart = this.stageMarkers["cameraStart"].world();
    this.cameras.main.scrollX = this.centerX / 2 + 100;
    this.cameras.main.scrollY = this.centerY / 2 + 350;
    this.cameras.main.zoom = 1;
    this.cameras.main.fadeIn(1000);

  }

  update() {
    // Check to see if we need to move
    this.PC.movement.checkMovement();
    this.portalZones.checkZones(this.PC);
  }
}


