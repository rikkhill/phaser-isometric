import * as ink from 'inkjs'

export default class DialogueParser extends ink.Story {
  constructor(script, state) {
    super(script);
    this.gameState = state;

    this.currentHeader = null;
    this.issueResponse = false;
    this.dialogueStack = [];

    // Bind external state functions to the story
    this.BindExternalFunction('hasMet', this.gameState.hasMet);
    this.BindExternalFunction('doesKnow', this.gameState.doesKnow);
    this.BindExternalFunction('hasItem', this.gameState.hasItem);
    this.BindExternalFunction('onScale', this.gameState.onScale);

  }

  parseTags() {
    const tags = this.currentTags;
    for(let tag of tags) {
      this.parse(tag);
    }
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

      if(direction[1] === "INCSCALE") {
        this.gameState.incScale(direction[2]);
      }

      if(direction[1] === "DECSCALE") {
        this.gameState.decScale(direction[2]);
      }

      if(direction[1] === "HEADER"){
        this.currentHeader = direction[2];
      }

      if(direction[1] === "NOHEADER"){
        this.currentHeader = "";
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

  isChoice() {
    return !this.canContinue && this.currentChoices.length > 0;
  }

  emitDialogue(content) {
    this.gameState.HUD.dialogueFrame.stack.addPanel(content);
  }

  sayDialogue() {
    this.gameState.HUD.dialogueFrame.stack.addPanel({
      header: this.issueResponse ? undefined : this.currentHeader,
      body: this.currentText,
      continuation: this.issueResponse ? undefined : "Continue...",
      continuationCallback: () => { this.sayNext(); }
    });
  }



  giveChoice() {
    this.gameState.HUD.dialogueFrame.stack.addPanel({
      header: this.currentHeader,
      //body: this.currentText,
      options: this.currentChoices,
      optionsCallback: (i) => { this.giveResponse(i); }
    });
  }

  // Do the next thing in the script
  sayNext() {

    while(this.canContinue) {
      this.Continue();
      this.parseTags();
      this.dialogueStack.unshift({
        header: this.currentHeader,
        body: this.currentText
      });
    }

    while(this.dialogueStack.length > 0) {
      console.log(this.dialogueStack);
      this.emitDialogue(this.dialogueStack.pop());
    }

    if(this.isChoice()) {
      this.giveChoice();
    } /*else {
      this.sayDialogue();
    }*/

   /* } else {
      // Anything here is either a decision point or the end of the script
      if(this.isChoice()) {
        // Make a choice panel in the dialogue stack
        this.giveChoice();

     /*( } else {
        // Say it and end
        this.gameState.HUD.dialogueFrame.stack.addPanel({
          //header: this.currentHeader,
          //body: this.currentText,
          button: "x",
          buttonCallback: () => {
            this.gameState.HUD.dialogueFrame.stack.clear();
            this.gameState.HUD.hideDialogue();
          }
        });
      }
    } */
  }

  giveResponse(choice) {
    this.ChooseChoiceIndex(choice);
    this.issueResponse = true;
    this.sayNext();
    this.issueResponse = false;
    this.sayNext();
  }


}