import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { gsap } from "gsap";

import * as Settings from "./constants.js";
import Tunnel from "./world/sceneSubjects/Tunnel.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

const stats = Stats();

let prevComplete = true;
let isForward = false;

let tunnelMoveProperties = {
  cameraStep: 0,
  projectMorph: 0
};

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRenderer(canvas);
    this.camera = this.buildCamera();

    this.projectsContainer = [];

    this.tunnel = new THREE.Object3D();
    this.tunnel.matrixAutoUpdate = false;

    this.sceneSubjects = this.createSceneSubjects();

    this.camAnim = null;

    this.updateCameraCoordinates(0);

    // this.camAnim = gsap.to(this.camera.position, {
    //   duration: "1",
    //   ease: "power2.inOut",
    //   yoyoEase: "power2.inOut",
    //   repeat: -1,
    //   x: "+=random(-0.05,0.05)",
    //   y: "+=random(-0.05,0.05)",
    //   z: "+=random(-0.05,0.05)"
    // });
  }

  buildScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  buildRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(SIZES.width, SIZES.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(stats.dom);

    return renderer;
  }

  buildCamera() {
    // Base camera
    const fieldOfView = Settings.CAMERA_FOV;
    const aspectRatio = SIZES.width / SIZES.height;
    const nearPlane = 0.1;
    const farPlane = 1000;

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.update();
    controls.enabled = false;

    return camera;
  }

  createSceneSubjects() {
    this.tunnel = new Tunnel(this.scene);

    this.projectsContainer = new ProjectsContainer(this.scene);

    // add new SceneSubjects to the scene
    const sceneSubjects = [this.tunnel, this.projectsContainer];

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

  // for mouse scroll
  onWindowWheel(event) {
    if (prevComplete) {
      prevComplete = false;

      // Check if scrolled up or down
      if (event.deltaY > 0) {
        isForward = true;
      } else {
        isForward = false;
      }

      this.goToNextProject();
    }
  }

  // for touch screen
  handleGesture(touchstartX, touchstartY, touchendX, touchendY) {
    if (prevComplete) {
      prevComplete = false;

      const delx = touchendX - touchstartX;
      const dely = touchendY - touchstartY;

      if (Math.abs(delx) < Math.abs(dely)) {
        if (dely > 0) {
          isForward = true;
        } else {
          isForward = false;
        }

        this.goToNextProject();
      }
    }
  }

  goToNextProject() {
    //prevComplete = true;

    gsap.to(tunnelMoveProperties, {
      cameraStep: isForward ? "+=1" : "-=1",
      projectMorph: 1,
      duration: 2,
      ease: "elastic.inOut(1, 1)",
      //onStart: () => {
      //     if (this.camAnim) {
      //       this.camAnim.kill();
      //     }
      //   },
      onUpdate: () => {
        if (isForward) {
          this.projectsContainer.morph(1, Settings.PROJECT_BEND_STEP);
        } else {
          this.projectsContainer.morph(0, Settings.PROJECT_BEND_STEP);
        }
      },
      onComplete: () => {
        prevComplete = true;

        if (isForward) {
          this.projectsContainer.resetMorph(1);
        } else {
          this.projectsContainer.resetMorph(0);
        }

        tunnelMoveProperties.projectMorph = 0;

        if (tunnelMoveProperties.cameraStep % 1 === 0) {
          this.tunnel.regenerate(isForward);
        }

        // this.camAnim = gsap.to(this.camera.position, {
        //   duration: "1",
        //   ease: "power2.inOut",
        //   yoyoEase: "power2.inOut",
        //   repeat: -1,
        //   x: "+=random(-0.05,0.05)",
        //   y: "+=random(-0.05,0.05)",
        //   z: "+=random(-0.05,0.05)"
        // });
      }
    });
  }

  updateCameraCoordinates(i) {
    const counter =
      i * Settings.PROJECT_DISTANCE_BETWEEN -
      Settings.CAMERA_OFFSET +
      Settings.PROJECT_OFFSET;

    let x = Settings.HEIGHT_STEP * counter;
    let y = -Math.cos(Settings.ANGLE_STEP * counter) * Settings.RADIUS;
    let z = Math.sin(-Settings.ANGLE_STEP * counter) * Settings.RADIUS;

    this.camera.position.set(x + Settings.HEIGHT_STEP, y, z);

    this.camera.rotation.x = Settings.ANGLE_STEP * counter;
  }

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

    this.updateCameraCoordinates(tunnelMoveProperties.cameraStep);

    this.renderer.render(this.scene, this.camera);

    stats.update();
  }
}

export default SceneManager;
