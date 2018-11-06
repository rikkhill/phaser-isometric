import 'phaser';

export default class Interactable extends Phaser.GameObjects.Image {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    this.depth = config.level * config.y;
    this.scene.add.existing(this);
    this.standpoint = config.standpoint;
    this.facing = config.facing;
    this.interact = () => {
      console.log("Interactable interacted with:", this);
      let HUD = this.scene.scene.get("HUD");
      HUD.dialogue.slideOpen();
      HUD.dialogue.say("It's some green rocks.");
    };

    this.setInteractive({cursor: "pointer"});
    this.on("pointerdown", () => {
      this.scene.events.emit('interactableclicked', this);
    });

  }

}