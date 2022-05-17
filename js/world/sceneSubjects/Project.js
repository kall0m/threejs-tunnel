import * as THREE from "three";

import { gsap } from "gsap";
import { Text } from "troika-three-text";

import Path from "../Path.js";

import Bender from "../../bender.js";
const bender = new Bender();

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

    const geometry = new THREE.BoxBufferGeometry(4, 2.25, 1);

    bender.bend(geometry, "y", 0);

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    const title = new Text();

    // Set properties to configure:
    title.text = this.title;
    title.font = "../../../fonts/VectoraLTStd-Bold.woff";
    title.fontSize = 0.4;
    title.color = "#ffffff";
    title.maxWidth = 2;

    // Update the rendering:
    title.sync();

    const pos = Path.getPointAt(this.pathPos);

    mesh.position.set(pos.x, pos.y - 1.3, pos.z);
    mesh.lookAt(camera.position);

    title.position.set(pos.x, pos.y - 1.3, pos.z - 1);
    title.lookAt(camera.position);

    this.mesh = mesh;
    this.title = title;
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
