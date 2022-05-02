// Template file for scene subject

import * as THREE from "three";

const SPEED = 0.01;

class SceneSubject {
  constructor() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
  }

  update() {
    this.mesh.rotation.x -= SPEED * 2;
    this.mesh.rotation.y -= SPEED;
    this.mesh.rotation.z -= SPEED * 3;

    this.mesh.updateMatrix();
  }
}

export default SceneSubject;
