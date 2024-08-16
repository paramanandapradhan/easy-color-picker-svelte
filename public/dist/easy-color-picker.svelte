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
