<script lang="ts" context="module">
	export type ColorBoardPropsType = {
		size?: number;
		color?: string;
		className?: string;
		onColor?: (color: string) => void;
	};
</script>

<script lang="ts">
	import {
		blockEvent,
		createGradientCanvas,
		getCanvasEventXY,
		hexToHsl,
		hexToRGBA,
		isValidHexColor,
		rgbaToHex
	} from './utils';

	let {
		size = 255,
		color = $bindable('#0000ff'),
		className,
		onColor
	}: ColorBoardPropsType = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);
	let isGradientDragging: boolean | null = $state(null);

	let offscreenGradientCanvas: any;
	let rgba: { r: number; g: number; b: number; a: number } = $state({
		r: 255,
		g: 255,
		b: 255,
		a: 1
	});

	let width: number = $state(255);
	let height: number = $state(255);

	export function setAlpha(alpha: number) {
		rgba.a = alpha;
		selectColor();
	}

	export function setColor(color: string) {
		// console.log('setColor', color);
		if (color && isValidHexColor(color)) {
			const { x, y, a } = estimateColorPosition(color);
			// console.log('estimateColorPosition', { x, y, a });
			pickColor({ offsetX: x, offsetY: y }, color);
			// pickAlpha({ offsetX: a * 255, offsetY: 10, color });
		}

		// else {
		// 	color = oldColor;
		// }
	}

	function estimateColorPosition(hex: string) {
		if (canvas) {
			const hsl = hexToHsl(hex);
			const rgba = hexToRGBA(hex);
			const x = Math.round((hsl.h / 360) * canvas.width);
			const y = Math.round((1 - hsl.l / 100) * canvas.height);
			return { x, y, a: rgba.a };
		}
		return { x: 0, y: 0, a: 0 };
	}

	function selectColor() {
		let rgbaColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
		let hexColor = rgbaToHex(rgbaColor);
		if (hexColor != color) {
			color = hexColor;
			onColor && onColor(color);
		}
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

	function drawColor() {
		if (canvas && ctx) {
			if (!offscreenGradientCanvas) {
				offscreenGradientCanvas = createGradientCanvas(canvas.width, canvas.height);
			}
			ctx.drawImage(offscreenGradientCanvas, 0, 0);
		}
	}

	function pickColor(
		event: MouseEvent | TouchEvent | { offsetX: number; offsetY: number },
		color?: string
	) {
		if (canvas && ctx) {
			let { x, y } = getCanvasEventXY(canvas, event);
			drawColor();
			if (color) {
				let { r, g, b } = hexToRGBA(color);
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

	function handleColorMouseDown(event: MouseEvent | TouchEvent) {
		blockEvent(event);
		isGradientDragging = true;
		pickColor(event);
	}

	function handleColorMouseMove(event: MouseEvent | TouchEvent) {
		if (!isGradientDragging) return;
		blockEvent(event);
		pickColor(event);
	}

	function handleColorMouseEnd(event: MouseEvent | TouchEvent) {
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
					ctx = canvas.getContext('2d', { willReadFrequently: true }) as any;
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

<div class={className}>
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
