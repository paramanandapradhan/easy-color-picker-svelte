<script lang="ts">
	import { getCanvasEventXY, hexToRGBA } from './utils';

	type PropsType = {
		id?: string;
		containerClassName?: string;
		innerClassName?: string;
		className?: string;
		height?: number;
		width?: number;
		direction?: 'X' | 'Y';
		onAlpha?: (alpha: number) => void;
	};

	let {
		id,
		containerClassName,
		innerClassName,
		className,
		height = 8,
		width = 0,
		direction = 'X',
		onAlpha
	}: PropsType = $props();

	let alapha: number = $state(1);

	let isAlphaDragging: boolean = $state(false);

	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);

	function drawAlphaBar() {
		if (canvas && ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// draw transparent checkboard
			let gridSize = height / 2;
			const color1 = 'rgba(255, 255, 255, 1)'; // Light color
			const color2 = 'rgba(204, 204, 204, 1)'; // Dark color
			for (let x = 0; x < canvas.width; x += gridSize) {
				for (let y = 0; y < canvas.height; y += gridSize) {
					ctx.fillStyle = (x / gridSize) % 2 === (y / gridSize) % 2 ? color1 : color2;
					ctx.fillRect(x, y, gridSize, gridSize);
				}
			}

			// Draw alpga gradient
			let alphaGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
			alphaGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
			alphaGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

			ctx.fillStyle = alphaGradient;

			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	const drawAlphaSelector = (x: number = 0, y: number = 0) => {
		if (ctx) {
			let lineWidth = height * 0.2;
			ctx.save();
			ctx.shadowColor = 'gray';
			ctx.shadowBlur = 2;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = height / 2 / 2;
			ctx.beginPath();
			ctx.arc(x, height / 2, height / 2 - lineWidth, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.restore();
		}
	};

	function pickAlpha(event: MouseEvent | TouchEvent) {
		if (canvas && ctx) {
			if (!isAlphaDragging) return;
			drawAlphaBar();

			let { x, y } = getCanvasEventXY(canvas, event);
			alapha = (x / 255) * (255 / width);
			if (alapha < 0.01) alapha = 0;
			if (alapha > 0.99) alapha = 1;

			drawAlphaSelector(x, y);

			onAlpha && onAlpha(alapha);
		}
	}

	function blockEvent(event: MouseEvent | TouchEvent) {
		if (event?.stopPropagation) {
			event.stopPropagation();
		}
		if (event?.preventDefault) {
			event.preventDefault();
		}
	}

	function handleAlphaMouseDown(event: MouseEvent | TouchEvent) {
		blockEvent(event);
		isAlphaDragging = true;
		pickAlpha(event);
	}

	function handleAlphaMouseMove(event: MouseEvent | TouchEvent) {
		blockEvent(event);
		pickAlpha(event);
	}

	function handleAlphaMouseEnd(event: MouseEvent | TouchEvent) {
		blockEvent(event);
		isAlphaDragging = false;
	}

	$effect(() => {
		if (canvas && width && height) {
			if (!ctx) {
				ctx = canvas.getContext('2d', { willReadFrequently: true }) as any;
			}
			setTimeout(() => {
				drawAlphaBar();
				drawAlphaSelector();
			}, 100);
		}
	});
</script>

<div class="alpha-bar-container {containerClassName}">
	<div class="alpha-bar-inner {innerClassName}" bind:clientWidth={width}>
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<canvas
			{id}
			class={className}
			bind:this={canvas}
			{width}
			{height}
			ontouchstart={handleAlphaMouseDown}
			ontouchmove={handleAlphaMouseMove}
			ontouchend={handleAlphaMouseEnd}
			onmousedown={handleAlphaMouseDown}
			onmousemove={handleAlphaMouseMove}
			onmouseup={handleAlphaMouseEnd}
		/>
	</div>
</div>

<style>
	.canvas {
		width: 100%;
		height: 4px;
	}

	.alpha-bar-container {
		min-height: 4px;
	}

	.alpha-bar-inner {
		height: 100%;
		width: 100%;
	}
</style>
