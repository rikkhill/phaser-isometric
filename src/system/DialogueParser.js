import * as ink from 'inkjs'

export default class DialogueParser extends ink.Story {
  constructor(script, state) {
    super(script);
    this.gameState = state;

    // Bind external state functions to the story
    this.BindExternalFunction('hasMet', this.gameState.hasMet);
    this.BindExternalFunction('doesKnow', this.gameState.doesKnow);
    this.BindExternalFunction('hasItem', this.gameState.hasItem);

  }

  // Takes story content and parses it.
  // Controls state-setting, cutscenes, etc...
  parse(content) {
    const direction = content.match(/^>>> ([A-Z]+) ([a-zA-Z_]+) ?(.*)/);
    console.log(direction);

    if(direction) {
      // This is a command to do something
      if(direction[1] === "MEETS") {
        this.gameState.meets(direction[2]);
      }

      if(direction[1] === "LEARNS"){
        this.gameState.learns(direction[2], direction[3]);
      }

      if(direction[1] === "ISGIVEN"){
        this.gameState.isGiven(direction[2]);
      }

      return {
        meta: true
      };
    }

    const dialogue = content.match(/([A-Z]+): (.*)/);
    if(dialogue) {
      return {
        meta: false,
        speaker: dialogue[1],
        text: dialogue[2]
      };
    }

    // If it hasn't matched with anything, presume it's just text

    return {
      meta: false,
      text: content
    };

  }

  getNext() {
    let fragment;

    // Continue until we return something that isn't metadata
    do {
      fragment = this.parse(this.Continue());
    } while (fragment.meta);

    console.log("Fragment:", fragment);
    return fragment;
  }


}