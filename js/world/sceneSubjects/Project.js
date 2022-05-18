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

    const geometry = this.createGeometry();

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

  // https://threejs.org/examples/webgl_morphtargets.html
  createGeometry() {
    const geometry = new THREE.BoxGeometry(4, 2.25, 0.1, 32, 32, 32);
    const geometry1 = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);
    const geometry2 = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);

    bender.bend(geometry1, "y", -0.4);
    bender.bend(geometry2, "y", 0.4);

    // create an empty array to  hold targets for the attribute we want to morph
    // morphing positions and normals is supported
    geometry.morphAttributes.position = [];

    // the original positions of the cube's vertices
    const positionAttribute = geometry.attributes.position;

    // for the first morph target we'll move the cube's vertices onto the surface of a sphere
    let spherePositions = [];

    // for the second morph target, we'll twist the cubes vertices
    const twistPositions = [];
    const direction = new THREE.Vector3(1, 0, 0);
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      spherePositions.push(
        x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
        y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
        z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3)
      );

      // stretch along the x-axis so we can see the twist better
      vertex.set(x * 2, y, z);

      vertex
        .applyAxisAngle(direction, (Math.PI * x) / 2)
        .toArray(twistPositions, twistPositions.length);
    }

    // add the spherical positions as the first morph target
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
      spherePositions,
      3
    );

    // add the twisted positions as the second morph target
    geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(
      twistPositions,
      3
    );

    // for the first morph target we'll move the cube's vertices onto the surface of a sphere
    const bend1Positions = geometry.attributes.position;

    // for the second morph target, we'll twist the cubes vertices
    const bend2Positions = geometry2.attributes.position;

    // add the spherical positions as the first morph target
    geometry.morphAttributes.position[2] = new THREE.Float32BufferAttribute(
      positionAttribute,
      3
    );

    // add the twisted positions as the second morph target
    geometry.morphAttributes.position[3] = new THREE.Float32BufferAttribute(
      bend1Positions,
      3
    );

    geometry.morphAttributes.position[4] = new THREE.Float32BufferAttribute(
      bend2Positions,
      3
    );

    return geometry;
  }

  update() {
    // gsap.to(this.mesh.position, {
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
