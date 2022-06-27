import * as THREE from "three";

import * as Settings from "../../constants.js";
import Project from "./Project.js";

class ProjectsContainer {
  constructor(scene, camera) {
    this.projects = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.screenTopEdgeY = 0;

    this.setProjectsContainer(scene, camera);
  }

  setProjectsContainer(scene, camera) {
    let counter, helixCoordinates, cameraPosition, cameraDistanceToThumbnail;

    for (let i = 0; i < Settings.PROJECTS.length; i++) {
      counter = i * Settings.PROJECT_DISTANCE_BETWEEN;

      cameraPosition = Settings.getHelixCoordinatesBy(counter).position;

      helixCoordinates = Settings.getHelixCoordinatesBy(counter + 1.5);

      cameraDistanceToThumbnail = cameraPosition.distanceTo(
        helixCoordinates.position
      );

      // width and height must follow the 16:9 ratio
      let width =
        2 *
        Math.tan(Settings.CAMERA_FOV_RADIANS / 2) *
        camera.aspect *
        cameraDistanceToThumbnail;
      const height = (9 / 16) * width;

      const project = new Project(Settings.PROJECTS[i].title, width, height);

      var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 1)
      );

      var raycaster = new THREE.Raycaster();
      var corner = new THREE.Vector2();
      var cornerPoint = new THREE.Vector3();

      corner.set(1, 1); // NDC of the bottom-left corner
      raycaster.setFromCamera(corner, camera);
      raycaster.ray.intersectPlane(plane, cornerPoint);

      const topEdgeVector = new THREE.Vector3()
        .copy(cornerPoint)
        .add(new THREE.Vector3(-width / 2, -height / 2, counter)); // align the position of the box

      this.screenTopEdgeY = topEdgeVector.y + Settings.PROJECT_OFFSET_Y + 1.22;
      console.log(topEdgeVector);

      project.container.position.copy(helixCoordinates.position);
      project.container.rotation.copy(helixCoordinates.rotation);
      project.containerHelixRotation.copy(project.container.rotation);

      //project.mesh.position.y = this.screenTopEdgeY;

      project.mesh.scale.x = 0.8;
      project.mesh.scale.y = 0.8;
      project.mesh.scale.z = 0.8;

      project.container.updateMatrix();

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
