import 'phaser';
import DialogueBox from './DialogueBox';
import InventoryBox from './InventoryBox';
import NotesBox from './NotesBox';
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

  preload() {
    this.load.spritesheet('new', 'assets/UI/sparkle/whiteSparkle.png', { frameWidth: 32, frameHeight: 32});
    this.load.image('inventoryButton', 'assets/UI/inventory.png');
    this.load.image('notesButton', 'assets/UI/notes.png');

    this.load.image('appleInventory', 'assets/apple.png');
    this.load.image('bananaInventory', 'assets/banana.png');
    this.load.image('noteInventory', 'assets/note.png');
    this.load.image('whiskeyInventory', 'assets/whiskey.png');
  }

  create() {


    // TODO: flesh out sidebar menu into a container
    // Have it take responsibility for updates, etc.
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
    //const newSparkle = this.add.sprite(300, 300, 'new').play("newSparkle").setScale(0.4);


    this.dialogue = new DialogueBox({
      scene: this,
      openX: this.width / 5,
      x: this.width / 5,
      openY: 3 * this.height / 4,
      y: this.height,
      width: 3 * this.width / 5,
      height: 200,
      permanent: true
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

    this.notes = new NotesBox({
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

    // We may end up never actually using the toolbar at the bottom
    // It's just taking up screen estate
    this.drawToolBar();


    this.drawSideBar();
    // We want the sidebar to be a separate container and the button to look less ugly
    this.inventoryButton = this.add.image(this.width, this.height / 25, 'inventoryButton');
    this.inventoryButton.setScale(0.5);
    this.inventoryButton.setOrigin(1, 0);
    this.inventoryButton.depth = 220;

    this.inventoryButton.setInteractive({cursor: 'pointer'});
    this.inventoryButton.name = "inventory";
    this.inventoryButton.on('pointerdown', () => {
      this.events.emit('menuitemclicked', this.inventoryButton);
    });

    this.notesButton = this.add.image(this.width, this.height / 25 + 32 , 'notesButton');
    this.notesButton.setScale(0.5);
    this.notesButton.setOrigin(1, 0);
    this.notesButton.depth = 220;

    this.notesButton.setInteractive({cursor: 'pointer'});
    this.notesButton.name = "notes";
    this.notesButton.on('pointerdown', () => {
      this.events.emit('menuitemclicked', this.notesButton);
    });



    this.scene.bringToTop();
  }

  drawToolBar() {
    const bar = this.add.graphics(0, 0);
    bar.fillStyle(0xAAAA77, 0.9);
    const rect = new Phaser.Geom.Rectangle(0, 3 * this.height / 4, this.width, this.height / 4);
    bar.fillRectShape(rect);
    bar.setInteractive({
      hitArea: rect,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });
  }

  drawSideBar() {
    const bar = this.add.graphics(0, 0);
    bar.fillStyle(0x424242, 0.9);
    const rect = new Phaser.Geom.Rectangle(
      this.width - 32,
      this.height / 25,
      32,
      24 * this.height / 25);
    bar.fillRectShape(rect);

    bar.setInteractive({
      hitArea: rect,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: 'default'
    });

    bar.depth = 210;

    return bar;
  }


}