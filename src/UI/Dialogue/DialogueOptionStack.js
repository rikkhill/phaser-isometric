import 'phaser';
import DialogueOption from './DialogueOption';

// This is the container for dialogue options.
// It is responsible for messaging which options have been selected
// When an option has been selected
export default class DialogueOptionStack extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.width = config.width;
    this.options = config.options;
    this.callback = config.callback;

    this.scene.add.existing(this);

    this.stack = [];

    for(let option of this.options) {

      let dialogueOption = this.scene.add.existing(new DialogueOption({
        scene: this.scene,
        x: 0,
        y: this.height,
        text: option.text,
        value: option.index,
        style: {fontFamily: 'Gill Sans, sans-serif', fontSize: 14, color: '#aaffaa', fontStyle: ''},
        hoverStyle: {fontFamily: 'Gill Sans, sans-serif', fontSize: 14, color: '#448844', fontStyle: ''},
        callback: i => this.selectOption(i)
      }));

      this.add(dialogueOption);

      this.stack.push(dialogueOption);
      this.height += dialogueOption.displayHeight;
    }
  }

  selectOption(i) {
    const selectedOption = this.stack.splice(i, 1)[0];
    this.stack.forEach((c) => c.destroy());

    this.scene.tweens.add({
      targets: selectedOption,
      y: 0,
      duration: 100,
      onComplete: () => {
        selectedOption.destroy();
        this.height = 0; //newText.displayHeight;
        this.parentContainer.recalculateHeight();

        if(this.callback) {
          this.callback(i);
        }
      }
    });
  }
}