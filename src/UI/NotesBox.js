import 'phaser';
import SlidingContainer from './SlidingContainer';

export default class NotesBox extends SlidingContainer {

  constructor(config){
    super(config);
    this.name = 'notes';
    this.scene = config.scene;
    this.width = config.width;
    this.height = config.height;
    this.margin = this.width / 10;


    this.scene.add.existing(this);


    let box = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0xd2d2d2, 0.9);
    graphics.fillRectShape(box);
    this.add(graphics);

    this.depth = 200;

    this.title = this.scene.add.text(
      this.width / 2 - 16,
      0,
      "BEVIN'S NOTES",
      {
        fontFamily: 'Almendra, serif',
        fontSize: 16,
        color: '#2a2a2a',
        fontStyle: 'bold',
        wordWrap: {
          width: this.width - this.margin * 2,
          useAdvancedWrap: true
        }
      }
    );

    this.title.setOrigin(0.5, 0);

    this.add(this.title);



  }

  drawNotes(notes) {
    for(let [i, itemKey] of Object.keys(notes).entries()) {
      // Write clues in the notes section
      console.log(itemKey, notes[itemKey]);

    }

  }

}