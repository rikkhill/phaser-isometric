// Object for managing the state of the game

export default class GameState {
  constructor() {
    // Still don't know the best way of dealing with this

    // Items in the inventory
    this.inventory = {};

    // Whether the PC has met other characters
    this.met = {};

    // Whether the character has knowledge of things
    this.knows = {};


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

    this.isGiven = (itemKey) => {
      this.inventory[itemKey] = itemKey + "Inventory";
      return true;
    };

    this.hasItem = (itemKey) => {
      return this.inventory.hasOwnProperty(itemKey);
    };

    window.state = this;

  }
}