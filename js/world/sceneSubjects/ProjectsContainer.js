import * as THREE from "three";

import * as Settings from "../../constants.js";
import Project from "./Project.js";

class ProjectsContainer {
  constructor(scene) {
    this.projects = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setProjectsContainer(scene);
  }

  setProjectsContainer(scene) {
    for (let i = 0; i < Settings.PROJECT_IMAGES.length; i++) {
      const counter =
        i * Settings.PROJECT_DISTANCE_BETWEEN + Settings.PROJECT_OFFSET;

      const x = Settings.HEIGHT_STEP * counter;
      const y = -Math.cos(Settings.ANGLE_STEP * counter) * Settings.RADIUS;
      const z = Math.sin(-Settings.ANGLE_STEP * counter) * Settings.RADIUS;

      const project = new Project(
        Settings.PROJECT_TITLES[i],
        Settings.PROJECT_IMAGES[i]
      );

      project.mesh.position.set(x, y, z);
      project.mesh.rotation.x = Settings.ANGLE_STEP * counter;

      project.title.position.set(x, y, z);
      project.title.rotation.x = Settings.ANGLE_STEP * counter;

      this.projects.push(project);
      this.container.add(project.mesh);
      this.container.add(project.title);
    }

    scene.add(this.container);
  }

  update() {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i].update();
    }
  }

  morph(state, value) {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i].morph(state, value);
    }
  }
}

export default ProjectsContainer;
