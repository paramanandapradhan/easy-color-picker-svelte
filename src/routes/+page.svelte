<script lang="ts">
	import EasyColorPicker from '$lib';
	import ColorAlphaBar, { AlphaBarDirectionEnum } from '$lib/color-alpha-bar.svelte';
	import ColorBoard from '$lib/color-board.svelte';
	import ColorPalletes from '$lib/color-palletes.svelte';

	let color = $state('#0000ff');
	let selectedAlpha = $state(1);

	function handleColorChange(color: string) {
		console.log(color);
		// selectedColor = color;
	}

	function handleAlpha(alpha: number) {
		selectedAlpha = alpha;
	}

	// function handleColor(color: string) {
	// 	color = color;
	// }
</script>

<!-- 
<EasyColorPicker
	bind:color={selectedColor}
	onColor={handleColorChange}
	rgbaFormat={false}
	colorPalletes={['#f57f17', '#00c853', '#00bfa5', '#2962ff']}
/> -->
<!-- <div>
	<ColorAlphaBar
		onAlpha={handleAlpha}
		height={200}
		width={20}
		direction={AlphaBarDirectionEnum.VERTICAL}
		reverse
	/>
</div>
<div>
	{selectedAlpha}
</div> -->

<ColorBoard size={100} bind:color></ColorBoard>

<div>{color}</div>

<ColorPalletes />
