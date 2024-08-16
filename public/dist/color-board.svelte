<script lang="ts" context="module"></script>

<script lang="ts">import {
  blockEvent,
  createGradientCanvas,
  getCanvasEventXY,
  hexToHsl,
  hexToRGBA,
  isValidHexColor,
  rgbaToHex
} from "./utils";
let { size = 255, color = $bindable("#0000ff"), onColor } = $props();
let canvas = $state(null);
let ctx = $state(null);
let isGradientDragging = $state(null);
let offscreenGradientCanvas;
let rgba = $state({
  r: 255,
  g: 255,
  b: 255,
  a: 1
});
let width = $state(255);
let height = $state(255);
export function setAlpha(alpha) {
  rgba.a = alpha;
  selectColor();
}
export function setColor(color2) {
  if (color2 && isValidHexColor(color2)) {
    const { x, y, a } = estimateColorPosition(color2);
    pickColor({ offsetX: x, offsetY: y }, color2);
  }
}
function estimateColorPosition(hex) {
  if (canvas) {
    const hsl = hexToHsl(hex);
    const rgba2 = hexToRGBA(hex);
    const x = Math.round(hsl.h / 360 * canvas.width);
    const y = Math.round((1 - hsl.l / 100) * canvas.height);
    return { x, y, a: rgba2.a };
  }
  return { x: 0, y: 0, a: 0 };
}
function selectColor() {
  let rgbaColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  let hexColor = rgbaToHex(rgbaColor);
  if (hexColor != color) {
    color = hexColor;
    if (rgba.a && rgba.a >= 0 && rgba.a < 1) {
      onColor && onColor(rgbaColor);
    } else {
      onColor && onColor(color);
    }
  }
}
function drawColorSelector(x = 0, y = 0) {
  if (ctx) {
    ctx.save();
    ctx.shadowColor = "gray";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}
function drawColor() {
  if (canvas && ctx) {
    if (!offscreenGradientCanvas) {
      offscreenGradientCanvas = createGradientCanvas(canvas.width, canvas.height);
    }
    ctx.drawImage(offscreenGradientCanvas, 0, 0);
  }
}
function pickColor(event, color2) {
  if (canvas && ctx) {
    let { x, y } = getCanvasEventXY(canvas, event);
    drawColor();
    if (color2) {
      let { r, g, b } = hexToRGBA(color2);
      rgba = { ...rgba, ...{ r, g, b } };
    } else {
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = imageData;
      rgba = { ...rgba, ...{ r, g, b } };
    }
    drawColorSelector(x, y);
    selectColor();
  }
}
function handleColorMouseDown(event) {
  blockEvent(event);
  isGradientDragging = true;
  pickColor(event);
}
function handleColorMouseMove(event) {
  if (!isGradientDragging) return;
  blockEvent(event);
  pickColor(event);
}
function handleColorMouseEnd(event) {
  blockEvent(event);
  isGradientDragging = false;
}
$effect(() => {
  if (size) {
    width = size;
    height = size;
  }
});
$effect(() => {
  if (canvas && width && height) {
    setTimeout(() => {
      if (canvas && !ctx) {
        ctx = canvas.getContext("2d", { willReadFrequently: true });
      }
      drawColor();
      if (color) {
        setColor(color);
        onColor && onColor(color);
      }
    }, 100);
  }
});
</script>

<div>
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<canvas
		bind:this={canvas}
		{width}
		{height}
		ontouchstart={handleColorMouseDown}
		ontouchmove={handleColorMouseMove}
		ontouchend={handleColorMouseEnd}
		onmousedown={handleColorMouseDown}
		onmousemove={handleColorMouseMove}
		onmouseup={handleColorMouseEnd}
	/>
</div>
