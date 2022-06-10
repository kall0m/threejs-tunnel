import SceneManager from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let openedProject = null;

const projectContainer = document.getElementById("projectContainer");
const projectContainer2 = document.getElementById("projectContainer2");
const projectContainer3 = document.getElementById("projectContainer3");
const projectContent = document.getElementById("projectContent");
const closeButton = document.getElementById("closeButton");

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();

  window.onwheel = wheelCanvas;

  window.ontouchstart = touchstartCanvas;
  window.ontouchend = touchendCanvas;

  window.onpointermove = pointerMoveCanvas;
  window.onclick = openProject;

  closeButton.onclick = closeProject;
}

function resizeCanvas() {
  sceneManager.onWindowResize();
}

function wheelCanvas(event) {
  sceneManager.onWindowWheel(event);
}

function touchstartCanvas(event) {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}

function touchendCanvas(event) {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;

  sceneManager.handleGesture(touchstartX, touchstartY, touchendX, touchendY);
}

function pointerMoveCanvas(event) {
  const selectedProjectGroup = sceneManager.getSelectedProjectGroup(event);

  if (selectedProjectGroup !== null && openedProject === null) {
    document.getElementById("app").style.cursor = "pointer";
  } else {
    document.getElementById("app").style.cursor = "default";
  }
}

function openProject(event) {
  const selectedProjectGroup = sceneManager.openProject(
    event,
    projectContainer,
    projectContainer2,
    projectContainer3,
    projectContent
  );

  if (selectedProjectGroup !== null) {
    closeButton.style.display = "block";
    openedProject = selectedProjectGroup;
  }
}

function closeProject() {
  sceneManager.closeProject(
    openedProject,
    projectContainer,
    projectContainer2,
    projectContainer3,
    projectContent
  );

  closeButton.style.display = "none";
  openedProject = null;
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
