import * as THREE from "three";

const RADIUS = 20;
const TURNS = 2;
const OBJ_PER_TURN = 200;

const ANGLE_STEP = (Math.PI * 2) / OBJ_PER_TURN;
const HEIGHT_STEP = 0.1;

class Tunnel {
  constructor(scene) {
    this.path = new THREE.Object3D();

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setTunnel(scene);
  }

  setTunnel(scene) {
    let points = [];

    const geometry = new THREE.TorusGeometry(5, 0.005, 30, 6);

    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff"
    });

    for (let i = 0; i < TURNS * OBJ_PER_TURN; i++) {
      let mesh = new THREE.Mesh(geometry, material);

      let x = Math.cos(ANGLE_STEP * i) * RADIUS;
      let y = HEIGHT_STEP * i;
      let z = Math.sin(ANGLE_STEP * i) * RADIUS;

      mesh.position.set(x, y, z);
      mesh.rotation.y = -ANGLE_STEP * i;

      points[i] = new THREE.Vector3(x, y, z);

      this.container.add(mesh);
    }

    this.path = new THREE.CatmullRomCurve3(points);

    scene.add(this.container);
  }

  update() {}
}

export { RADIUS, TURNS, OBJ_PER_TURN, ANGLE_STEP, HEIGHT_STEP, Tunnel };
