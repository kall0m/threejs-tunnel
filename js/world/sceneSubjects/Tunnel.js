import * as THREE from "three";

import Path from "../Path.js";

class Tunnel {
  constructor(scene, camera) {
    this.camera = camera;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setTunnel(scene, camera);
  }

  setTunnel(scene, camera) {
    const geometry1 = new THREE.RingGeometry(5, 5.02, 128);

    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff"
      //side: THREE.BackSide
    });

    for (let i = 0; i < 1000; i++) {
      let mesh = new THREE.Mesh(geometry1, material);

      const pos = Path.getPointAt((i / 1000) % 1);

      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.lookAt(camera.position);

      this.container.add(mesh);
    }

    scene.add(this.container);
  }

  update() {
    for (let i = 0; i < this.container.children.length; i++) {
      const ring = this.container.children[i];
      ring.lookAt(this.camera.position);
    }
  }
}

export default Tunnel;
