import SceneManager from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();
}

function resizeCanvas() {
  sceneManager.onWindowResize();
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
