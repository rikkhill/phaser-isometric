import 'phaser';
import { ClickableText } from './DialogueElements';

export default class DialogueBox extends Phaser.GameObjects.Container {

  constructor(config){
    super(config.scene, config.x, config.y);
    this.scene = config.scene;
    this.width = config.width;
    this.height = 200;

    this.scene.add.existing(this);


    console.log("DialogueBox Created!");
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
          width: this.width,
          useAdvancedWrap: true
        }
      });
    this.add(graphics);
    this.add(this.copy);
    this.depth = 200;

    const clickableText = new ClickableText({
      scene: this.scene,
      x: 20,
      y: 40,
      text: "I like monkeys!",
      style: {color: "#aaffaa", fontStyle: ""},
      hoverStyle: {color: "#448844", fontStyle: "bold"},
      callback: () => {
        this.say("MONKEYS!");
      }
    });
    this.add(clickableText);

  }

  say(text) {
    this.copy.setText(text);
  }
}