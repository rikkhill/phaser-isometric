import * as inkjs from "inkjs";

export default class DialogueRunner {
  constructor(story) {
    this.story = new inkjs.Story(story);
  }
}