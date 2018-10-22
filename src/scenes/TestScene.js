import TestBaseScene from "./TestBaseScene";

export default class TestScene extends TestBaseScene {
  constructor(config) {
    super({
      key: "TestScene",
    });


  }

  preload() {
    console.log("Test preloaded", this.wobble);
  }

  create() {
    console.log("Test created", this.wobble);
  }


}
