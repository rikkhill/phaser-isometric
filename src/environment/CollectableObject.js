import Interactable from './Interactable';

// An interactable object where the default behaviour on-click is to
// be removed from the scene and added to the inventory
export default class CollectableObject extends Interactable {
  constructor(config) {
    super(config);

  }
}