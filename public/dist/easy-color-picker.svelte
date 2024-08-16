<script context="module" lang="ts"></script>

<script lang="ts">import ColorAlphaBar from "./color-alpha-bar.svelte";
import ColorBoard from "./color-board.svelte";
import ColorPalletes from "./color-palletes.svelte";
let {
  hasAlphaBar = true,
  hasColorPalletes = true,
  colorPalletes = [],
  alphaBarHeight = 24,
  copiedText,
  color = $bindable("#0000ff"),
  colorBoardClassName = "",
  alphaBarClassName = "",
  colorPalletesClassName = "",
  colorBoardContainerClassName = "",
  alphaBarContainerClassName = "",
  colorPalletesContainerClassName = "",
  colorPalletesPreviewButtonClassName = "",
  colorPalletesPallateButtonClassName = "",
  onColor
} = $props();
let clientHeight = $state(0);
let clientWidth = $state(0);
let colorBoardRef;
let colorAlphaBarRef;
function handleColorChange(newcolor) {
  color = newcolor;
  onColor && onColor(color);
}
function handlePalletColorChange(color2) {
  colorBoardRef && colorBoardRef.setColor(color2);
}
function handleAlphaChange(alpha) {
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
		<div class="my-16 center {colorPalletesContainerClassName}">
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
</style>
