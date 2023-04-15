<script lang="ts">
	import {
		copyText,
		createGradientCanvas,
		getCanvasEventXY,
		hexToHsl,
		hexToRGBA,
		isValidHexColor,
		rgbaToHex
	} from './utils';
	import { onMount, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

	let defaultColorPalletes: string[] = [
		'#f44336',
		'#E91E63',
		'#9c27b0',
		'#673ab7',
		'#3f51b5',
		'#2196F3',
		'#03a9f4',
		'#00bcd4',
		'#009688',
		'#4caf50',
		'#8bc34a',
		'#cddc39',
		'#ffeb3b',
		'#ffc107',
		'#ff9800',
		'#ff5722',
		'#795548',
		'#9e9e9e',
		'#607d8b',
		'#ffffff',
		'#000000'
	];

	export let color = '#0000ff';
	export let rgbaFormat: boolean = false;
	export let copyString = 'Copied!';
	export let colorPalletes: string[] = [];

	const dispatch = createEventDispatcher();
	let canvas: HTMLCanvasElement;
	let alphaCanvas: HTMLCanvasElement;

	let ctx: CanvasRenderingContext2D;
	let alphaCtx: CanvasRenderingContext2D;
	let gradient: CanvasGradient;
	let alphaGradient: CanvasGradient;
	let isGradientDragging: boolean = false;
	let isAlphaDragging: boolean = false;
	let rgba: { r: number; g: number; b: number; a: number } = { r: 255, g: 255, b: 255, a: 1 };
	let oldColor: string;
	let isCopied: boolean = false;
	let palletes: string[] = [];
	let offscreenGradientCanvas:any;

	const KEY_COLORS = 'easy.colors.values';

	$: calculatePalletes(palletes);

	export function save(color: string) {
		if (isValidHexColor(color)) {
			setColor(color);
			saveLocalColor(color);
			calculatePalletes();
			selectColor();
		}
	}

	onMount(() => {
		rgba = hexToRGBA(color);
		ctx = canvas.getContext('2d', { willReadFrequently: true }) as any;
		alphaCtx = alphaCanvas.getContext('2d') as any;
		drawColor();
		drawAlphaBar();
		setColor(color);
	});

	function calculatePalletes(_?: string[]) {
		palletes = [...colorPalletes.slice(0, 4), ...defaultColorPalletes];
		let colors: string[] = getLocalColors();
		let array: string[] = [];
		for (let i = 0; i < 30 - palletes.length; i++) {
			let c = colors[i];
			if (c) {
				array.push(c);
			} else {
				array.push('#ffffff');
			}
		}
		palletes = [...array, ...palletes];
	}

	function saveLocalColor(color: string) {
		if (browser && localStorage && isValidHexColor(color)) {
			let colors = getLocalColors() || [];
			colors.unshift(color);
			colors = Array.from(new Set(colors));
			colors = colors.slice(0, 10);
			localStorage.setItem(KEY_COLORS, colors.join(','));
		}
		return getLocalColors();
	}

	function getLocalColors(): string[] {
		let results: string[] = [];
		if (browser && localStorage) {
			let str = localStorage.getItem(KEY_COLORS) || '';
			results = str.split(',').filter((o) => isValidHexColor(o));
		}
		return results;
	}

	function drawColor() {
 		if(!offscreenGradientCanvas){
			offscreenGradientCanvas = createGradientCanvas(canvas.width,canvas.height);
		}
		ctx.drawImage(offscreenGradientCanvas, 0, 0);
	}

	function drawAlphaBar() {
		alphaCtx.clearRect(0, 0, alphaCanvas.width, alphaCanvas.height);

		// draw transparent checkboard
		let gridSize = 10;
		const color1 = 'rgba(255, 255, 255, 1)'; // Light color
		const color2 = 'rgba(204, 204, 204, 1)'; // Dark color
		for (let x = 0; x < alphaCanvas.width; x += gridSize) {
			for (let y = 0; y < alphaCanvas.height; y += gridSize) {
				alphaCtx.fillStyle = (x / gridSize) % 2 === (y / gridSize) % 2 ? color1 : color2;
				alphaCtx.fillRect(x, y, gridSize, gridSize);
			}
		}

		// Draw alpga gradient
		alphaGradient = alphaCtx.createLinearGradient(0, 0, alphaCanvas.width, 0);
		alphaGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
		alphaGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
		alphaCtx.fillStyle = alphaGradient;
		alphaCtx.fillRect(0, 0, alphaCanvas.width, alphaCanvas.height);
	}

	function pickColor(event: any) {
		if (!isGradientDragging && !!!event.color) return;
		let { x, y } = getCanvasEventXY(canvas, event);
		drawColor();
		if (event.color) {
			let { r, g, b } = hexToRGBA(event.color);
			rgba = { ...rgba, ...{ r, g, b } };
		} else {
			const imageData = ctx.getImageData(x, y, 1, 1).data;
			const [r, g, b] = imageData;
			rgba = { ...rgba, ...{ r, g, b } };
		}
		drawColorSelector(x, y);
		selectColor();
	}

	function pickAlpha(event: any) {
		if (!isAlphaDragging && !!!event.color) return;
		drawAlphaBar();
		let { x, y } = getCanvasEventXY(alphaCanvas, event);
		if (event.color) {
			let { a } = hexToRGBA(event.color);
			rgba.a = a;
		} else {
			if (x < 3) x = 0;
			if (x > 252) x = 255;
			rgba.a = x / 255;
		}
		drawAlphaSelector(x, y);
		selectColor();
	}

	function drawColorSelector(x: number = 0, y: number = 0) {
		if (ctx) {
			ctx.save();
			ctx.shadowColor = 'gray';
			ctx.shadowBlur = 3;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(x, y, 6, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.restore();
		}
	}

	const drawAlphaSelector = (x: number = 0, y: number = 0) => {
		if (alphaCtx) {
			alphaCtx.save();
			alphaCtx.shadowColor = 'gray';
			alphaCtx.shadowBlur = 2;
			alphaCtx.shadowOffsetX = 1;
			alphaCtx.shadowOffsetY = 1;
			alphaCtx.strokeStyle = '#000';
			alphaCtx.lineWidth = 4;
			alphaCtx.beginPath();
			alphaCtx.arc(x, 10, 6, 0, 2 * Math.PI);
			alphaCtx.stroke();
			alphaCtx.restore();
		}
	};

	function selectColor() {
		let rgbaColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
		let hexColor = rgbaToHex(rgbaColor);
		if (hexColor != color) {
			color = hexColor;
			if (rgbaFormat) {
				dispatch('color', rgbaColor);
			} else {
				dispatch('color', color);
			}
		}
	}

	function estimateColorPosition(hex: string) {
		const hsl = hexToHsl(hex);
		const rgba = hexToRGBA(hex);
		const x = Math.round((hsl.h / 360) * canvas.width);
		const y = Math.round((1 - hsl.l / 100) * canvas.height);
		return { x, y, a: rgba.a };
	}

	function setColor(color: string) {
		if (color && isValidHexColor(color)) {
			const { x, y, a } = estimateColorPosition(color);
			pickColor({ offsetX: x, offsetY: y, color });
			pickAlpha({ offsetX: a * 255, offsetY: 10, color });
		} else {
			color = oldColor;
		}
	}

	function handleCopy() {
		isCopied = true;
		copyText(color);
		dispatch('copy', color);
		setTimeout(() => {
			isCopied = false;
		}, 700);
		save(color);
	}

	function handleInputFocus(e: any) {
		if (e.target) {
			setTimeout(() => {
				oldColor = color;
				e.target.select();
			}, 200);
		}
	}

	function handleEnterKey(event: any) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			setColor(color);
		}
	}
