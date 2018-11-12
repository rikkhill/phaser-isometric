import 'phaser';
import DialogueOptionStack from './DialogueOptionStack';
import {DialogueButton} from "./DialogueButton";
import DialogueOption from "./DialogueOption";

export default class DialoguePanel extends Phaser.GameObjects.Container {

  constructor(config){
    super(config.scene, config.x, config.y);
    this.width = config.width;
    this.headerText = config.header;
    this.bodyText = config.body;
    this.continuation = config.continuation;
    this.continuationCallback = config.continuationCallback;
    this.optionsText = config.options;
    this.optionsCallback = config.optionsCallback;
    this.buttonText = config.button;
    this.buttonCallback = config.buttonCallback;

    this.scene.add.existing(this);

    // Add a background box
    let box = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    let graphics = this.scene.add.graphics(0, 0);
    graphics.fillStyle(0x202020, 0.9);
    graphics.fillRectShape(box);

    this.add(graphics);

    // Add header
    if(this.headerText) {
      this.header = this.scene.add.text(
        10, this.displayHeight + 10,
        this.headerText,
        {
          fontFamily: 'Almendra, serif',
          fontSize: 20,
          color: '#CCCCCC',
          fontStyle: 'bold',
          wordWrap: {
            width: this.width - 20,
            useAdvancedWrap: true
          }
        });

      this.add(this.header);

      this.height += this.header.displayHeight + 10;

    }

    // Add body text
    if(this.bodyText) {
      this.body = this.scene.add.text(
        30, this.displayHeight + 5,
        this.bodyText,
        {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: 14,
          color: '#CCCCCC',
          fontStyle: '',
          wordWrap: {
            width: this.width - 50,
            useAdvancedWrap: true
          }
        });

      this.add(this.body);

      this.height += this.body.displayHeight + 10;
    }

    // Add body text
    if(this.continuation) {
      this.continueOption = new DialogueOption({
        scene: this.scene,
        x: this.width / 2,
        y: this.height,
        text: "...",
        value: "whatever",
        style: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: 30,
          color: '#aaffaa',
          fontStyle: "",
          align: 'center'
        },
        hoverStyle: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: 30,
          color: '#448844',
          fontStyle: 'bold',
          align: 'center'
        },
        callback: this.continuationCallback
      });

      this.scene.add.existing(this.continueOption);
      this.add(this.continueOption);

      this.height += this.continueOption.displayHeight + 10;
    }

    // Add options
    if(this.optionsText) {
      this.options = new DialogueOptionStack({
        scene: this.scene,
        x: 30,
        y: this.displayHeight + 5,
        width: this.width,
        options: this.optionsText,
        callback: this.optionsCallback
      });

      this.add(this.options);
      this.height += this.options.displayHeight + 10;
    }

    // Add button
    if(this.buttonText) {
      this.button = new DialogueButton({
        x: 30,
        y: this.displayHeight + 5,
        scene: this.scene,
        width: this.width - 60,
        height: 40,
        text: this.buttonText,
        originalColor: 0x444444,
        hoverColor: 0x888888,
        downColor: 0xaaaaaa,
        originalBorder: 0xdddd33,
        hoverBorder: 0xffff33,
        downBorder: 0x888800,
        alpha: 0.8,
        callback: () => {
          if(this.buttonCallback) {
            this.buttonCallback();
          }
        }
      });

      this.scene.add.existing(this.button);
      this.add(this.button);

      this.height += this.button.displayHeight + 10;
    }

  }

  recalculateHeight() {
    console.log("Height recalculated in panel");

    let height = 0;

    if(this.header) {
      height += this.header.displayHeight + 10;
    }

    if(this.body) {
      height += this.body.displayHeight + 5
    }

    if(this.continuationOption) {
      height += this.continueOption.displayHeight + 10;
    }

    if(this.options) {
      height += this.options.displayHeight + 10;
    }

    if(this.button) {
      height += this.button.displayHeight + 10;
    }

    this.height = height;

    this.parentContainer.recalculateHeight();
  }
}