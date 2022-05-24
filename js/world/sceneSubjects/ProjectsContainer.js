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

const images = [
  "https://i.imgur.com/j9kOzZS.png",
  "https://i.imgur.com/KksqRGy.png",
  "https://i.imgur.com/EzLK14L.png",
  "https://i.imgur.com/Q5fi7iz.jpg",
  "https://i.imgur.com/KULOaQM.png",
  "https://i.imgur.com/873lbha.png",
  "https://i.imgur.com/K8aqfNC.png",
  "https://miro.medium.com/max/1400/1*7rSJDJ-oA-HX4WCtjNbsIQ.png",
  "https://media-exp1.licdn.com/dms/image/C4E12AQGcZRe1WlhJZg/article-cover_image-shrink_600_2000/0/1632262281314?e=2147483647&v=beta&t=W1yykArfH4_bu0HWn68SYqVsqzLOVt8kT6fsuOhAAuU",
  "https://www.gannett-cdn.com/-mm-/01b3f144eb141b8cf7f41fc13e2b94d422d4e858/c=61-0-1862-1018/local/-/media/IAGroup/DesMoines/2014/09/22/1411405133000-Day4Globe.jpg"
];

const titles = [
  "Connected Mine",
  "AVEnueS",
  "Damen Shipyards",
  "EV Box VR Simulation",
  "Hololens Surgery",
  "Future Hyperloop Traveler",
  "VR Tetris",
  "Mystical Well",
  "Accenture One Space",
  "Random VR Project"
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
    for (let i = 0; i < 10; i++) {
      const pathPos = ((i / 40) % 1) + 0.01;

      const project = new Project(
        titles[i],
        pathPos,
        colors[i],
        images[i],
        camera,
        i
      );

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

  resetMorph(state) {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i].resetMorph(state);
    }
  }
}

export default ProjectsContainer;
