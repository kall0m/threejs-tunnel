import * as THREE from "three";

class SceneSubject {
  constructor(scene) {
    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: "#ffffff" });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    scene.add(this.mesh);
  }

  update() {
    const SPEED = 0.01;

    this.mesh.rotation.x -= SPEED * 2;
    this.mesh.rotation.y -= SPEED;
    this.mesh.rotation.z -= SPEED * 3;
  }
}

export default SceneSubject;
