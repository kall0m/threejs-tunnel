import SceneManager from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let openedProject = null;

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();

  window.onwheel = wheelCanvas;

  window.ontouchstart = touchstartCanvas;
  window.ontouchend = touchendCanvas;

  window.onpointermove = pointerMoveCanvas;
  window.onclick = clickCanvas;

  let closeButton = document.getElementById("closeButton");
  closeButton.onclick = hideCloseButton;
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

function clickCanvas(event) {
  const projectContent = document.getElementById("projectContent");
  const selectedProjectGroup = sceneManager.openProject(event, projectContent);

  if (selectedProjectGroup !== null) {
    document.getElementById("closeButton").style.display = "block";
    openedProject = selectedProjectGroup;
  }
}

function hideCloseButton() {
  const projectContent = document.getElementById("projectContent");

  sceneManager.closeProject(openedProject, projectContent);
  document.getElementById("closeButton").style.display = "none";
  openedProject = null;
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