</script>

<div class="color-picker-container">
	<div>
		<div class="gradient-container">
			<canvas
				bind:this={canvas}
				width="255"
				height="255"
				on:touchmove|stopPropagation|preventDefault={(e) => pickColor(e)}
				on:touchstart|stopPropagation|preventDefault={(e) => (
					(isGradientDragging = true), pickColor(e)
				)}
				on:touchend|stopPropagation|preventDefault={() => (isGradientDragging = false)}
				on:mousemove|stopPropagation|preventDefault={(e) => pickColor(e)}
				on:mousedown|stopPropagation|preventDefault={(e) => (
					(isGradientDragging = true), pickColor(e)
				)}
				on:mouseup|stopPropagation|preventDefault={() => (isGradientDragging = false)}
			/>
		</div>
		<div class="alpha-container">
			<canvas
				bind:this={alphaCanvas}
				width="255"
				height="20"
				on:touchmove|stopPropagation|preventDefault={(e) => pickAlpha(e)}
				on:touchstart|stopPropagation|preventDefault={(e) => (
					(isAlphaDragging = true), pickAlpha(e)
				)}
				on:touchend|stopPropagation|preventDefault={() => (isAlphaDragging = false)}
				on:mousemove|stopPropagation|preventDefault={(e) => pickAlpha(e)}
				on:mousedown|stopPropagation|preventDefault={(e) => (
					(isAlphaDragging = true), pickAlpha(e)
				)}
				on:mouseup|stopPropagation|preventDefault={() => (isAlphaDragging = false)}
			/>
		</div>
		<div class="color-container">
			<button
				class="color-preview"
				style:background-color={color}
				title={color}
				on:click={handleCopy}
			>
				{#if isCopied}
					<span>{copyString}</span>
				{:else}
					<input
						name="color"
						id="color-input"
						on:click|stopPropagation|preventDefault
						bind:value={color}
						on:focus={handleInputFocus}
						on:blur={() => setColor(color)}
						on:keydown={handleEnterKey}
					/>
				{/if}
			</button>
			<div class="color-palletes">
				{#each palletes as item}
					<button
						class="btn btn-sm p-0 pallete"
						style:background-color={item}
						on:click={() => setColor(item)}>&nbsp;</button
					>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.color-picker-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	canvas {
		border: 1px solid #d1d1d1;
		cursor: crosshair;
		border-radius: 5px;
	}

	.alpha-container {
		margin-top: 8px;
	}
	.color-container {
		display: flex;
		margin-top: 8px;
		justify-content: start;
	}
	.color-preview {
		height: 64px;
		width: 64px;
		border: 1px solid #d1d1d1;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffffaa;
		font-size: 10px;
		text-shadow: 1px 1px 1px #000;

		input {
			border: none;
			padding: 0;
			width: 100%;
			color: #fff;
			font-size: 10px;
			text-shadow: 1px 1px 1px #000;
			background-color: transparent;
			outline: none;
			text-align: center;
		}
	}
	.color-palletes {
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		max-width: 184px;
		padding: 0 2px;
		margin-left: 6px;
		.pallete {
			width: 16px;
			margin: 1px;
			height: 16px;
			border: 1px solid #d1d1d1;
			border-radius: 2px;
			cursor: pointer;
		}
		.pallete:hover {
			border: 1px solid #b1b1b1;
		}
	}
</style>
