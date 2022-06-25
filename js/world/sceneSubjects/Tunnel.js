import * as THREE from "three";
import * as Settings from "../../constants.js";

import { gsap } from "gsap";

let index = 1;

class Tunnel {
  constructor(scene) {
    this.segments = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setTunnel(scene);
  }

  setTunnel(scene) {
    for (let i = Settings.TURNS * Settings.OBJ_PER_TURN - 1; i >= -50; i--) {
      const segment = this.createSegment(i);
      this.segments.push(segment);
      this.container.add(segment);
    }

    scene.add(this.container);
  }

  createSegment(counter) {
    // each segment of the tunnel is a group of shapes
    const segment = new THREE.Group();
    let shape, mesh;

    for (let i = 0; i < Settings.SHAPE_SEGMENTS.length; i++) {
      shape = new THREE.Object3D();

      mesh = this.createMesh(counter, Settings.SHAPE_SEGMENTS[i]);

      shape.add(mesh);

      // disable all the shapes in the group except the first one
      if (i > 0) {
        shape.visible = false;
      }

      segment.add(shape);
    }

    return segment;
  }

  createMesh(counter, segments) {
    const geometry = new THREE.TorusGeometry(1.4, 0.01, 16, segments);
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff"
    });

    const mesh = new THREE.Mesh(geometry, material);

    const helixVector = Settings.getHelixCoordinatesBy(counter);

    mesh.position.set(helixVector.x, helixVector.y, helixVector.z);
    mesh.rotation.x = Settings.ANGLE_STEP * counter;

    // rotate square by 45 degrees in radians
    // to make it parallel to viewport
    if (segments === 4) {
      mesh.rotation.z = 45 * (Math.PI / 180);
    }

    return mesh;
  }

  enableSegments(isVisible) {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].visible = isVisible;
    }
  }

  changeSegmentsShape() {
    for (let i = 0; i < this.segments.length; i++) {
      const tl = gsap.timeline();

      for (let j = 0; j < this.segments[i].children.length; j++) {
        //this.segments[i].children[j].visible = false;

        tl.set(
          this.segments[i].children[j],
          {
            visible: false
          },
          i / 45
        );
      }

      //this.segments[i].children[index].visible = true;

      tl.set(
        this.segments[i].children[index],
        {
          visible: true
        },
        i / 45
      );
    }

    index >= Settings.SHAPE_SEGMENTS.length - 1 ? (index = 0) : index++;
  }
}

export default Tunnel;
