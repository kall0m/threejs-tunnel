import * as THREE from "three";
import * as Settings from "../../constants.js";

class Tunnel {
  constructor(scene) {
    this.hexagons = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setTunnel(scene);
  }

  setTunnel(scene) {
    for (let i = 0; i < Settings.TURNS * Settings.OBJ_PER_TURN; i++) {
      const mesh = this.createMesh(i);

      this.hexagons.push(mesh);
      this.container.add(mesh);
    }

    scene.add(this.container);
  }

  createMesh(counter) {
    const geometry = new THREE.TorusGeometry(1.4, 0.01, 16, 6);
    // radius
    // Settings.SCREEN_SIZES.width / Settings.SCREEN_SIZES.height - 0.1,
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff"
    });

    const mesh = new THREE.Mesh(geometry, material);

    const helixVector = Settings.getHelixCoordinatesBy(counter);

    mesh.position.set(helixVector.x, helixVector.y, helixVector.z);
    mesh.rotation.x = Settings.ANGLE_STEP * counter;

    return mesh;
  }

  regenerate(isForward) {
    // if (isForward) {
    //   for (let i = 0; i < Settings.REGENERATION_NUMBER; i++) {
    //     const x =
    //       Math.cos(Settings.ANGLE_STEP * (this.hexagons.length + i)) *
    //       Settings.RADIUS;
    //     const y = Settings.HEIGHT_STEP * (this.hexagons.length + i);
    //     const z =
    //       Math.sin(Settings.ANGLE_STEP * (this.hexagons.length + i)) *
    //       Settings.RADIUS;
    //     // this.hexagons[i].position.set(x, y, z);
    //     // this.hexagons[i].rotation.y =
    //     //   -Settings.ANGLE_STEP * (this.hexagons.length + i);
    //     this.hexagons[i].material.color = "#ff00ff";
    //   }
    //   const n = this.hexagons.splice(0, Settings.REGENERATION_NUMBER);
    //   this.hexagons.concat(n);
    // } else {
    // }
  }

  update() {}
}

export default Tunnel;
