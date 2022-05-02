// Template file for scene subject

import * as THREE from "three";

const SPEED = 0.01;

class SceneSubject {
  constructor() {
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setSceneSubject();
  }

  setSceneSubject() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const mesh = new THREE.Mesh(geometry, material);

    this.container.add(mesh);
  }

  update() {
    this.container.rotation.x -= SPEED * 2;
    this.container.rotation.y -= SPEED;
    this.container.rotation.z -= SPEED * 3;

    this.container.updateMatrix();
  }
}

export default SceneSubject;
