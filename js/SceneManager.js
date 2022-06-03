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
  projectThumbnailBend: 0,
  projectTitleZ: 0
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

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

    this.makeWobble();

    this.renderer.render(this.scene, this.camera);

    stats.update();
  }

  makeWobble() {
    this.updateCameraCoordinates(tunnelMoveProperties.cameraStep);

    this.bendProjectThumbnails(
      isForward
        ? Settings.PROJECT_BEND_STATE_FORWARD
        : Settings.PROJECT_BEND_STATE_BACKWARD,
      tunnelMoveProperties.projectThumbnailBend
    );

    this.updateProjectTitlesZ(tunnelMoveProperties.projectTitleZ);
  }

  updateCameraCoordinates(i) {
    const counter =
      i * Settings.PROJECT_DISTANCE_BETWEEN -
      Settings.CAMERA_OFFSET +
      Settings.PROJECT_OFFSET;

    const helixVector = Settings.getHelixCoordinatesBy(counter);

    this.camera.position.set(
      helixVector.x + Settings.HEIGHT_STEP,
      helixVector.y,
      helixVector.z
    );

    this.camera.rotation.x = Settings.ANGLE_STEP * counter;
  }

  bendProjectThumbnails(state, morph) {
    this.projectsContainer.bendThumbnails(state, morph);
  }

  updateProjectTitlesZ(z) {
    this.projectsContainer.updateTitlesZ(z);
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
    if (
      (!isForward && tunnelMoveProperties.cameraStep <= 0) ||
      (isForward &&
        tunnelMoveProperties.cameraStep >= Settings.PROJECTS.length - 1)
    ) {
      gsap
        .timeline()
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "+=0.05" : "-=0.05",
          projectThumbnailBend: 0.85,
          projectTitleZ: isForward ? 0.5 : -0.5,
          duration: 1,
          ease: "power4.in"
        })
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "-=0.05" : "+=0.05",
          duration: 1,
          ease: "elastic.out(1,0.6)",
          onComplete: () => {
            prevComplete = true;
          }
        })
        .to(
          tunnelMoveProperties,
          {
            projectThumbnailBend: 0,
            projectTitleZ: 0,
            duration: 2,
            ease: "elastic.out(1,0.3)"
          },
          1.2
        );
    } else {
      gsap
        .timeline()
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "+=0.5" : "-=0.5",
          projectThumbnailBend: 0.85,
          projectTitleZ: isForward ? 0.5 : -0.5,
          duration: 1,
          ease: "power4.in"
        })
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "+=0.5" : "-=0.5",
          duration: 1,
          ease: "elastic.out(1,0.6)",
          onComplete: () => {
            prevComplete = true;
          }
        })
        // .to(
        //   tunnelMoveProperties,
        //   {
        //     projectThumbnailBend: 0.85,
        //     duration: 1,
        //     ease: "power4.in"
        //   },
        //   0
        // )
        .to(
          tunnelMoveProperties,
          {
            projectThumbnailBend: 0,
            projectTitleZ: 0,
            duration: 2,
            ease: "elastic.out(1,0.3)"
          },
          1.2
        );
    }
  }
}

export default SceneManager;
