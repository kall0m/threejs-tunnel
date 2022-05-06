import * as THREE from "three";
import { gsap } from "gsap";

import Path from "../Path.js";

class Project {
  constructor(title, pathPos, color, img, camera) {
    this.title = title;
    this.pathPos = pathPos;
    this.color = color;
    this.img = img;
    this.isSelected = false;

    this.mesh = new THREE.Object3D();

    this.setProject(camera);
  }

  setProject(camera) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(this.img);

    const geometry = new THREE.PlaneGeometry(4, 2.25);
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    const pos = Path.getPointAt(this.pathPos);

    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.lookAt(camera.position);

    this.mesh = mesh;
  }

  animate() {
    gsap.to(this.mesh.position, {
      duration: "1",
      ease: "power2.inOut",
      yoyoEase: "power2.inOut",
      repeat: -1,
      x: "+=random(-0.2,0.2)",
      y: "+=random(-0.2,0.2)",
      z: "+=random(-0.2,0.2)"
    });
  }
}

export default Project;
