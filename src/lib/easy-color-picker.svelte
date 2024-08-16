<script context="module" lang="ts">
	export type EasyColorPickerPropsType = {
		hasAlphaBar?: boolean;
		hasColorPalletes?: boolean;
		colorPalletes?: string[];
		color?: string;
		alphaBarHeight?: number;
		copiedText?: string;
		colorBoardClassName?: string;
		alphaBarClassName?: string;
		colorPalletesClassName?: string;
		colorBoardContainerClassName?: string;
		alphaBarContainerClassName?: string;
		colorPalletesContainerClassName?: string;
		colorPalletesPreviewButtonClassName?: string;
		colorPalletesPallateButtonClassName?: string;
		onColor?: (color: string) => void;
	};
</script>

<script lang="ts">
	import ColorAlphaBar from './color-alpha-bar.svelte';
	import ColorBoard from './color-board.svelte';
	import ColorPalletes from './color-palletes.svelte';

	let {
		hasAlphaBar = true,
		hasColorPalletes = true,
		colorPalletes = [],
		alphaBarHeight = 24,
		copiedText,
		color = $bindable('#0000ff'),
		colorBoardClassName = '',
		alphaBarClassName = '',
		colorPalletesClassName = '',
		colorBoardContainerClassName = '',
		alphaBarContainerClassName = '',
		colorPalletesContainerClassName = '',
		colorPalletesPreviewButtonClassName = '',
		colorPalletesPallateButtonClassName = '',
		onColor
	}: EasyColorPickerPropsType = $props();

	let clientHeight: number = $state(0);
	let clientWidth: number = $state(0);

	let colorBoardRef: ColorBoard;
	let colorAlphaBarRef: ColorAlphaBar;

	function handleColorChange(newcolor: string) {
		color = newcolor;
		onColor && onColor(color);
	}

	function handlePalletColorChange(color: string) {
		colorBoardRef && colorBoardRef.setColor(color);
	}

	function handleAlphaChange(alpha: number) {
		colorBoardRef && colorBoardRef.setAlpha(alpha);
	}
</script>

<div bind:clientHeight bind:clientWidth>
	<div class={colorBoardContainerClassName}>
		<ColorBoard
			className={colorBoardClassName}
			{color}
			size={clientWidth}
			onColor={handleColorChange}
			bind:this={colorBoardRef}
		/>
	</div>
	{#if hasAlphaBar}
		<div class="my-16 {alphaBarContainerClassName}">
			<ColorAlphaBar
				className={alphaBarClassName}
				{color}
				height={alphaBarHeight}
				width={clientWidth}
				onAlpha={handleAlphaChange}
				bind:this={colorAlphaBarRef}
			/>
		</div>
	{/if}
	{#if hasColorPalletes}
		<div class="my-16 center pallete-container {colorPalletesContainerClassName}">
			<ColorPalletes
				className={colorPalletesClassName}
				previewButtonclassName={colorPalletesPreviewButtonClassName}
				palleteButtonclassName={colorPalletesPallateButtonClassName}
				{color}
				{copiedText}
				{colorPalletes}
				onColor={handlePalletColorChange}
			/>
		</div>
	{/if}
</div>

<style>
	.my-16 {
		margin-top: 16px;
		margin-bottom: 16px;
	}

	.center {
		overflow-x: auto;
	}
	.pallete-container {
		min-height: 64px;
	}
</style>
