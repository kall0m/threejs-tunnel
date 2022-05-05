import * as THREE from "three";

import Path from "../Path.js";

class Project {
  constructor(pathPos, color, camera) {
    this.pathPos = pathPos;
    this.color = color;

    this.mesh = new THREE.Object3D();

    this.setProject(camera);
  }

  setProject(camera) {
    const geometry = new THREE.BoxBufferGeometry(4, 3, 0.05);
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: this.color })
    );

    const pos = Path.getPointAt(this.pathPos);

    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.lookAt(camera.position);

    this.mesh = mesh;
  }

  update() {}
}

export default Project;
