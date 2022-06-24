class Noise {
  constructor(canvas) {
    this.canvas = canvas;
  }

  generate() {
    const ctx = this.canvas.getContext("2d");

    const w = ctx.canvas.width,
      h = ctx.canvas.height,
      iData = ctx.createImageData(w, h),
      buffer32 = new Uint32Array(iData.data.buffer),
      len = buffer32.length;

    for (let i = 0; i < len; i++)
      if (Math.random() < 0.5) buffer32[i] = 0xffffffff;

    ctx.putImageData(iData, 0, 0);
  }

  onWindowResize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;

    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
  }
}

export default Noise;
