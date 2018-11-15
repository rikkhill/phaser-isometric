import 'phaser';
import DialogueParser from '../system/DialogueParser';

export default class InventoryItem extends Phaser.GameObjects.Image {
  constructor(config) {
    console.log(config);
    super(config.scene, config.x, config.y, config.key);
    this.name = config.name;
    this.description = config.description;
    this.script = config.script;

    this.setInteractive({cursor: 'pointer'});
    this.on('pointerdown', () => {
      console.log("Clicked on " + this.name);
      if(this.script) {
        this.scene.showDialogue();
        (new DialogueParser(this.script, this.scene.state)).sayNext();
      }
    });
  }
}