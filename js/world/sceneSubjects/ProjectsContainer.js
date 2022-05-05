import * as THREE from "three";

import Project from "./Project.js";

const colors = [
  "#fa93fa",
  "#8cdbe3",
  "#7a890f",
  "#6b570c",
  "#8bdf9b",
  "#32470e",
  "#42a3ea",
  "#fc0cf8",
  "#95844b",
  "#1252c8"
];

class ProjectsContainer {
  constructor(scene, camera) {
    this.camera = camera;
    this.projects = [];

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setProjectsContainer(scene, camera);
  }

  setProjectsContainer(scene, camera) {
    for (let i = 0; i < colors.length; i++) {
      const pathPos = ((i / 20) % 1) + 0.01;

      const project = new Project(pathPos, colors[i], camera);

      this.projects.push(project);
      this.container.add(project.mesh);
    }

    scene.add(this.container);
  }

  update() {
    // for (let i = 0; i < this.projects.length; i++) {
    //   this.projects[i].update();
    // }
  }
}

export default ProjectsContainer;
