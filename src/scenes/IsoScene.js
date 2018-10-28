import 'phaser';
import {objToPoints} from '../spaceHelpers';

// Base class for isometric map scenes
export default class IsoScene extends Phaser.Scene {
  constructor(config) {
    super({
      key: config.key,
    });

    this.key = config.key;
    // Tile dimensions
    this.tileWidth = config.tileWidth;
    this.tileHeight = config.tileHeight;
    this.tileWidthHalf = this.tileWidth / 2;
    this.tileHeightHalf = this.tileHeight / 2;
    this.mapProjection = config.mapProjection;
    this.cameraZones = new ZoneHandler("cameraZone", this);
    this.portalZones = new ZoneHandler("portalZone", this);
    this.stageMarkers = {};
    this.mapWidth = null;
    this.mapHeight = null;
    this.centerX = null;
    this.centerY = null;

    // The game state. It will get this on create
    this.state = {};

    // Boolean on whether this map has had all its
    // zones, handlers, navmeshes, listeners, etc.
    // built before. Anything that lives in the object
    // should only be built once, because the object
    // persists, but anything that gets painted to
    // screen needs running multiple times. This is
    // a warning to my future self.
    this.mapBuilt = false;

    this.point = new IsoPointFactory(this);

    // This probably shouldn't be null after construction
    this.mapData = null;

    // We set this flag to true the second we end the scene
    // That way we can prevent async race conditions
    this.ending = false;

    // We're grown-ups with debug graphics now!
    this.debugGraphics = null;
  }

  // The following two methods should probably be put
  // into the IsoPoint and IsoPointFactory objects
  // This is more effort than I currently can be bothered to do

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
  // this whole method is kind of a mess, and represents
  // my gradual understanding of how scene lifecycles work
  // more than it represents a sensible way to build the map
  buildMap() {
    console.log("Building a new map for scene:", this);

    let tileIndex, tileId;

    this.mapWidth = this.mapData.layers[0].width;
    this.mapHeight = this.mapData.layers[0].height;
    this.centerX = this.mapWidth * this.tileWidthHalf;
    this.centerY = (this.mapHeight * this.tileHeightHalf) / 2;
    //console.log("Map data: ", this.mapData);


    for (const [i, layer] of this.mapData.layers.entries()) {

      tileIndex = 0;

      // If it's a navmesh layer, build the mesh
      // but skip the rendering process
      if (layer.name === "navmesh") {

        // If the navmesh doesn't exist already, create it
        if(!this.navMeshPlugin.phaserNavMeshes[this.key + "Mesh"]) {
          this.navMesh = this.navMeshPlugin.buildMeshFromTiled(this.key + "Mesh", layer, 10);
        }

        // While we might want to factor this out one day
        // for the time being we'll keep it here. All the
        // NavMesh polygons need re-drawing every time
        for (let obj of layer.objects) {

          let polygonPoints = this.point
            .fromOrthoList(objToPoints(obj))
            .map(c => c.world());

          // Polygon for mouseover purposes
          this.placePolygon({
            points: polygonPoints,
            depth: this.mapHeight * (i + 1),
            cursor: 'crosshair',
            alpha: 0.001
          });
        }

        continue;
      }

      // If we have a cameraZones layer, write it
      // We may also want to refactor this one day, but
      // camera zones only ever need rendering once, so
      // this is also easy logic
      if (layer.name === "cameraZones") {

        // Camera zones need building once.
        // If the map has already been built, skip this layer
        if(this.mapBuilt) {
          continue;
        }

        for (let obj of layer.objects) {
          if(typeof obj.properties === "undefined") {
            continue;
          }

          let focus = this.point.fromOrtho(obj.properties);
          let points = this.point
            .fromOrthoList(objToPoints(obj))
            .map(c => c.world());

          this.cameraZones.addZone({
            name: obj.properties.name,
            points: points,
            callback: (obj) => {
              this.tweens.add({
                targets: this.cameras.main,
                scrollX: focus.x,
                scrollY: focus.y,
                duration: 500
              });
            }
          });
        }
        continue;
      }


      // Put portalZones on the map
      if (layer.name === "portalZones") {
        for (let obj of layer.objects) {
          if(typeof obj.properties === "undefined") {
            continue;
          }

          let destination = obj.properties.destination;
          //let landingCoords = this.point.fromTile({x: obj.properties.x, y: obj.properties.y});
          let points = this.point
            .fromOrthoList(objToPoints(obj))
            .map(c => c.world());

          // Mouseover pointer for portals
          this.placePolygon({
            points: points,
            depth: this.mapHeight * (i + 1),
            cursor: 'e-resize',
            alpha: 0.001
          });


          // Skip registering the portalZones if the map has already been built
          if(this.mapBuilt) {
            continue
          }

          // At the moment this is the only way to change between
          // scenes. We'll want to refactor this when it changes
          this.portalZones.addZone({
            name: "portalTo" + destination,
            points: points,
            callback: (obj) => {
              this.state.comingFromScene = this.key;
              this.scene.start(destination, this.state);}
          });
        }

        continue;
      }

      if(layer.name === "stageMarkers") {
        if(this.mapBuilt) {
          continue;
        }

        for(let obj of layer.objects) {
          this.stageMarkers[obj.properties.name] = this.point.fromOrtho(obj);
        }

        continue;
      }


      // If it's a tile layer, draw it on the map
      if (this.mapData.orientation === "isometric") {
        this.drawIsometricLayer(layer.data, i);
      } else if (this.mapData.orientation === "staggered") {
        this.drawStaggeredLayer(layer.data, i);
      }
    }

    // If a buildMap has already been run on this scene, flag it
    // In future runs we won't do object-specific stuff
    this.mapBuilt = true;
    return true;
  }

