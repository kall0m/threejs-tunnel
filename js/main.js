import SceneManager from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();

  window.onwheel = wheelCanvas;

  window.ontouchstart = touchstartCanvas;
  window.ontouchend = touchendCanvas;
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

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
