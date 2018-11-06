import 'phaser';

// A container that has a rest state, and an active state,
// and which "slides" between the two, (i.e. dialogue, inventory, etc)

export default class SlidingContainer extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.scene = config.scene;
    this.closedX = config.x;
    this.closedY = config.y;
    this.openX = config.openX;
    this.openY = config.openY;
    this.inTransition = false;
    this.open = false;
  }

  slideClosed() {
    if(!this.open) {
      return false;
    }

    this.tween = this.scene.tweens.add({
      targets: this,
      x: this.closedX,
      y: this.closedY,
      duration: 300,
      onStart: () => {
        this.inTransition = true;
      },
      onComplete: () => {
        this.inTransition = false;
        this.open = false;
      }
    });

  }

  slideOpen() {
    if(this.open) {
      return false;
    }

    this.tween = this.scene.tweens.add({
      targets: this,
      ease: 'Cubic',
      x: this.openX,
      y: this.openY,
      duration: 300,
      onStart: () => {
        this.inTransition = true;
      },
      onComplete: () => {
        this.inTransition = false;
        this.open = true;
      }
    });
  }
}