  drawIsometricLayer(layerData, layerIndex) {

    let tileIndex = 0;

    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        let tileId = layerData[tileIndex] - 1;
        // Add the image iff it's a real tile
        if(tileId >= 0) {
          let coords = this.point.fromTile({x, y}).world();
          let tile = this.add.image(
            coords.x,
            coords.y + this.tileHeightHalf, // If we don't do this
            'tiles',                        // the navmesh won't align
            tileId);

          // Guarantee the highest layers get the highest depth
          tile.depth = (coords.y) * (layerIndex + 1);
        }

        tileIndex++;
      }
    }
  }

  drawStaggeredLayer(layerData, layerIndex) {

    let tileIndex = 0;

    for(let y = 0; y < this.mapHeight; y++) {
      let even = y % 2 === 0;
      let xOffset = even ? 0 : this.tileWidthHalf;
      let yOffset = y * this.tileHeightHalf;
      for(let x = 0; x < this.mapWidth; x++) {
        let tileId = layerData[tileIndex] - 1;
        // Add the image iff it's a real tile
        if(tileId >= 0) {
          let tile = this.add.image(
            x * this.tileWidth  + xOffset + this.tileWidthHalf,
            y * this.tileHeight - yOffset + this.tileHeightHalf,
            'tiles',
            tileId);

          // Guarantee the highest layers get the highest depth
          tile.depth = (y * this.tileHeight) * (layerIndex + 1);
        }

        tileIndex++;
      }
    }
  }


  // Place an invisible, interactable polygon on a graphic overlay
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

  // see where we think the PC should start in this scene
  getEntryPoint() {
    // If we've come from somewhere and that origin has a
    // designated entry point, use that
    if(this.state.comingFromScene) {
      const designatedEntryPoint = "entryFrom" + this.state.comingFromScene;
      console.log("Designated entry point:", designatedEntryPoint);
      console.log("Stage markers that exist:", this.stageMarkers);
      if(this.stageMarkers[designatedEntryPoint]) {
        console.log("Returning stageMarker:", this.stageMarkers[designatedEntryPoint]);
        return this.stageMarkers[designatedEntryPoint];
      }
    }

    // The worst this can return is undefined, which we'll check for
    return this.stageMarkers.start;

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

    if(this.scene.mapProjection === "isometric") {
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

    if(this.scene.mapProjection === "isometric"){
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


// Not phaser zones, but arbitrary polygons corresponding to areas in the game
// We define multiple zones for different behaviour, e.g. one for camera
// movement, one for portals, one for notifications, etc.

class ZoneHandler {
  constructor(name, scene) {
    this.scene = scene;
    this.zoneType = name;
    this.zones = [];
  }

  // Takes an object with x and y attributes
  // If the object is in one of the zones
  // it executes that zone's callback

  checkZones(obj) {
    for(let zone of this.zones) {
      if(zone.contains(obj) && obj.zone !== zone.name) {
        obj[this.zoneType] = zone.name;
        zone.callback(obj);
      }
    }
  }

  addZone(config) {
    this.zones.push(new Zone(config));
  }
}

class Zone {
  constructor(config){
    this.name = config.name;
    this.poly = new Phaser.Geom.Polygon(config.points);
    this.callback = config.callback;
  }

  // Takes an object with
  contains(obj) {
    return Phaser.Geom.Polygon.Contains(this.poly, obj.x, obj.y);
  }

}
