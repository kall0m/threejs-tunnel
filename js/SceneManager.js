import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { gsap } from "gsap";

import Tunnel from "./world/sceneSubjects/Tunnel.js";
import Path from "./world/Path.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

let projectCounter = 0;
let cameraPathPos = 0;

let prevComplete = true;

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRender(canvas);
    this.camera = this.buildCamera();

    this.projectsContainer = [];
    this.tunnelRings = [];
    this.sceneSubjects = this.createSceneSubjects();

    this.selectedProject = this.projectsContainer.projects[0];
    this.selectedProject.animate();

    this.camAnim = null;

    this.positionCamera();

    this.camAnim = gsap.to(this.camera.position, {
      duration: "1",
      ease: "power2.inOut",
      yoyoEase: "power2.inOut",
      repeat: -1,
      x: "+=random(-0.1,0.1)",
      y: "+=random(-0.1,0.1)",
      z: "+=random(-0.1,0.1)"
    });
  }

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

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
    const farPlane = 300;

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    let controls = new OrbitControls(camera, this.renderer.domElement);

    // const helper = new THREE.CameraHelper(camera);
    // this.scene.add(helper);

    return camera;
  }

  createSceneSubjects() {
    let tunnel = new Tunnel(this.scene, this.camera);
    this.tunnelRings = tunnel.container.children;

    let projectsContainer = new ProjectsContainer(this.scene, this.camera);
    this.projectsContainer = projectsContainer;

    // add new SceneSubjects to the scene
    const sceneSubjects = [tunnel, projectsContainer];

    return sceneSubjects;
  }

  positionCamera() {
    cameraPathPos = this.projectsContainer.projects[0].pathPos - 0.005;

    var p1 = Path.getPointAt(cameraPathPos);
    this.camera.position.set(p1.x, p1.y, p1.z);

    var p2 = Path.getPointAt(cameraPathPos + 0.01);
    this.camera.lookAt(p2);
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

  onWindowWheel(event) {
    if (prevComplete) {
      prevComplete = false;

      // Check if scrolled up or down
      if (event.deltaY > 0) {
        projectCounter++;
      } else {
        projectCounter--;
        if (projectCounter < 0) {
          projectCounter = this.projectsContainer.projects.length - 1;
        }
      }

      projectCounter %= this.projectsContainer.projects.length;

      this.selectedProject = this.projectsContainer.projects[projectCounter];
      const nextProjectPathPos = this.selectedProject.pathPos;

      var p1 = Path.getPointAt(nextProjectPathPos - 0.005);

      gsap.to(this.camera.position, {
        duration: 1,
        ease: "slow(0.9, 0.2, false)",
        x: p1.x,
        y: p1.y,
        z: p1.z,
        onStart: () => {
          if (this.camAnim) {
            this.camAnim.kill();
          }
        },
        onUpdate: () => {
          var p2 = Path.getPointAt(nextProjectPathPos);
          this.camera.lookAt(p2);

          this.selectedProject.mesh.lookAt(this.camera.position);
        },
        onComplete: () => {
          prevComplete = true;
          this.selectedProject.animate();

          this.camAnim = gsap.to(this.camera.position, {
            duration: "1",
            ease: "power2.inOut",
            yoyoEase: "power2.inOut",
            repeat: -1,
            x: "+=random(-0.1,0.1)",
            y: "+=random(-0.1,0.1)",
            z: "+=random(-0.1,0.1)"
          });
        }
      });
    }
  }
}

export default SceneManager;
