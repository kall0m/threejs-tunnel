import * as THREE from "three";
import { gsap } from "gsap";
import { Text } from "troika-three-text";

import * as Settings from "../../constants.js";
import Bender from "../../bender.js";
const bender = new Bender();

class Project {
  constructor(title, img) {
    this.title = title;
    this.img = img;

    this.mesh = new THREE.Object3D();
    this.mesh.matrixAutoUpdate = false;

    this.setProject();
  }

  setProject() {
    this.setMesh();
    this.setTitle();
  }

  setMesh() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(this.img);

    const geometry = this.createGeometry();

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: texture
        //side: THREE.BackSide
      })
    );

    this.mesh = mesh;
  }

  // https://threejs.org/examples/webgl_morphtargets.html
  createGeometry() {
    const geometry = new THREE.PlaneBufferGeometry(4, 2.25, 32, 32);
    const geometry1 = new THREE.PlaneBufferGeometry(4, 2.25, 32, 32);
    const geometry2 = new THREE.PlaneBufferGeometry(4, 2.25, 32, 32);

    bender.bend(geometry1, "y", -Settings.PROJECT_BEND_POWER);
    bender.bend(geometry2, "y", Settings.PROJECT_BEND_POWER);

    // create an empty array to  hold targets for the attribute we want to morph
    // morphing positions and normals is supported
    geometry.morphAttributes.position = [];

    // the original positions of bend1
    const positionAttributeBend1 = geometry1.attributes.position;
    let bend1Positions = [];

    for (let i = 0; i < positionAttributeBend1.count; i++) {
      const x = positionAttributeBend1.getX(i);
      const y = positionAttributeBend1.getY(i);
      const z = positionAttributeBend1.getZ(i);

      bend1Positions.push(x, y, z);
    }

    // the original positions of bend2
    const positionAttributeBend2 = geometry2.attributes.position;
    let bend2Positions = [];

    for (let i = 0; i < positionAttributeBend2.count; i++) {
      const x = positionAttributeBend2.getX(i);
      const y = positionAttributeBend2.getY(i);
      const z = positionAttributeBend2.getZ(i);

      bend2Positions.push(x, y, z);
    }

    // add the bend 1 positions as the first morph target
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
      bend1Positions,
      3
    );

    // add the bend 2 positions as the second morph target
    geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(
      bend2Positions,
      3
    );

    return geometry;
  }

  setTitle() {
    const title = new Text();

    title.text = this.title.toUpperCase();
    title.font = "../../../fonts/VectoraLTStd-Bold.woff";
    title.fontSize = 0.4;
    title.color = "#ffffff";
    title.maxWidth = 3;
    title.anchorX = 0;
    title.anchorY = 1.5;
    title.letterSpacing = 0;
    title.lineHeight = 1;
    title.depthOffset = -2;

    title.sync();

    this.title = title;
  }

  update() {
    // gsap.to(this.title.position, {
    //   duration: "1",
    //   ease: "power2.inOut",
    //   yoyoEase: "power2.inOut",
    //   repeat: -1,
    //   x: "+=random(-0.2,0.2)",
    //   y: "+=random(-0.2,0.2)",
    //   z: "+=random(-0.2,0.2)"
    // });
  }

  morph(state, value) {
    this.mesh.morphTargetInfluences[state] += value;
  }

  resetMorph(state) {
    this.mesh.morphTargetInfluences[state] = 0;
  }
}

export default Project;
