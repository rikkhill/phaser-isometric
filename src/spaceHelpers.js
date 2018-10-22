import "phaser";

// Helper utilities for spatial operations


// Euclidean distance between two points
function euc(x1, x2, y1, y2) {
  return Math.sqrt((y2 - y1)**2 + (x2-x1)**2);
}

function cardinal(x1, x2, y1, y2) {
  const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
  console.log(angle);

  if(angle > -Math.PI/8 && angle <= Math.PI / 8) {
    return "SouthEast";
  } else if(angle > Math.PI / 8 && angle <= 3 * Math.PI / 8) {
    return "South";
  } else if(angle > 3 *Math.PI / 8 && angle <= 5 * Math.PI / 8) {
    return "SouthWest";
  } else if(angle > 5 * Math.PI / 8 && angle <= 7 * Math.PI / 8) {
    return "West";
  } else if(angle > 7 * Math.PI / 8 || angle <= -7 * Math.PI / 8) {
    return "NorthWest";
  } else if(angle > -7 * Math.PI / 8 && angle <= -5 * Math.PI / 8) {
    return "North";
  } else if(angle > -5 * Math.PI / 8 && angle <= -3 * Math.PI / 8) {
    return "NorthEast";
  } else if(angle > -3 * Math.PI / 8 && angle <= -Math.PI / 8) {
    return "East";
  }

  return angle;

}

export {cardinal, euc};