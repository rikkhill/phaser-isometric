import Interactable from './Interactable';

// An interactable object where the default behaviour on-click is to
// be removed from the scene and added to the inventory
export default class CollectableObject extends Interactable {
  constructor(config) {
    super(config);
    this.itemConfig = config.itemConfig;

    this.pickupLine = config.pickupLine;

    this.interaction = () => {
      this.scene.HUD.dialogue.slideOpen();
      this.scene.HUD.dialogue.say(this.pickupLine);
      this.scene.state.isGiven(this.key, this.itemConfig);
      this.destroy();
    };

  }
}