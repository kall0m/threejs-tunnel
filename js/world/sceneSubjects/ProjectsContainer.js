import * as THREE from "three";

import * as Settings from "../../constants.js";
import Project from "./Project.js";

class ProjectsContainer {
  constructor(scene, camera) {
    this.projects = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.projectWidth = 0;
    this.projectHeight = 0;

    this.setProjectsContainer(scene, camera);
  }

  setProjectsContainer(scene, camera) {
    let counter;
    let helixVector = Settings.getHelixCoordinatesBy(0);
    const cameraDistanceToThumbnail = 4.712; // TODO calculate project.z - camera.z
    //let cameraDistanceToThumbnail = camera.position.distanceTo(helixVector);

    for (let i = 0; i < Settings.PROJECTS.length; i++) {
      counter = i * Settings.PROJECT_DISTANCE_BETWEEN - Settings.PROJECT_OFFSET;

      helixVector = Settings.getHelixCoordinatesBy(counter);

      //width and height must follow the 16:9 ratio
      const width =
        2 *
        Math.tan(Settings.CAMERA_FOV_RADIANS / 2) *
        camera.aspect *
        cameraDistanceToThumbnail;
      this.projectWidth = width;

      const height = (9 / 16) * width;
      this.projectHeight = height;

      const project = new Project(Settings.PROJECTS[i].title, width, height);

      // var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      //   new THREE.Vector3(0, 0, 1),
      //   new THREE.Vector3(0, 0, 1)
      // );

      // var raycaster = new THREE.Raycaster();
      // var corner = new THREE.Vector2();
      // var cornerPoint = new THREE.Vector3();

      project.container.position.set(
        helixVector.x,
        helixVector.y,
        helixVector.z
      );

      // const loader = new THREE.TextureLoader();
      // const texture = loader.load("https://i.imgur.com/j9kOzZS.png");

      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneBufferGeometry(width, height),
      //   new THREE.MeshBasicMaterial({
      //     map: texture
      //   })
      // );

      // corner.set(-1, 1); // NDC of the bottom-left corner
      // raycaster.setFromCamera(corner, camera);
      // raycaster.ray.intersectPlane(plane, cornerPoint);
      // mesh.position
      //   .copy(cornerPoint)
      //   .add(new THREE.Vector3(width / 2, -height / 2, 0)); // align the position of the box

      project.container.rotation.x = Settings.ANGLE_STEP * counter;

      project.mesh.updateMatrix();
      project.container.updateMatrix();

      project.mesh.scale.x = Settings.PROJECT_SCALE;
      project.mesh.scale.y = Settings.PROJECT_SCALE;
      project.mesh.scale.z = Settings.PROJECT_SCALE;

      this.projects.push(project);
      this.container.add(project.container);
    }

    scene.add(this.container);
  }

  bendThumbnails(state, value) {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i].bendThumbnail(state, value);
    }
  }

  updateTitlesZ(z) {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i].updateTitleZ(z);
    }
  }
}

export default ProjectsContainer;
