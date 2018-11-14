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

      if(direction[1] === "PAUSE"){
        return {
          meta: true,
          text: "",
          header: "",
          pause: true
        };
      }

      return {
        meta: true,
        text: "",
        header: this.currentHeader
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
    console.log(content);
    console.log(this.issueResponse);
    this.gameState.HUD.dialogueFrame.stack.addPanel({
      header: this.issueResponse ? undefined : content.header,
      body: content.body,
      continuation: this.issueResponse ? undefined : "Continue...",
      continuationCallback: () => { this.sayNext(); }
    });

    if(this.issueResponse) {
      this.issueResponse = false;
    }
  }

  sayDialogue() {
    this.gameState.HUD.dialogueFrame.stack.addPanel({
      header: this.issueResponse ? undefined : this.currentHeader,
      body: this.parse(this.currentText).text,
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

  getFragment() {
    return this.parse(this.currentText);
  }

  // Continue through the script until we hit something that
  // requires user interaction
  sayNext() {

    let fragment = {};

    while(this.canContinue) {
      this.Continue();
      console.log("Current text: ", this.currentText);
      fragment = this.getFragment();

      if(fragment.pause) {
        // If there's a pause command, break out of the loop
        // It'll resume when the callback is fulfilled
        this.gameState.HUD.dialogueFrame.stack.addPanel({
          header: fragment.header,
          body: fragment.text,
          continuation: this.issueResponse ? undefined : "Continue...",
          continuationCallback: () => { this.sayNext(); }
        });
        break;
      }

      if(fragment.meta) {
        continue;
      }

      // If we're here, it means we should display text
      this.gameState.HUD.dialogueFrame.stack.addPanel({
        header: this.issueResponse ? "" : fragment.header,
        body: fragment.text,
      });

      if(this.issueResponse) {
        this.issueResponse = false;
      }
    }

    // If we're here it means we can't continue, so it's either a choice point
    // or it's the end of the script

    if(this.isChoice()) {

      // Show a choice. The callback kicks off the next wave
      // of dialogue

      this.gameState.HUD.dialogueFrame.stack.addPanel({
        header: fragment.header,
        body: fragment.text,
        options: this.currentChoices,
        optionsCallback: (i) => { this.giveResponse(i); }
      });
    } else if (!this.canContinue) {

      // We're at the end of the story. Close it.

      this.gameState.HUD.dialogueFrame.stack.addPanel({
        button: "x",
        buttonCallback: () => {
          this.gameState.HUD.dialogueFrame.stack.clear();
          this.gameState.HUD.hideDialogue();
        }
      });
    }

  }

  giveResponse(choice) {
    this.ChooseChoiceIndex(choice);
    this.issueResponse = true;
    this.sayNext();
  }


}