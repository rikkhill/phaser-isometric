import 'phaser';
import InventoryBox from './InventoryBox';
import NotesBox from './NotesBox';
import TitleBar from './TitleBar';
import SideBar from './SideBar';

// All imports below this line are temporary test imports and should eventually be removed
import DialogueFrame from './Dialogue/DialogueFrame';



// Base class for isometric map scenes
export default class HUD extends Phaser.Scene {
  constructor(config) {
    super({
      key: "HUD",
    });

    this.width = game.canvas.width;
    this.height = game.canvas.height;

    this.dialogueHidden = true;
    this.inTransition = false;

    window.HUD = this;

  }

  preload() {
    this.load.spritesheet('new', 'assets/UI/sparkle/whiteSparkle.png', { frameWidth: 32, frameHeight: 32});
    this.load.image('inventoryButton', 'assets/UI/inventory.png');
    this.load.image('notesButton', 'assets/UI/notes.png');

    this.load.image('appleInventory', 'assets/apple.png');
    this.load.image('bananaInventory', 'assets/banana.png');
    this.load.image('noteInventory', 'assets/note.png');
    this.load.image('whiskeyInventory', 'assets/whiskey.png');

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    );

  }

  create() {


    /*
    this.anims.create({
      key: 'newSparkle',
      frames: this.anims.generateFrameNumbers(
        'new',
        {start: 0, end: 15}),
      frameRate: 15,
      repeat: -1,
      repeatDelay: 2000,
    });

    // One day soon we will add this sparkle to denote new items in sidebar areas
    //const newSparkle = this.add.sprite(300, 300, 'new').play("newSparkle").setScale(0.4); */


    WebFont.load({
      google: {
        families: ["Almendra", "Open Sans"]
      }
    });


    // The box where inventory items are displayed
    this.inventory = new InventoryBox({
      scene: this,
      x: this.width,
      openX: 2 * this.width / 3,
      y: this.height / 25,
      openY: this.height / 25,
      width: this.width / 3,
      height: 24 * this.height / 25
    });

    this.notes = new NotesBox({
      scene: this,
      x: this.width,
      openX: 2 * this.width / 3,
      y: this.height / 25,
      openY: this.height / 25,
      width: this.width / 3,
      height: 24 * this.height / 25
    });

    // The titlebar
    // (This generally shows the name of the scene)
    this.title = new TitleBar({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height / 25,
      scene: this
    });


    // The menu sidebar
    this.sideBar = new SideBar({
      scene: this,
      x: this.width - 32,
      y: this.height / 25,
      width: 32,
      height: this.height
    });

    this.sideBar.addButton('inventory', 'inventoryButton');
    this.sideBar.addButton('notes', 'notesButton');



    this.dialogueFrame = new DialogueFrame({
      scene: this,
      x: 100,
      y: this.height,
      width: 600,
      height: 200
    });

    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xFFFFFF);
    maskShape.fillRectShape(new Phaser.Geom.Rectangle(
      100,
      400,
      600,
      200
    ));

    this.dialogueMask = maskShape.createGeometryMask();

    this.dialogueFrame.setMask(this.dialogueMask);
    window.dp = this.dialogueFrame;


    this.scene.bringToTop();
  }

  // Because of how masking works, this kind of needs to live in here...

  hideDialogue() {
    if(this.dialogueHidden) {
      return false;
    }

    this.tweens.add({
      targets: [this.dialogueFrame, this.dialogueMask],
      ease: 'Cubic',
      y: "+=" + this.dialogueFrame.height,
      duration: 300,
      onStart: () => {
        this.inTransition = true;
      },
      onComplete: () => {
        this.inTransition = false;
        this.dialogueHidden = true;
      }
    });

  }

  showDialogue() {
    if(!this.dialogueHidden) {
      return false;
    }

    this.tweens.add({
      targets: [this.dialogueFrame, this.dialogueMask],
      ease: 'Cubic',
      y: "-=" + this.dialogueFrame.height,
      duration: 300,
      onStart: () => {
        this.inTransition = true;
      },
      onComplete: () => {
        this.inTransition = false;
        this.dialogueHidden = false;
      }
    });
  }

}