<script lang="ts" context="module">
	export enum AlphaBarDirectionEnum {
		HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical'
	}
	type AlphaBarPropsType = {
		id?: string;
		containerClassName?: string;
		innerClassName?: string;
		className?: string;
		height?: number;
		width?: number;
		alpha?: number;
		direction?: AlphaBarDirectionEnum;
		color?: string;
		reverse?: boolean;
		onAlpha?: (alpha: number) => void;
	};
</script>

<script lang="ts">
	import { getCanvasEventXY, hexToRGBA } from './utils';

	let {
		id,
		containerClassName,
		innerClassName,
		className,
		height = 0,
		width = 0,
		direction = AlphaBarDirectionEnum.HORIZONTAL,
		alpha = $bindable(1),
		color,
		reverse = false,
		onAlpha
	}: AlphaBarPropsType = $props();

	let clientHeight: number = $state(0);
	let clientWidth: number = $state(0);

	let isAlphaDragging: boolean = $state(false);

	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);

	function isHorizontalDirection() {
		return direction === AlphaBarDirectionEnum.HORIZONTAL;
	}

	function drawAlphaBar() {
		if (canvas && ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			let size = isHorizontalDirection() ? height : width;

			let gridSize = size / 2;
			const color1 = 'rgba(255, 255, 255, 1)'; // Light color
			const color2 = 'rgba(204, 204, 204, 1)'; // Dark color
			for (let x = 0; x < canvas.width; x += gridSize) {
				for (let y = 0; y < canvas.height; y += gridSize) {
					ctx.fillStyle = (x / gridSize) % 2 === (y / gridSize) % 2 ? color1 : color2;
					ctx.fillRect(x, y, gridSize, gridSize);
				}
			}

			// Draw alpga gradient
			let alphaGradient = isHorizontalDirection()
				? ctx.createLinearGradient(0, 0, canvas.width, 0)
				: ctx.createLinearGradient(0, 0, 0, canvas.height);

			if (reverse) {
				alphaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
				alphaGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
			} else {
				alphaGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
				alphaGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
			}

			ctx.fillStyle = alphaGradient;

			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	const drawAlphaSelector = (x: number = 0, y: number = 0) => {
		if (ctx) {
			let barSize = isHorizontalDirection() ? width : height;
			let selectorSize = isHorizontalDirection() ? height : width;
			let axis = isHorizontalDirection() ? x : y;
			let lineWidth = selectorSize * 0.2;

			let strokeColor = '#fff';
			if (reverse) {
				strokeColor = axis < barSize / 2 ? '#fff' : '#000';
			} else {
				strokeColor = axis > barSize / 2 ? '#fff' : '#000';
			}

			ctx.save();
			ctx.shadowColor = 'gray';
			ctx.shadowBlur = 2;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = selectorSize / 2 / 2;
			ctx.beginPath();

			if (isHorizontalDirection()) {
				ctx.arc(axis, selectorSize / 2, selectorSize / 2 - lineWidth, 0, 2 * Math.PI);
			} else {
				ctx.arc(selectorSize / 2, axis, selectorSize / 2 - lineWidth, 0, 2 * Math.PI);
			}

			ctx.stroke();
			ctx.restore();
		}
	};

	function pickAlpha(event: MouseEvent | TouchEvent) {
		if (canvas && ctx) {
			if (!isAlphaDragging) return;
			drawAlphaBar();

			let { x, y } = getCanvasEventXY(canvas, event);
			let size = isHorizontalDirection() ? width : height;
			let axis = isHorizontalDirection() ? x : y;

			let value = axis;
			if (reverse) {
				value = size - axis;
			}
			alpha = (value / 255) * (255 / size);

			if (alpha < 0.01) alpha = 0;
			if (alpha > 0.99) alpha = 1;

			drawAlphaSelector(x, y);

			onAlpha && onAlpha(alpha);
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

	function getXYFromAlpha() {
		if (alpha != null) {
			let barSize = isHorizontalDirection() ? width : height;
			let axis = barSize * alpha;
			let x = width;
			let y = height;
			if (reverse) {
				axis = barSize - axis;
			}
			if (isHorizontalDirection()) {
				x = axis;
				y = height / 2;
			} else {
				x = width / 2;
				y = axis;
			}

			return [x, y];
		}
		return [0, 0];
	}

	$effect(() => {
		if (color) {
			let { r, g, b, a } = hexToRGBA(color);
			if (a != null) {
				alpha = a;
			}
		}
	});

	$effect(() => {
		if (canvas && width && height) {
			if (!ctx) {
				ctx = canvas.getContext('2d', { willReadFrequently: true }) as any;
			}
			setTimeout(() => {
				drawAlphaBar();
				getXYFromAlpha();
				drawAlphaSelector(...getXYFromAlpha());
			}, 100);
		}
	});
</script>

<div class="alpha-bar-container {containerClassName}">
	<div class="alpha-bar-inner {innerClassName}">
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
