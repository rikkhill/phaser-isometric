import 'phaser';
import {objToPoints} from '../spaceHelpers';
import {pointsToGeomPoints} from '../spaceHelpers';

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
    this.mapProjection = config.mapProjection;
    this.shotAreas = [];
    this.mapWidth = null;
    this.mapHeight = null;
    this.centerX = null;
    this.centerY = null;

    this.mapBuilt = false;

    this.point = new IsoPointFactory(this);

    // This probably shouldn't be null after construction
    this.mapData = null;

    // We're grown-ups with debug graphics now!
    this.debugGraphics = null;

  }

  // Converts tileSpace into isoSpace
  project (coords) {
    const projX = this.centerX + ((coords.x - coords.y) * this.tileWidthHalf);
    const projY = this.centerY + ((coords.x + coords.y) * this.tileHeightHalf);

    return {x: projX, y: projY};
  };

  // Converts isoSpace into tileSpace
  unproject(coords) {
    const xmy = (coords.x - this.centerX) / this.tileWidthHalf;
    const xpy = (coords.y - this.centerY) / this.tileHeightHalf;

    return {x: (xmy + xpy) / 2, y: (xmy - xpy) / -2};
  };

  // I am fairly sure having non-standard tileWidths and tileHeights
  // will cause this math to be wrong
  tileToOrtho(coords) {
    return {x: coords.x * this.tileHeight, y: coords.y * this.tileHeight};
  }

  orthoToTile(coords) {
    return {x: coords.x / this.tileHeight, y: coords.y / this.tileHeight};
  }

  // Draws the map, layer by layer, onto the scene canvas
  buildMap() {

    if(this.mapBuilt){
      return false;
    }

    let tileIndex, tileId;

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

        for(let obj of layer.objects) {

          let polygonPoints = this.point
            .fromOrthoList(objToPoints(obj))
            .map(c => c.world());

          // Polygon for mouseover purposes
          this.placePolygon({
            points: polygonPoints,
            depth: this.mapHeight * (i + 1),
            cursor: 'crosshair',
            alpha: 0.001});
        }

        continue;
      }

      for(let y = 0; y < this.mapHeight; y++) {
        for(let x = 0; x < this.mapWidth; x++) {
          tileId = layerData[tileIndex] - 1;
          // Add the image iff it's a real tile
          if(tileId >= 0) {
            let coords = this.point.fromTile({x, y}).world();
            let tile = this.add.image(
              coords.x,
              coords.y + this.tileHeightHalf, // If we don't do this
              'tiles',                        // the navmesh won't align
              tileId);

            // Guarantee the highest layers get the highest depth
            tile.depth = (coords.y) * (i + 1);
          }

          tileIndex++;
        }
      }
    }

    this.mapBuilt = true;
    return true;
  }

  // If our map is staggered instead of square
  // we have to built it differently
  buildStaggeredMap() {

    if(this.mapBuilt) {
      return false;
    }

    let tileIndex, tileId;

    this.mapWidth = this.mapData.layers[0].width;
    this.mapHeight = this.mapData.layers[0].height;
    this.centerX = this.mapWidth * this.tileWidthHalf;
    this.centerY = (this.mapHeight * this.tileHeightHalf) / 2;

    for (const [i, layer] of this.mapData.layers.entries()) {

      let layerData = layer.data;
      tileIndex = 0;

      // TODO: refactor this into a switch/case or something

      // If it's a navmesh layer, build the mesh
      // but skip the rendering process
      if(layer.name === "navmesh") {
        this.navMesh = this.navMeshPlugin.buildMeshFromTiled("mesh", layer, 10);

        for(let obj of layer.objects) {

          let polygonPoints = this.point
            .fromOrthoList(objToPoints(obj));

          // Polygon for mouseover purposes
          this.placePolygon({
            points: polygonPoints,
            depth: this.mapHeight * (i + 2),
            cursor: 'crosshair',
            alpha: 0.001});
        }

        continue;
      }

      if(layer.name === "shotarea") {
        for(let obj of layer.objects) {
          console.log(obj);
          let focus = this.point.fromOrtho(obj.properties);
          let points = objToPoints(obj);
          this.registerShotArea(points, focus);
        }
        continue;
      }

      for(let y = 0; y < this.mapHeight; y++) {
        let even = y % 2 === 0;
        let xOffset = even ? 0 : this.tileWidthHalf;
        let yOffset = y * this.tileHeightHalf;
        for(let x = 0; x < this.mapWidth; x++) {
          tileId = layerData[tileIndex] - 1;
          // Add the image iff it's a real tile
          if(tileId >= 0) {
            let tile = this.add.image(
              x * this.tileWidth  + xOffset + this.tileWidthHalf,
              y * this.tileHeight - yOffset + this.tileHeightHalf,
              'tiles',
              tileId);

            // Guarantee the highest layers get the highest depth
            tile.depth = (y * this.tileHeight) * (i + 1);
          }

          tileIndex++;
        }
      }
    }

    this.mapBuilt = true;
    return true;
  }

  registerShotArea(points, focus) {
    this.shotAreas.push({bounds: new Phaser.Geom.Polygon(points), focus: focus});
  }

  checkShotAreas(sprite) {
    for(let area of this.shotAreas) {
      if(Phaser.Geom.Polygon.Contains(area.bounds, sprite.x, sprite.y)) {
        this.cameras.main.scrollX = area.focus.x;
        //this.cameras.main.centerY = area.focus.y;
      }
    }
  }


  // Place an invisible polygon on a graphic overlay
  placePolygon(config) {
    const graphic = this.add.graphics(0, 0);
    graphic.fillStyle(0x44ff44);
    graphic.alpha = config.alpha;
    graphic.fillPoints(config.points);
    graphic.depth = config.depth;
    graphic.setInteractive({
      hitArea: new Phaser.Geom.Polygon(config.points),
      hitAreaCallback: Phaser.Geom.Polygon.Contains,
      cursor: config.cursor || "default",
    });
    return graphic;
  }

  // Get a path along the NavMesh
  getPath(startPoint, endPoint) {
    // These should be IsoPoints, whose native representations
    // are orth coordinates

    const path = this.navMesh.findPath(startPoint, endPoint);

    // Return early if we don't have a path
    if(path === null) {
      return [];
    }

    return path.map((c) => {
      return this.point.fromOrtho(c);
    });
  }



  // Debug methods

  enableDebug() {
    // Stick the scene in the browser namespace for debugging
    window.scene = this;
    if (!this.debugGraphics) {
      this.debugGraphics = this.add.graphics(0, 0);
    }

    this.debugGraphics.visible = true;
    this.debugGraphics.alpha = 0.4
  }

  disableDebug() {
    if (this.debugGraphics) this.debugGraphics.visible = false;
  }

  debugDrawMesh({
                  drawCentroid = true,
                  drawBounds = false,
                  drawNeighbors = true,
                  drawPortals = true,
                  palette = [0x00a0b0, 0x6a4a3c, 0xcc333f, 0xeb6841, 0xedc951]
                } = {}) {
    if (!this.debugGraphics) return;

    this.debugGraphics.depth = 5 * this.tileWidth * this.mapWidth;

    const navPolys = this.navMesh.navMesh.getPolygons();

    navPolys.forEach(poly => {
      const color = palette[poly.id % palette.length];
      this.debugGraphics.fillStyle(color);

      const points = this.point.fromOrthoList(poly.getPoints()).map(c => c.world());

      this.debugGraphics.fillPoints(points, true);

      const centroid = this.point.fromOrtho(poly.centroid).world();

      if (drawCentroid) {
        this.debugGraphics.fillStyle(0x000000);
        this.debugGraphics.fillCircle(centroid.x, centroid.y, 4);
      }

      if (drawBounds) {
        this.debugGraphics.lineStyle(1, 0xffffff);
        // N.B. this is wrong because we haven't figured out how to
        // transform the bounding radius yet
        this.debugGraphics.strokeEllipse(centroid.x, centroid.y, poly.boundingRadius, poly.boundingRadius/2);
      }

      if (drawNeighbors) {
        this.debugGraphics.lineStyle(2, 0x000000);
        poly.neighbors.forEach(n => {

          const n_centroid = this.point.fromOrtho(n.centroid).world();

          this.debugGraphics.lineBetween(
            centroid.x,
            centroid.y,
            n_centroid.x,
            n_centroid.y
          );
        });
      }

      if (drawPortals) {
        this.debugGraphics.lineStyle(10, 0x000000);
        poly.portals.forEach(portal => {
          let start = this.point.fromOrtho(portal.start).world();
          let end = this.point.fromOrtho(portal.end).world();
          this.debugGraphics.lineBetween(start.x, start.y, end.x, end.y)
        });
      }
    });
  }

  debugDrawPath(path, color = 0x00ff00, thickness = 2, alpha = 1) {
    if (!this.debugGraphics) return;

    if (path && path.length) {
      // Draw line for path
      this.debugGraphics.lineStyle(thickness, color, alpha);
      this.debugGraphics.strokePoints(path);

      // Draw circle at start and end of path
      this.debugGraphics.fillStyle(color, alpha);
      const d = 1.2 * thickness;
      this.debugGraphics.fillCircle(path[0].x, path[0].y, d, d);

      if (path.length > 1) {
        const lastPoint = path[path.length - 1];
        this.debugGraphics.fillCircle(lastPoint.x, lastPoint.y, d, d);
      }
    }
  }


}

