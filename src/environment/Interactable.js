import 'phaser';

export default class Interactable extends Phaser.GameObjects.Image {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    this.key = config.key;
    this.depth = config.level * config.y;
    this.scene.add.existing(this);
    this.standpoint = config.standpoint;
    this.facing = config.facing;
    this.interaction = config.interaction;

    this.setInteractive({cursor: "pointer"});
    this.on("pointerdown", () => {
      this.scene.events.emit('interactableclicked', this);
    });

    if(typeof this.scale !== 'undefined') {
      this.setScale(scale);
    }
    this.scene.add.existing(this);

  }

}