import * as THREE from "three";
import { Text } from "troika-three-text";

import * as Settings from "../../constants.js";
import Bender from "../../Bender.js";
const bender = new Bender();

class Project {
  constructor(title, width, height) {
    this.title = title;

    this.mesh = new THREE.Object3D();
    this.mesh.matrixAutoUpdate = false;

    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    this.setProject(width, height);
  }

  setProject(width, height) {
    this.setMesh(width, height);
    this.setTitle(width, height);
  }

  setMesh(width, height) {
    const geometry = this.createGeometry(width, height);
    const material = new THREE.MeshBasicMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;
    mesh.position.y -= Settings.PROJECT_OFFSET_Y;
    this.container.add(mesh);
  }

  // https://threejs.org/examples/webgl_morphtargets.html
  createGeometry(width, height) {
    const geometry = new THREE.PlaneBufferGeometry(width, height, 16, 16);
    const geometry1 = new THREE.PlaneBufferGeometry(width, height, 16, 16);
    const geometry2 = new THREE.PlaneBufferGeometry(width, height, 16, 16);

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

  setTitle(width, height) {
    // console.log("height", height);
    // console.log("width", width);

    const title = new Text();

    title.text = this.title.toUpperCase();

    title.font = "../../../fonts/VectoraLTStd-Bold.woff";
    title.color = "#ffffff";
    title.textAlign = "right";
    title.fontSize = width * 0.1;

    title.maxWidth = width * Settings.PROJECT_SCALE;
    title.anchorX = "right";
    title.anchorY = "top-baseline";

    title.depthOffset = -1;

    title.outlineWidth = "10%";
    title.outlineColor = new THREE.Color(0x000000);

    title.sync();

    title.position.x += (width * Settings.PROJECT_SCALE) / 2;
    title.position.y -=
      (height * Settings.PROJECT_SCALE) / 1.3 + Settings.PROJECT_OFFSET_Y;
    title.position.z -= 10;

    this.title = title;
    this.container.add(title);
  }

  bendThumbnail(state, value) {
    this.mesh.morphTargetInfluences[state] = value;
  }

  updateTitleZ(z) {
    this.title.position.z = z;
  }
}

export default Project;
