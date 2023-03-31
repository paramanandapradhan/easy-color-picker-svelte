<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let rgbaOutput: boolean = false;

	let dispatch = createEventDispatcher();

	let gradientCanvasRef: HTMLCanvasElement;
	let colorBarCanvasRef: HTMLCanvasElement;
	let alphaCanvasRef: HTMLCanvasElement;
	let selectedColorDivRef: HTMLDivElement;

	let gradientCtx: CanvasRenderingContext2D | null;
	let colorBarCtx: CanvasRenderingContext2D | null;
	let alphaBarCtx: CanvasRenderingContext2D | null;

	let selectedColor = { r: 255, g: 0, b: 0, a: 1 };
	let hue = 0;
	let rgbaColor = '#000';
	let hexColor = '';
	let isColorBarDragging = false;
	let isGradientDragging = false;
	let isAlphaDragging = false;
	let selectedX: number = 0;
	let selectedY: number = 0;

	const alphaBarWidth = 256;
	const alphaBarHeight = 20;
	const alphaBarColorStart = 'white';
	const alphaBarColorEnd = 'rgba(0,0,0,0)';

	const getEventCoodinates = (canvas: HTMLCanvasElement, event: any): { x: number; y: number } => {
		let x: number = 0;
		let y: number = 0;
		if (canvas && event) {
			if (event.touches && event.touches[0]) {
				const rect = canvas.getBoundingClientRect();
				x = event.touches[0].clientX - rect.left;
				y = event.touches[0].clientY - rect.top;
			} else {
				x = event.offsetX;
				y = event.offsetY;
			}
		}
		if (x < 0) x = 0;
		if (x > 255) x = 255;
		if (y < 0) y = 0;
		if (y > 255) y = 255;
		return { x, y };
	};
 
	const rgbaToHex = (r: number, g: number, b: number, a: number) => {
		let alphaHex: string = 'ff';
		if (a > 0 && a < 1) {
			alphaHex = Math.round(a * 255)
				.toString(16)
				.padStart(2, '0');
		}

		const hex =
			'#' +
			((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) +
			(alphaHex == 'ff' ? '' : alphaHex);
		return hex;
	};
 

	function drawAlphaBar() {
		let color = { r: 256, g: 256, b: 256 };
		if (alphaBarCtx) {
			alphaBarCtx.clearRect(0, 0, alphaBarWidth, alphaBarHeight);
			drawTransparentGrid();
			const gradient = alphaBarCtx.createLinearGradient(0, 0, alphaBarWidth, 0);
			gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
			gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
			alphaBarCtx.fillStyle = gradient;
			alphaBarCtx.fillRect(0, 0, alphaBarWidth, alphaBarHeight);
		}
	}

	const drawGradient = () => {
		if (gradientCtx) {
			gradientCtx.clearRect(0, 0, alphaBarWidth, alphaBarHeight);
			const gradient = gradientCtx.createLinearGradient(0, 0, 256, 0);
			gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
			gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 1)`);

			gradientCtx.fillStyle = gradient;
			gradientCtx.fillRect(0, 0, 256, 256);

			const alphaGradient = gradientCtx.createLinearGradient(0, 0, 0, 256);
			alphaGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
			alphaGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

			gradientCtx.fillStyle = alphaGradient;
			gradientCtx.fillRect(0, 0, 256, 256);
		}
	};

	const drawColorBar = () => {
		if (colorBarCtx) {
			colorBarCtx.clearRect(0, 0, alphaBarWidth, alphaBarHeight);
			const gradient = colorBarCtx.createLinearGradient(0, 0, 256, 0);
			gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
			gradient.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)');
			gradient.addColorStop(2 / 6, 'rgba(0, 255, 0, 1)');
			gradient.addColorStop(3 / 6, 'rgba(0, 255, 255, 1)');
			gradient.addColorStop(4 / 6, 'rgba(0, 0, 255, 1)');
			gradient.addColorStop(5 / 6, 'rgba(255, 0, 255, 1)');
			gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

			colorBarCtx.fillStyle = gradient;
			colorBarCtx.fillRect(0, 0, 256, 20);
		}
	};

	const drawColorbarSelector = (x: number = 0, y: number = 0) => {
		if (colorBarCtx) {
			x = x - 4;

			colorBarCtx.shadowColor = 'gray';
			colorBarCtx.shadowBlur = 2;
			colorBarCtx.shadowOffsetX = 1;
			colorBarCtx.shadowOffsetY = 1;

			colorBarCtx.strokeStyle = '#ffffff';
			colorBarCtx.lineWidth = 4;
			colorBarCtx.strokeRect(x, y, 8, 20);
		}
	};

	const drawAlphabarSelector = (x: number = 0, y: number = 0) => {
		if (alphaBarCtx) {
			x = x - 4;

			alphaBarCtx.shadowColor = 'gray';
			alphaBarCtx.shadowBlur = 2;
			alphaBarCtx.shadowOffsetX = 1;
			alphaBarCtx.shadowOffsetY = 1;

			alphaBarCtx.strokeStyle = '#ffffff';
			alphaBarCtx.lineWidth = 4;
			alphaBarCtx.strokeRect(x, y, 8, 20);
		}
	};

	const updateSelectedColor = () => {
		rgbaColor = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`;
		hexColor = rgbaToHex(selectedColor.r, selectedColor.g, selectedColor.b, selectedColor.a);
		if (rgbaOutput) {
			dispatch('change', rgbaColor);
		} else {
			dispatch('change', hexColor);
		}
	};

	const handleGradientCanvasChnage = (e: any) => {
		if (!isGradientDragging && !e.force) return;
		if (gradientCtx && e) {
			drawGradient();
			let { x, y } = getEventCoodinates(gradientCanvasRef, e);
			selectedX = x;
			selectedY = y;
			const imageData = gradientCtx.getImageData(x, y, 1, 1).data;

			selectedColor.r = imageData[0];
			selectedColor.g = imageData[1];
			selectedColor.b = imageData[2];
			updateSelectedColor();
			drawGradientSelector(x, y);
		}
	};

	const handleColorBarChange = (e: any) => {
		if (!isColorBarDragging && !e.force) return;
		if (e && colorBarCtx) {
			let { x, y } = getEventCoodinates(gradientCanvasRef, e);
			console.log('handleColorBarChange', x, y);
			drawColorBar();
			// const imageData = colorBarCtx.getImageData(x, 0, 1, 1).data;
			hue = (x / 256) * 360;
			handleGradientCanvasChnage({
				offsetX: selectedX,
				offsetY: selectedY,
				force: true
			});
			drawColorbarSelector(x, 0);
		}
	};

	const handleAlphaBarChange = (e: any) => {
		if (!isAlphaDragging && !e.force) return;
		if (e) {
			let { x, y } = getEventCoodinates(gradientCanvasRef, e);
			drawAlphaBar();
			const alpha = x / 256;
			selectedColor.a = alpha;
			updateSelectedColor();
			handleGradientCanvasChnage({ offsetX: selectedX, offsetY: selectedY, force: true });
			drawAlphabarSelector(x, 0);
		}
	};

	const drawGradientSelector = (x: number = 0, y: number = 0) => {
		if (gradientCtx) {
			gradientCtx.shadowColor = 'gray';
			gradientCtx.shadowBlur = 4;
			gradientCtx.shadowOffsetX = 2;
			gradientCtx.shadowOffsetY = 2;

			gradientCtx.strokeStyle = '#ffffff';
			gradientCtx.lineWidth = 4;

			gradientCtx.beginPath();
			gradientCtx.arc(x, y, 10, 0, 2 * Math.PI);
			gradientCtx.stroke();
		}
	};

	function drawTransparentGrid() {
		if (alphaBarCtx) {
			let gridSize = 8;
			const color1 = 'rgba(255, 255, 255, 1)'; // Light color
			const color2 = 'rgba(204, 204, 204, 1)'; // Dark color
			for (let x = 0; x < alphaBarWidth; x += gridSize) {
				for (let y = 0; y < alphaBarHeight; y += gridSize) {
					alphaBarCtx.fillStyle = (x / gridSize) % 2 === (y / gridSize) % 2 ? color1 : color2;
					alphaBarCtx.fillRect(x, y, gridSize, gridSize);
				}
			}
		}
	}

	const init = () => {
		gradientCtx = gradientCanvasRef.getContext('2d');
		colorBarCtx = colorBarCanvasRef.getContext('2d');
		alphaBarCtx = alphaCanvasRef.getContext('2d');
	};

	onMount(() => {
		init();
		drawAlphaBar();
		drawGradient();
		drawColorBar();
		updateSelectedColor();
	});
</script>

<div class="picker-container">
	<div>
		<div class="canvas-container">
			<div>
				<canvas
					id="gradient"
					bind:this={gradientCanvasRef}
					width="256"
					height="256"
					on:click={(e) => handleGradientCanvasChnage(e)}
					on:touchmove|stopPropagation|preventDefault={(e) => handleGradientCanvasChnage(e)}
					on:touchstart|stopPropagation|preventDefault={(e) => (
						(isGradientDragging = true), handleGradientCanvasChnage(e)
					)}
					on:touchend|stopPropagation|preventDefault={() => (isGradientDragging = false)}
					on:mousemove|stopPropagation|preventDefault={(e) => handleGradientCanvasChnage(e)}
					on:mousedown|stopPropagation|preventDefault={(e) => (
						(isGradientDragging = true), handleGradientCanvasChnage(e)
					)}
					on:mouseup|stopPropagation|preventDefault={() => (isGradientDragging = false)}
				/>
			</div>
			<div>
				<canvas
					id="colorBar"
					bind:this={colorBarCanvasRef}
					width="256"
					height="20"
					style=""
					class="color-bar"
					on:touchmove|stopPropagation|preventDefault={(e) => handleColorBarChange(e)}
					on:touchstart|stopPropagation|preventDefault={(e) => (
						(isColorBarDragging = true), handleColorBarChange(e)
					)}
					on:touchend|stopPropagation|preventDefault={() => (isColorBarDragging = false)}
					on:mousemove|stopPropagation|preventDefault={(e) => handleColorBarChange(e)}
					on:mousedown|stopPropagation|preventDefault={(e) => (
						(isColorBarDragging = true), handleColorBarChange(e)
					)}
					on:mouseup|stopPropagation|preventDefault={() => (isColorBarDragging = false)}
				/>
			</div>

			<div>
				<canvas
					id="alphaBar"
					bind:this={alphaCanvasRef}
					width="256"
					height="20"
					style=""
					class="alpha-bar"
					on:touchmove|stopPropagation|preventDefault={(e) => handleAlphaBarChange(e)}
					on:touchstart|stopPropagation|preventDefault={(e) => (
						(isAlphaDragging = true), handleAlphaBarChange(e)
					)}
					on:touchend|stopPropagation|preventDefault={() => (isAlphaDragging = false)}
					on:mousemove|stopPropagation|preventDefault={(e) => handleAlphaBarChange(e)}
					on:mousedown|stopPropagation|preventDefault={(e) => (
						(isAlphaDragging = true), handleAlphaBarChange(e)
					)}
					on:mouseup|stopPropagation|preventDefault={() => (isAlphaDragging = false)}
				/>
			</div>
		</div>
		<div class="color-container">
			<div
				id="selectedColor"
				class="color-selector"
				bind:this={selectedColorDivRef}
				style="background-color:{rgbaColor}"
				title={hexColor}
			>
				<div>{hexColor}</div>
			</div>
			<!-- <input type="text" bind:value={hexColor} class="color-display" readonly /> -->
		</div>
	</div>
</div>

<style>
	canvas {
		border: 1px solid #d1d1d1;
		border-radius: 3px;
	}
	.color-selector {
		width: 50px;
		height: 50px;
		border: 1px solid #d1d1d1;
		margin-top: 10px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.color-selector > div {
		font-size: 10px;
		color: white;
		text-shadow: 1px 1px 2px #000;
	}

	.color-display {
		background-color: #f5f5f5;
		border: none;
		outline: none;
		margin-left: 16px;
		border-radius: 5px;
		padding: 8px 16px;
	}
	.color-container {
		display: flex;
		align-items: end;
	}
	.picker-container {
		display: flex;
		justify-content: center;
	}
	.color-bar {
		margin-top: 8px;
	}
	.alpha-bar {
		margin-top: 8px;
	}
</style>
