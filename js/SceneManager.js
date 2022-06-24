import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { preloadFont } from "troika-three-text";
import { gsap } from "gsap";

import * as Settings from "./constants.js";
import Tunnel from "./world/sceneSubjects/Tunnel.js";
import ProjectsContainer from "./world/sceneSubjects/ProjectsContainer.js";

const pointer = new THREE.Vector2();

const stats = Stats();

let prevComplete = false;
let isForward = false;
let isSwiping = false;

const tunnelMoveProperties = {
  cameraStep: -25,
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
    this.scene = new THREE.Scene();
    this.renderer = this.buildRenderer(canvas);
    this.camera = this.buildCamera();
    this.loadingManager = new THREE.LoadingManager();

    this.updateCameraCoordinates(0);

    this.tunnel = new Tunnel(this.scene);
    this.projectsContainer = new ProjectsContainer(this.scene, this.camera);

    this.currentProjectIndex = 0;

    this.preloadMaterials(this.loadingManager);

    this.loadingManager.onLoad = () => {
      preloadFont(
        {
          font: "/fonts/VectoraLTStd-Bold.woff"
        },
        () => {
          const loadingScreen = document.getElementById("loading-screen");
          loadingScreen.classList.add("fade-out");

          // optional: remove loader from DOM via event listener
          loadingScreen.addEventListener("transitionend", (event) => {
            event.target.remove();
          });

          this.updateCameraCoordinates(tunnelMoveProperties.cameraStep);
          isSwiping = true;
          this.animateCameraInitialState();
        }
      );
    };
  }

  preloadMaterials(loadingManager) {
    const textureLoader = new THREE.TextureLoader(loadingManager);

    for (let i = 0; i < Settings.PROJECTS.length; i++) {
      textureLoader.load(Settings.PROJECTS[i].img, (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture
        });

        this.projectsContainer.projects[i].mesh.material = material;
      });
    }
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

  update() {
    if (isSwiping) {
      this.makeWobble();
      console.log("animating");
    }

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

    this.camera.rotation.x =
      Settings.ANGLE_STEP * counter +
      tunnelMoveProperties.cameraRotationOffsetX;
    this.camera.rotation.y = tunnelMoveProperties.cameraRotationOffsetY;
    this.camera.rotation.z = tunnelMoveProperties.cameraRotationOffsetZ;
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

      this.moveCameraAfterSwipe();
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

        this.moveCameraAfterSwipe();
      }
    }
  }

  moveCameraAfterSwipe() {
    isSwiping = true;

    const isGoingBeforeFirstProject =
      !isForward && tunnelMoveProperties.cameraStep <= 0;
    const isGoingAfterLastProject =
      isForward &&
      tunnelMoveProperties.cameraStep >= Settings.PROJECTS.length - 1;

    if (isGoingBeforeFirstProject) {
      // block camera if going before first project
      this.animateBlockCamera();
    } else if (isGoingAfterLastProject) {
      // go to beginning if swiped when on last project
      this.animateGoToBeginning();
    } else {
      this.animateGoToProject();
    }
  }

  getSelectedProjectGroup(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

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

  openProject(event, projectContainerElement) {
    if (prevComplete) {
      const selectedProjectGroup = this.getSelectedProjectGroup(event);
      const currentProjectThumbnail = this.projectsContainer.projects[
        this.currentProjectIndex
      ].mesh;

      if (selectedProjectGroup) {
        this.animateOpenProject(
          currentProjectThumbnail,
          projectContainerElement
        );
      }

      return selectedProjectGroup;
    }

    return null;
  }

  closeProject(projectContainerElement) {
    if (!prevComplete) {
      const currentProjectThumbnail = this.projectsContainer.projects[
        this.currentProjectIndex
      ].mesh;

      this.animateCloseProject(
        currentProjectThumbnail,
        projectContainerElement
      );
    }
  }

  /* ---------- */
  /* ANIMATIONS */
  /* ---------- */

  animateCameraInitialState() {
    gsap.timeline().to(tunnelMoveProperties, {
      cameraStep: 0,
      duration: 4,
      ease: "power4.inOut",
      onComplete: () => {
        isSwiping = false;
        prevComplete = true;
        this.updateCameraCoordinates(tunnelMoveProperties.cameraStep);
      }
    });
  }

  animateGoToBeginning() {
    gsap
      .timeline()
      .to(tunnelMoveProperties, {
        cameraStep: isForward ? "+=0.05" : "-=0.05",
        projectThumbnailBend: 0.85,
        projectTitleZ: isForward ? 0.2 : -0.2,
        duration: 1.5,
        ease: "power4.in"
      })
      .to(tunnelMoveProperties, {
        cameraStep: 0,
        duration: 2,
        ease: "elastic.out(1,0.6)",
        onComplete: () => {
          prevComplete = true;
          isSwiping = false;
          this.currentProjectIndex = 0;
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
        1.7
      );
  }

  animateBlockCamera() {
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
  }

  animateGoToProject() {
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

  animateOpenProject(currentProjectThumbnail, projectContainerElement) {
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
      )
      .to(
        projectContainerElement,
        {
          marginTop: 0,
          duration: 0.55,
          ease: "power2.inOut"
        },
        0
      );
  }

  animateCloseProject(currentProjectThumbnail, projectContainerElement) {
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
      )
      .to(
        projectContainerElement,
        {
          marginTop: "100vh",
          duration: 0.8,
          ease: "power2.inOut"
        },
        0
      );
  }
}

export default SceneManager;
