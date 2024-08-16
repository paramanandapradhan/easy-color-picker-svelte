<script context="module" lang="ts">
	export type EasyColorPickerPropsType = {
		hasAlphaBar?: boolean;
		hasColorPalletes?: boolean;
		colorPalletes?: string[];
		color?: string;
		alphaBarHeight?: number;
		copiedText?: string;
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
	<div class="">
		<ColorBoard {color} size={clientWidth} onColor={handleColorChange} bind:this={colorBoardRef} />
	</div>
	{#if hasAlphaBar}
		<div class="pt-8">
			<ColorAlphaBar
				{color}
				height={alphaBarHeight}
				width={clientWidth}
				onAlpha={handleAlphaChange}
				bind:this={colorAlphaBarRef}
			/>
		</div>
	{/if}
	{#if hasColorPalletes}
		<div class="pt-8 center">
			<ColorPalletes {color} {copiedText} {colorPalletes} onColor={handlePalletColorChange} />
		</div>
	{/if}
</div>

<style>
	.pt-8 {
		margin-top: 8px;
	}

	.center {
		overflow-x: auto;
	}
</style>
