// Object for managing the state of the game

export default class GameState {
  constructor(HUD) {


    this.HUD = HUD;

    // Items in the inventory
    this.inventory = {};

    // Whether the PC has met other characters
    this.met = {};

    // Whether the character has knowledge of things
    this.knows = {};

    // Where the character lies on various scales
    this.scales = {};


    // We have to declare methods like this to guarantee
    // it'll be bound to this object no matter where
    // it's called

    this.meets = (character) => {
      this.met[character] = true;
      return true;
    };

    this.hasMet = (character) => {
      return this.met.hasOwnProperty(character);
    };

    this.learns = (knowledgeKey, knowledge) => {
      this.knows[knowledgeKey] = knowledge;
      return true;
    };

    this.doesKnow = (knowledge) => {
      return this.knows.hasOwnProperty(knowledge);
    };

    this.isGiven = (itemKey, itemConfig) => {
      this.inventory[itemKey] = {
        key: itemKey + "Inventory",
        ...itemConfig
      };

      this.HUD.inventory.drawInventory(this.inventory);
      return true;
    };

    this.hasItem = (itemKey) => {
      return this.inventory.hasOwnProperty(itemKey);
    };

    this.incScale = (scaleKey) => {
      if(!this.scales.hasOwnProperty(scaleKey)) {
        this.scales[scaleKey] = 0;
      }

      this.scales[scaleKey]++;
    };

    this.decScale = (scaleKey) => {
      if(!this.scales.hasOwnProperty(scaleKey)) {
        this.scales[scaleKey] = 0;
      }

      this.scales[scaleKey]--;
    };

    this.onScale = (scaleKey) => {
      if(!this.scales.hasOwnProperty(scaleKey)) {
        this.scales[scaleKey] = 0;
      }

      return this.scales[scaleKey];

    };

    window.state = this;

  }
}