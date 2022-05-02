import * as THREE from "three";

import SceneSubject from "./sceneSubjects/SceneSubject.js";

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRender(canvas);
    this.camera = this.buildCamera();
    this.sceneSubjects = this.createSceneSubjects();
  }

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++)
      this.sceneSubjects[i].update();

    this.renderer.render(this.scene, this.camera);
  }

  buildScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  buildRender(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(SIZES.width, SIZES.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
  }

  buildCamera() {
    // Base camera
    const fieldOfView = 45;
    const aspectRatio = SIZES.width / SIZES.height;
    const nearPlane = 0.1;
    const farPlane = 400;

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.set(0, 0, 10);

    return camera;
  }

  createSceneSubjects() {
    // add new SceneSubjects to the scene
    const sceneSubjects = [new SceneSubject(this.scene)];

    return sceneSubjects;
  }

  onWindowResize() {
    // update sizes when a resize event occurs
    SIZES.width = window.innerWidth;
    SIZES.height = window.innerHeight;

    // update camera
    this.camera.aspect = SIZES.width / SIZES.height;
    this.camera.updateProjectionMatrix();

    // update renderer
    this.renderer.setSize(SIZES.width, SIZES.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

export default SceneManager;
