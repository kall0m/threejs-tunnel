import SceneManager from "./SceneManager.js";
import Noise from "./Noise.js";

const canvasThreejs = document.querySelector("canvas.threejs");
const sceneManager = new SceneManager(canvasThreejs);

const canvasNoise = document.querySelector("canvas.noise");
const noise = new Noise(canvasNoise);

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let openedProject = null;

const projectContainer = document.getElementById("projectContainer");
const closeButton = document.getElementById("closeButton");

const aspectRatio = 56.25; // (9/16)*100

console.clear();
console.log("%c🌀 Inside the tunnel 🌀", "font-size: 16px");

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
  noise.onWindowResize();
  sceneManager.onWindowResize();

  const val = window.innerHeight - (aspectRatio * window.innerWidth) / 100;
  projectContainer.style.background =
    "linear-gradient(0deg, black 0 " +
    val +
    "px, transparent " +
    val +
    "px 100%)";
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
    projectContainer
  );

  // show button and project page
  if (selectedProjectGroup !== null) {
    //projectContainer.classList.remove("project-container--hidden");
    //projectContainer.style.marginTop = 0;
    closeButton.classList.remove("close-button--hidden");
    openedProject = selectedProjectGroup;
  }
}

function closeProject() {
  // scroll the page up again when closing
  projectContainer.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

  // hide button and project page
  //projectContainer.classList.add("project-container--hidden");
  //projectContainer.style.marginTop = "100vh";
  closeButton.classList.add("close-button--hidden");

  // close project in THREEjs
  sceneManager.closeProject(projectContainer);
  openedProject = null;
}

function render() {
  requestAnimationFrame(render);
  noise.generate();
  sceneManager.update();
}
