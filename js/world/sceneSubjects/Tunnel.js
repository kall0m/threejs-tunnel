import * as THREE from "three";

import Path from "../Path.js";

class Tunnel {
  constructor(camera) {
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setTunnel(camera);
  }

  setTunnel(camera) {
    const geometry = new THREE.RingGeometry(1, 1.01, 64);
    const material = new THREE.MeshBasicMaterial({ color: "#EB5E5E" });

    for (let i = 0; i < 1000; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const pos = Path.getPointAt((i / 2000) % 1);

      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.lookAt(camera.position);

      this.container.add(mesh);
    }
  }

  update() {}
}

export default Tunnel;
