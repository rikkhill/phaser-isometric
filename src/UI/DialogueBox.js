import 'phaser';
import { ClickableText, Button } from './DialogueElements';
import SlidingContainer from './SlidingContainer';

export default class DialogueBox extends SlidingContainer {

  constructor(config){
    super(config);
    this.scene = config.scene;
    this.width = config.width;
    this.height = 200;

    this.dialogueControl = null;

    this.scene.add.existing(this);

    window.db = this;


    let box = new Phaser.Geom.Rectangle(0, 0, this.width, 200);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0x202020, 0.9);
    graphics.fillRectShape(box);
    this.copy = this.scene.add.text(
      10,
      10,
      "",
      {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#d9d9d9',
        wordWrap: {
          width: this.width - 20,
          useAdvancedWrap: true
        }
      });
    this.add(graphics);
    this.add(this.copy);
    this.depth = 200;
  }

  say(text) {
    this.copy.setText(text);
    this.addClearButton("x");
  }

  converse(text, callback) {
    this.clearAll();
    this.copy.setText(text);
    this.addOptions([{text: "...", index: -1}], callback);
  }

  choice(text, options, callback) {
    this.clearAll();
    this.copy.setText(text);
    this.addOptions(options, callback)
  }

  addOptions(options, callback) {
    let yOffset = 0;

    this.dialogueControl = this.scene.add.container(20, this.copy.y + this.copy.displayHeight + 5);
    this.add(this.dialogueControl);

    for(let option of options) {
      let clickText = new ClickableText({
        scene: this.scene,
        x: 20,
        y: yOffset,
        text: option.text,
        value: option.index,
        style: {color: '#aaffaa', fontStyle: ""},
        hoverStyle: {color: '#448844', fontStyle: 'bold'},
        callback: callback
      });

      this.dialogueControl.add(clickText);
      yOffset += clickText.displayHeight + 5;
    }
  }



  clearAll() {
    this.copy.setText("");
    if(this.dialogueControl) {
      this.dialogueControl.destroy();
    }

  }

  addClearButton(text) {
    const byeByeButton = new Button({
      x: 20,
      y: 100,
      scene: this.scene,
      width: this.width - 40,
      height: 40,
      text: text,
      originalColor: 0x444444,
      hoverColor: 0x888888,
      downColor: 0xaaaaaa,
      originalBorder: 0xdddd33,
      hoverBorder: 0xffff33,
      downBorder: 0x888800,
      alpha: 0.8,
      callback: () => {
        this.copy.setText("");
        byeByeButton.destroy();
        this.clearAll();
        this.slideClosed();
      }
    });

    this.scene.add.existing(byeByeButton);
    this.add(byeByeButton);
    byeByeButton.depth = 500;
  }
}