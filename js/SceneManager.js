import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { gsap } from "gsap";

import * as Settings from "./constants.js";
import Tunnel from "./world/sceneSubjects/Tunnel.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

const pointer = new THREE.Vector2();

const stats = Stats();

let prevComplete = true;
let isForward = false;
let isSwiping = false;

const tunnelMoveProperties = {
  cameraStep: 0,
  cameraPositionOffsetX: 0.175, //TODO investigate if calculation is possible
  cameraPositionOffsetY: 0,
  cameraPositionOffsetZ: 0,
  cameraRotationOffsetX: 0,
  cameraRotationOffsetY: 0,
  cameraRotationOffsetZ: 0,
  projectThumbnailBend: 0,
  projectTitleZ: 0
};

class SceneManager {
  constructor(canvas) {
    this.scene = this.buildScene();
    this.renderer = this.buildRenderer(canvas);
    this.camera = this.buildCamera();
    // this.cameraControls = new OrbitControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    // this.cameraControls.enabled = false;

    //DEBUG;
    this.updateCameraCoordinates(tunnelMoveProperties.cameraStep);

    this.projectsContainer = [];
    this.currentProjectIndex = 0;

    this.tunnel = new THREE.Object3D();
    this.tunnel.matrixAutoUpdate = false;

    this.sceneSubjects = this.createSceneSubjects();

    this.printValues();
  }

  printValues() {
    console.clear();

    console.log("CAMERA POSITION ", this.camera.position);
    console.log("CAMERA ROTATION ", this.camera.rotation);

    console.log(
      "PROJECT CONTAINER POSITION ",
      this.projectsContainer.projects[this.currentProjectIndex].container
        .position
    );
    console.log(
      "PROJECT CONTAINER ROTATION ",
      this.projectsContainer.projects[this.currentProjectIndex].container
        .rotation
    );

    console.log(
      "PROJECT MESH POSITION ",
      this.projectsContainer.projects[this.currentProjectIndex].mesh.position
    );
    console.log(
      "PROJECT MESH ROTATION ",
      this.projectsContainer.projects[this.currentProjectIndex].mesh.rotation
    );
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

    renderer.setSize(Settings.SCREEN_SIZES.width, Settings.SCREEN_SIZES.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(stats.dom);

    return renderer;
  }

  buildCamera() {
    // Base camera
    const fieldOfView = Settings.CAMERA_FOV;
    const aspectRatio =
      Settings.SCREEN_SIZES.width / Settings.SCREEN_SIZES.height;
    const nearPlane = 1;
    const farPlane = 1000;

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    return camera;
  }

  createSceneSubjects() {
    this.tunnel = new Tunnel(this.scene);

    this.projectsContainer = new ProjectsContainer(this.scene, this.camera);

    // add new SceneSubjects to the scene
    const sceneSubjects = [this.tunnel, this.projectsContainer];

    return sceneSubjects;
  }

  update() {
    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update();
    }

    if (isSwiping) {
      this.makeWobble();
      console.log("animating");
    }

    this.renderer.render(this.scene, this.camera);

    stats.update();

    //tunnelMoveProperties.cameraStep += 0.05;
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
      Settings.PROJECT_OFFSET -
      Settings.CAMERA_OFFSET;

    const helixVector = Settings.getHelixCoordinatesBy(counter);

    this.camera.position.set(
      helixVector.x +
        Settings.HEIGHT_STEP +
        tunnelMoveProperties.cameraPositionOffsetX,
      helixVector.y,
      helixVector.z
    );

    // PRINTING THE DISTANCE BETWEEN THE CAMERA AND THE CENTER OF THE PROJECT
    // console.log(
    //   "dist ",
    //   this.projectsContainer.projects[this.currentProjectIndex].container
    //     .position.z - this.camera.position.z
    // );

    this.camera.rotation.x =
      Settings.ANGLE_STEP * counter +
      tunnelMoveProperties.cameraRotationOffsetX;
    this.camera.rotation.y = tunnelMoveProperties.cameraRotationOffsetY;
    this.camera.rotation.z = tunnelMoveProperties.cameraRotationOffsetZ;

    // this.camera.position.set(0, 0, 10);
    // this.cameraControls.update();
  }

