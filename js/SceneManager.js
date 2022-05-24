import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "dat-gui";

import { gsap } from "gsap";

import Path from "./world/Path.js";

import Tunnel from "./world/sceneSubjects/Tunnel.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

import Bender from "./bender.js";
const bender = new Bender();

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

const stats = Stats();

let projectCounter = 0;
let cameraPathPos = 0;

let prevComplete = true;
let isForward = false;

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRender(canvas);
    this.camera = this.buildCamera();

    this.projectsContainer = [];
    this.tunnelRings = [];
    this.sceneSubjects = this.createSceneSubjects();

    this.nextProjectInView = this.projectsContainer.projects[0];
    this.nextProjectInView.update();

    this.camAnim = null;

    this.positionCamera();

    this.initGUI();

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

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

    this.renderer.render(this.scene, this.camera);

    stats.update();
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
    controls.enabled = false;

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
    cameraPathPos = this.projectsContainer.projects[0].pathPos - 0.0015;

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
    projectCounter %= this.projectsContainer.projects.length;

    this.nextProjectInView = this.projectsContainer.projects[projectCounter];
    const nextProjectInViewPathPos = this.nextProjectInView.pathPos;

    var p1 = Path.getPointAt(nextProjectInViewPathPos - 0.0015);
    var p2 = Path.getPointAt(nextProjectInViewPathPos);

    gsap.to(this.camera.position, {
      duration: 2,
      ease: "elastic.inOut(1, 1)",
      x: p1.x,
      y: p1.y,
      z: p1.z,
      onStart: () => {
        if (this.camAnim) {
          this.camAnim.kill();
        }
      },
      onUpdate: () => {
        if (!isForward) {
          if (projectCounter + 1 < this.projectsContainer.projects.length) {
            p2 = Path.getPointAt(
              this.projectsContainer.projects[projectCounter + 1].pathPos
            );

            this.projectsContainer.morph(0, -0.01);
          }
        } else {
          this.projectsContainer.morph(0, 0.01);
        }

        this.camera.lookAt(p2);
      },
      onComplete: () => {
        //this.camera.lookAt(p2);

        prevComplete = true;
        this.nextProjectInView.update();

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

  initGUI() {
    // Set up dat.GUI to control targets
    const params = {
      Twist: 0,
      Spherify: 0,

      Normal: 0,
      Bend1: 0,
      Bend2: 0
    };

    const gui = new GUI({ title: "Morph Targets" });

    let mesh = this.nextProjectInView.mesh;

    gui
      .add(params, "Bend1", 0, 1)
      .step(0.01)
      .onChange(function (value) {
        mesh.morphTargetInfluences[0] = value;
      });

    gui
      .add(params, "Bend2", 0, 1)
      .step(0.01)
      .onChange(function (value) {
        mesh.morphTargetInfluences[1] = value;
      });
  }
}

export default SceneManager;
