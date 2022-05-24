import * as THREE from "three";

// const points = [
//   [0, 0],
//   [1, 245],
//   [68, 185],
//   [150, 262],
//   [270, 281],
//   [345, 212],
//   [178, 155],
//   [240, 72],
//   [153, 0],
//   [52, 53],
//   [68, 185],
//   [0, 0]
// ];

const points = [
  [0, 0, 0],
  [20, 0, 200],
  [0, 0, 400],
  [-20, 0, 600],
  [0, 0, 800],
  [20, 0, 1000],
  [0, 0, 1200],
  [-20, 0, 1400],
  [0, 0, 1600],
  [20, 0, 1800],
  [0, 0, 2000]
];

var radius = 30;
var turns = 3;
var objPerTurn = 10;

var angleStep = (Math.PI * 2) / objPerTurn;
var heightStep = 5;

// Convert the array of points into vertices
for (var i = 0; i < turns * objPerTurn; i++) {
  // var x = points[i][0];
  // var y = points[i][1];
  // var z = points[i][2];

  var x = Math.cos(angleStep * i) * radius;
  var y = heightStep * i;
  var z = Math.sin(angleStep * i) * radius;

  points[i] = new THREE.Vector3(x, y, z);
}

const path = new THREE.CatmullRomCurve3(points);

// Create a path from the points
export default path;