  bendProjectThumbnails(state, morph) {
    this.projectsContainer.bendThumbnails(state, morph);
  }

  updateProjectTitlesZ(z) {
    this.projectsContainer.updateTitlesZ(z);
  }

  onWindowResize() {
    // update sizes when a resize event occurs
    Settings.SCREEN_SIZES.width = window.innerWidth;
    Settings.SCREEN_SIZES.height = window.innerHeight;

    // update camera
    this.camera.aspect =
      Settings.SCREEN_SIZES.width / Settings.SCREEN_SIZES.height;
    this.camera.updateProjectionMatrix();

    // update renderer
    this.renderer.setSize(
      Settings.SCREEN_SIZES.width,
      Settings.SCREEN_SIZES.height
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //this.cameraControls.update();
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
    const delx = touchendX - touchstartX;
    const dely = touchendY - touchstartY;

    if (Math.abs(delx) < Math.abs(dely)) {
      if (prevComplete) {
        prevComplete = false;

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
    isSwiping = true;

    // if first project is in view, block the camera from going backward
    // OR
    // if last project is in view, block the camera from going forward
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
          projectTitleZ: isForward ? 0.2 : -0.2,
          duration: 1,
          ease: "power4.in"
        })
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "-=0.05" : "+=0.05",
          duration: 1,
          ease: "elastic.out(1,0.6)",
          onComplete: () => {
            prevComplete = true;
            isSwiping = false;
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
          projectTitleZ: isForward ? 0.3 : -0.3,
          duration: 1,
          ease: "power4.in"
        })
        .to(tunnelMoveProperties, {
          cameraStep: isForward ? "+=0.5" : "-=0.5",
          duration: 1,
          ease: "elastic.out(1,0.6)",
          onComplete: () => {
            prevComplete = true;
            isForward ? this.currentProjectIndex++ : this.currentProjectIndex--;
            this.printValues();
            isSwiping = false;
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
    }
  }

  getSelectedProjectGroup(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //console.log(pointer);

    let selectedObject;
    const raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(pointer, this.camera);

    const intersects = raycaster.intersectObjects(
      this.projectsContainer.projects[this.currentProjectIndex].container
        .children,
      true
    );

    if (intersects.length > 0) {
      selectedObject = intersects[0];

      return selectedObject.object.parent;
    }

    return null;
  }

  // TODO animate project content with gsap instead of css
  openProject(event) {
    if (prevComplete) {
      const selectedProjectGroup = this.getSelectedProjectGroup(event);
      const currentProjectThumbnail = this.projectsContainer.projects[
        this.currentProjectIndex
      ].mesh;

      if (selectedProjectGroup) {
        gsap
          .timeline()
          .to(
            currentProjectThumbnail.position,
            {
              //TODO investigate proper y so that the thumbnail is always at the top edge of the screen
              y: "+=1.135",
              duration: 0.6,
              ease: "power2.inOut",
              onUpdate: () => {
                currentProjectThumbnail.updateMatrix();
              },
              onComplete: () => {
                prevComplete = false;
              }
            },
            0
          )
          .to(
            currentProjectThumbnail.scale,
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.6,
              ease: "power2.inOut",
              onUpdate: () => {
                currentProjectThumbnail.updateMatrix();
              }
            },
            0
          );
      }

      return selectedProjectGroup;
    }

    return null;
  }

  closeProject() {
    if (!prevComplete) {
      const currentProjectThumbnail = this.projectsContainer.projects[
        this.currentProjectIndex
      ].mesh;

      gsap
        .timeline()
        .to(
          currentProjectThumbnail.position,
          {
            y: "-=1.135",
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: () => {
              currentProjectThumbnail.updateMatrix();
            },
            onComplete: () => {
              prevComplete = true;
            }
          },
          0
        )
        .to(
          currentProjectThumbnail.scale,
          {
            x: 0.8,
            y: 0.8,
            z: 0.8,
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: () => {
              currentProjectThumbnail.updateMatrix();
            }
          },
          0
        );
    }
  }
}

export default SceneManager;
