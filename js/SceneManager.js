import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { gsap } from "gsap";

import * as TUNNEL from "./world/sceneSubjects/Tunnel.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

const stats = Stats();

let projectCounter = 0;

let prevComplete = true;
let isForward = false;

let position = {
  percent: 0.005,
  counter: 0
};

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRenderer(canvas);
    this.camera = this.buildCamera();

    this.projectsContainer = [];
    this.tunnel = new THREE.Object3D();
    this.sceneSubjects = this.createSceneSubjects();

    this.camAnim = null;

    this.positionCamera();

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
    const fieldOfView = 120;
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
    controls.target.set(0, 12, 0);
    controls.update();
    controls.enabled = false;

    return camera;
  }

  createSceneSubjects() {
    this.tunnel = new TUNNEL.Tunnel(this.scene);

    this.projectsContainer = new ProjectsContainer(
      this.scene,
      this.camera,
      this.tunnel.path
    );

    // add new SceneSubjects to the scene
    const sceneSubjects = [this.tunnel, this.projectsContainer];

    return sceneSubjects;
  }

  positionCamera() {
    // cameraPathPos = this.projectsContainer.projects[0].pathPos - 0.004;
    // var p1 = Path.getPointAt(cameraPathPos);
    // this.camera.position.set(p1.x, p1.y, p1.z);
    // var p2 = Path.getPointAt(cameraPathPos + 0.01);
    // this.camera.lookAt(p2);
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
        projectCounter++;
        isForward = true;
      } else {
        projectCounter--;
        if (projectCounter < 0) {
          projectCounter = this.projectsContainer.projects.length - 1;
        }
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
          projectCounter++;
          isForward = true;
        } else {
          projectCounter--;
          if (projectCounter < 0) {
            projectCounter = this.projectsContainer.projects.length - 1;
          }
          isForward = false;
        }

        this.goToNextProject();
      } else {
        prevComplete = true;
      }
    }
  }

  goToNextProject() {
    prevComplete = true;

    gsap.to(position, {
      percent: isForward ? "+=0.05" : "-=0.05",
      counter: isForward ? "+=30" : "-=30",
      duration: 1,
      //ease: "elastic.inOut(1, 1)",
      //onStart: () => {
      //     if (this.camAnim) {
      //       this.camAnim.kill();
      //     }
      //   },
      onUpdate: () => {
        if (!isForward) {
          if (projectCounter + 1 < this.projectsContainer.projects.length) {
            this.projectsContainer.morph(0, -0.01);
          }
        } else {
          this.projectsContainer.morph(0, 0.01);
        }
      },
      onComplete: () => {
        prevComplete = true;
        this.projectsContainer.resetMorph(0);

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

  updateCameraPercentage(percentage) {
    let p1 = this.tunnel.path.getPointAt(percentage % 1);
    let p2 = this.tunnel.path.getPointAt((percentage + 0.03) % 3);
    this.camera.position.set(p1.x, p1.y, p1.z);
    this.camera.lookAt(p2);
  }

  updateCameraCounter(counter) {
    let x = Math.cos(TUNNEL.ANGLE_STEP * counter) * TUNNEL.RADIUS;
    let y = TUNNEL.HEIGHT_STEP * counter;
    let z = Math.sin(TUNNEL.ANGLE_STEP * counter) * TUNNEL.RADIUS;

    this.camera.position.set(x, y, z);

    x = Math.cos(TUNNEL.ANGLE_STEP * (counter + 5)) * TUNNEL.RADIUS;
    y = TUNNEL.HEIGHT_STEP * (counter + 5);
    z = Math.sin(TUNNEL.ANGLE_STEP * (counter + 5)) * TUNNEL.RADIUS;

    this.camera.lookAt(new THREE.Vector3(x, y, z));
  }

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

    //this.updateCameraPercentage(position.percent);
    this.updateCameraCounter(position.counter);

    this.renderer.render(this.scene, this.camera);

    stats.update();
  }
}

export default SceneManager;
