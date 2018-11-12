import * as ink from 'inkjs'

export default class DialogueParser extends ink.Story {
  constructor(script, state, HUD) {
    super(script);
    this.gameState = state;

    this.HUD = HUD;

    this.currentHeader = null;

    // Bind external state functions to the story
    this.BindExternalFunction('hasMet', this.gameState.hasMet);
    this.BindExternalFunction('doesKnow', this.gameState.doesKnow);
    this.BindExternalFunction('hasItem', this.gameState.hasItem);

  }

  // Takes story content and parses it.
  // Controls state-setting, cutscenes, etc...
  parse(content) {
    const direction = content.match(/^>>> ([A-Z]+) ([a-zA-Z_]+) ?(.*)/);

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

      if(direction[1] === "SETHEADER"){
        this.currentHeader = direction[2];
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
      text: content,
      header: this.currentHeader
    };

  }

  // Do the next thing in the script
  sayNext() {

    // Keep parsing the script until we come to something we need to display
    if(this.canContinue) {
      do {
        this.Continue();
      } while(this.parse(this.currentText).meta && this.canContinue);
    }

    // Check again if this can continue
    if(this.canContinue) {
      // This MUST be a fragment of regular dialogue
      this.HUD.dialogueFrame.stack.addPanel({
        header: this.currentHeader,
        body: this.currentText,
        continuation: skipContinuation ? undefined : "continue...",
        continuationCallback: () => {
          this.sayNext()
        }
      });

    } else {
      // Anything here is either a decision point or the end of the script
      if(this.currentChoices.length > 0) {

        // Make a choice panel in the dialogue stack
        this.HUD.dialogueFrame.stack.addPanel({
          header: this.currentHeader,
          options: this.currentChoices,
          optionsCallback: (i) => { this.giveResponse(i); }
        });
      } else {
        // Say it and end
        this.HUD.dialogueFrame.stack.addPanel({
          header: this.currentHeader,
          body: this.currentText,
          button: "x",
          buttonCallback: () => {
            this.HUD.dialogueFrame.stack.clear();
            this.HUD.hideDialogue();
          }
        });
      }
    }
  }

  giveResponse(choice) {
    this.ChooseChoiceIndex(choice);
    this.sayNext();
  }


}