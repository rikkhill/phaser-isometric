import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";
import BridgeScene from "./scenes/BridgeScene";
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
    scene: BridgeScene,

};

window.game = new Phaser.Game(config);
window.game.scene.start("BridgeScene");

/*

let scene;



function preload ()
{
    scene = this;
    this.load.json('map', 'assets/isomap_1.json');
    this.load.spritesheet('tiles', 'assets/grassland_tiles.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('zombie', 'assets/skeleton_knight.png', { frameWidth: 128, frameHeight: 128});
}

function create ()
{

    buildMap();

}

function blahbuildMap() {
    //  Parse the data out of the map
    const data = scene.cache.json.get('map');

    const tileWidth = data.tilewidth;
    const tileHeight = data.tileheight;
    const tileWidthHalf = tileWidth / 2;
    const tileHeightHalf = tileHeight / 2;



    scene.project = (x, y) => {
        const projX = centerX + ((x - y) * tileWidthHalf);
        const projY = centerY + ((x + y) * tileHeightHalf);

        return [projX, projY];
    };

    scene.unproject = (projX, projY) => {
        const xmy = (projX - centerX) / tileWidthHalf;
        const xpy = (projY - centerY) / tileHeightHalf;

        return [(xmy + xpy) / 2, (xmy - xpy) / -2];
    };


    let mapWidth, mapHeight, centerX, centerY, tileIndex, tileId;

    mapWidth = data.layers[0].width;
    mapHeight = data.layers[0].height;
    centerX = mapWidth * tileWidthHalf;
    centerY = (mapHeight * tileHeightHalf) / 2;

    // Weirdly, take a tile and convert its centre to
    // its centre on an orthographic projection
    function tileToOrtho(x, y) {
        return [x * tileHeight, y * tileHeight];
    }

    function orthoToTile(x, y) {
        return [x / tileHeight, y / tileHeight];
    }

    function plotProjectionFromOrtho(x, y) {
        let [tileX, tileY] = orthoToTile(x, y);
        let [projX, projY] = scene.project(tileX, tileY);
        let graphics = scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        let circle = graphics.fillCircleShape(new Phaser.Geom.Circle(projX, projY, 10));
        circle.depth = 100000;
    }

    function plotProjectionFromTile(tileX, tileY) {
        let [projX, projY] = scene.project(tileX, tileY);
        let graphics = scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        let circle = graphics.fillCircleShape(new Phaser.Geom.Circle(projX, projY, 10));
        circle.depth = 100000;
    }

    for (const [i, layer] of data.layers.entries()) {

        let layerData = layer.data;
        tileIndex = 0;

        if(layer.name === "navmesh") {
            scene.navMesh = scene.navMeshPlugin.buildMeshFromTiled("mesh", layer, 10);

            let startX = 0, startY = 0, endX = 0, endY = 14;

            let orthoStart = tileToOrtho(startX, startY);
            let orthoEnd = tileToOrtho(endX, endY);
            const path = scene.navMesh.findPath({x: orthoStart[0], y: orthoStart[1]},
                {x: orthoEnd[0], y: orthoEnd[1]});

            continue;
        }

        for(let y = 0; y < mapHeight; y++) {
            for(let x = 0; x < mapWidth; x++) {
                tileId = layerData[tileIndex] - 1;
                // Add the image iff it's a real tile
                if(tileId >= 0) {
                    let [tx, ty] = scene.project(x, y);
                    let tile = scene.add.image(tx, ty, 'tiles', tileId).setInteractive();

                    // Guarantee the highest layers get the highest depth
                    tile.depth = (ty) * (i + 1);
                }

                tileIndex++;
            }
        }
    }
    let [startX, startY] = scene.project(1, 5);

    const zomg = new MovableSprite({scene: scene, x: startX, y: startY, key: 'zombie'});

    // Centre the camera on the scene
    scene.cameras.main.scrollX = mapWidth / 2 + 100;
    scene.cameras.main.scrollY = mapHeight / 2;
    scene.cameras.main.zoom = 0.8;

    scene.input.on('pointerdown', function(pointer) {
      let wX = pointer.worldX;
      let wY = pointer.worldY;
      let [tileX, tileY] = scene.unproject(wX, wY);
      const direction = cardinal;
      zomg.move(wX, wY);


    }, scene);


}*/
