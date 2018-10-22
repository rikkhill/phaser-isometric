import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";

// Base class for isometric map scenes
export default class TestBaseScene extends Phaser.Scene {
  constructor(config) {
    super({
      key: config.key,
    });

    this.wobble = "wibble";

  }

}
