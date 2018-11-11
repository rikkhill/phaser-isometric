import Interactable from './Interactable';

// An interactable object where the default behaviour on-click is to
// be removed from the scene and added to the inventory
export default class CollectableObject extends Interactable {
  constructor(config) {
    super(config);
    this.itemConfig = config.itemConfig;

    this.pickupLine = config.pickupLine;

    // Need some persistent reference to HUD for the callback
    // because this object will be destroyed before it's run
    const HUD = this.scene.HUD;

    this.interaction = () => {
      this.scene.HUD.showDialogue();
      this.scene.HUD.dialogueFrame.addPanel({
        body: this.pickupLine,
        button: "x",
        buttonCallback: () => {
          HUD.dialogueFrame.stack.clear();
          HUD.hideDialogue();
        }
      });
      this.scene.state.isGiven(this.key, this.itemConfig);
      this.destroy();
    };

  }
}