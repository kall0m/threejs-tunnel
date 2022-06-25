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

    // create an empty array to  hold targets for the attribute we want to morph
    // morphing positions and normals is supported
    geometry.morphAttributes.position = [];

    // add the forward bend positions as the first morph target
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
      this.getGeometryPositions(width, height, -Settings.PROJECT_BEND_POWER),
      3
    );

    // add the backward bend positions as the second morph target
    geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(
      this.getGeometryPositions(width, height, Settings.PROJECT_BEND_POWER),
      3
    );

    return geometry;
  }

  getGeometryPositions(width, height, bendPower) {
    const geometry = new THREE.PlaneBufferGeometry(width, height, 16, 16);

    bender.bend(geometry, "y", bendPower);

    // the original positions of bent geometry
    const positionAttributeGeometry = geometry.attributes.position;
    let geometryPositions = [];

    for (let i = 0; i < positionAttributeGeometry.count; i++) {
      const x = positionAttributeGeometry.getX(i);
      const y = positionAttributeGeometry.getY(i);
      const z = positionAttributeGeometry.getZ(i);

      geometryPositions.push(x, y, z);
    }

    geometry.dispose();

    return geometryPositions;
  }

  setTitle(width, height) {
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
