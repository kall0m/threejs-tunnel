import * as THREE from "three";

import Path from "../Path.js";

class Projects {
  constructor(camera) {
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setProjects(camera);
  }

  setProjects(camera) {
    const geometry = new THREE.BoxBufferGeometry(0.8, 0.8, 0.05);
    const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });

    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const pos = Path.getPointAt((i / 100) % 1);

      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.lookAt(camera.position);

      this.container.add(mesh);
    }
  }

  update() {}
}

export default Projects;
