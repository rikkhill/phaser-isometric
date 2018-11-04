import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";
import HUD from "./UI/HUD";
import BridgeScene from "./scenes/BridgeScene";
import FourCheeseScene from "./scenes/FourCheeseScene";
import WideScene from "./scenes/WideScene";
import InteractionScene from "./scenes/InteractionScene";
import GameState from './system/GameState';

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
    scene: [
      HUD,
      InteractionScene,
      BridgeScene,
      FourCheeseScene,
      WideScene
    ]

};

window.game = new Phaser.Game(config);
game.scene.start('InteractionScene', new GameState());