// Factory method for making points
// Since we're working in three different coordinate systems,
// (the tile space, the orthogonal space,and the isometric coordinates),
// we will make the deliberate choice to represent all points as orthogonal
// coordinates, and then have conversion methods to and from other spaces
class IsoPointFactory {
  constructor(scene) {
    this.scene = scene;

    if(this.scene.mapProjection === "square") {
      this.fromWorld = this.fromIsoWorld;
      this.fromClick = this.fromIsoClick;
    } else {
      this.fromWorld = this.fromOrtho;
      this.fromClick = this.fromOrthoClick;
    }
  }

  fromIsoWorld(point) {
    const p = this.scene.tileToOrtho(this.scene.unproject(point));
    return new IsoPoint(p.x, p.y, this.scene);
  }

  fromIsoClick(e) {
    const p = this.scene.tileToOrtho(this.scene.unproject({x: e.worldX, y: e.worldY}));
    return new IsoPoint(p.x, p.y, this.scene);
  }

  fromOrthoClick(e) {
    return new IsoPoint(e.worldX, e.worldY, this.scene);
  }

  fromTile(point) {
    const p = this.scene.tileToOrtho(point);
    return new IsoPoint(p.x, p.y, this.scene);
  }

  fromOrtho(point) {
    return new IsoPoint(point.x, point.y, this.scene);
  }

  fromOrthoList(list) {
    return list.map(point => this.fromOrtho(point));
  }
}

class IsoPoint {
  constructor(x, y, scene) {
    this.x = x;
    this.y = y;
    this.scene = scene;

    if(this.scene.mapProjection === "square"){
      this.world = this.isoWorld;
    } else {
      this.world = this.ortho;
    }
  }

  isoWorld() {
    return this.scene.project(this.scene.orthoToTile(this));
  }

  tile() {
    return this.scene.orthoToTile(this);
  }

  ortho() {
    return this;
  }
}