import 'phaser';

// Base class for isometric map scenes
export default class IsoScene extends Phaser.Scene {
  constructor(config) {
    super({
      key: config.key,
    });

    // Tile dimensions
    this.tileWidth = config.tileWidth;
    this.tileHeight = config.tileHeight;
    this.tileWidthHalf = this.tileWidth / 2;
    this.tileHeightHalf = this.tileHeight / 2;
    this.mapWidth = null;
    this.mapHeight = null;
    this.centerX = null;
    this.centerY = null;

    // This probably shouldn't be null after construction
    this.mapData = null;
  }

  // Converts tileSpace into isoSpace
  project (x, y) {
    const projX = this.centerX + ((x - y) * this.tileWidthHalf);
    const projY = this.centerY + ((x + y) * this.tileHeightHalf);

    return [projX, projY];
  };

  // Converts isoSpace into tileSpace
  unproject(projX, projY) {
    const xmy = (projX - this.centerX) / this.tileWidthHalf;
    const xpy = (projY - this.centerY) / this.tileHeightHalf;

    return [(xmy + xpy) / 2, (xmy - xpy) / -2];
  };

  // I am fairly sure having non-standard tileWidths and tileHeights
  // will cause this math to be wrong
  tileToOrtho(x, y) {
    return [x * this.tileHeight, y * this.tileHeight];
  }

  orthoToTile(x, y) {
    return [x / this.tileHeight, y / this.tileHeight];
  }

  // Draws the map, layer by layer, onto the scene canvas
  buildMap() {

    let tileIndex, tileId;
    console.log("Map data at buildMap() run:", this.mapData);

    this.mapWidth = this.mapData.layers[0].width;
    this.mapHeight = this.mapData.layers[0].height;
    this.centerX = this.mapWidth * this.tileWidthHalf;
    this.centerY = (this.mapHeight * this.tileHeightHalf) / 2;

    for (const [i, layer] of this.mapData.layers.entries()) {

      let layerData = layer.data;
      tileIndex = 0;

      // If it's a navmesh layer, build the mesh
      // but skip the rendering process
      if(layer.name === "navmesh") {
        this.navMesh = this.navMeshPlugin.buildMeshFromTiled("mesh", layer, 10);
        continue;
      }

      for(let y = 0; y < this.mapHeight; y++) {
        for(let x = 0; x < this.mapWidth; x++) {
          tileId = layerData[tileIndex] - 1;
          // Add the image iff it's a real tile
          if(tileId >= 0) {
            let [tx, ty] = this.project(x, y);
            let tile = this.add.image(tx, ty, 'tiles', tileId);

            // Guarantee the highest layers get the highest depth
            tile.depth = (ty) * (i + 1);
          }

          tileIndex++;
        }
      }
    }
  };

}
