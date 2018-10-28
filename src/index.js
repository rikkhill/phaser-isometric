import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";
import BridgeScene from "./scenes/BridgeScene";
import FourCheeseScene from "./scenes/FourCheeseScene";
import WideScene from "./scenes/WideScene";
import TestScene from "./scenes/TestScene";
import MovableSprite from "./MovableSprite";
import {cardinal} from './spaceHelpers';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
      scene: [
        {
          key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
          plugin: PhaserNavMeshPlugin, // Class that constructs plugins
          mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
          start: true
        }
      ]
    },
    scene: [BridgeScene, FourCheeseScene, WideScene]

};

window.game = new Phaser.Game(config);
//game.scene.start('FourCheeseScene', {a: "yo", b: "dude"});
