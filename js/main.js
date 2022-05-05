import SceneManager from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();

  window.onwheel = wheelCanvas;
  window.ontouchmove = wheelCanvas;
}

function resizeCanvas() {
  sceneManager.onWindowResize();
}

function wheelCanvas(event) {
  sceneManager.onWindowWheel(event);
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
