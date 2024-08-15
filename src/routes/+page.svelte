<script lang="ts">
	import EasyColorPicker from '$lib';
	import ColorAlphaBar from '$lib/color-alpha-bar.svelte';

	let selectedColor = $state('#0000ff');
	let selectedAlpha = $state(1);

	function handleColorChange(color: string) {
		console.log(color);
		selectedColor = color;
	}

	function handleAlpha(alpha: number) {
		selectedAlpha = alpha;
	}
</script>

<!-- 
<EasyColorPicker
	bind:color={selectedColor}
	onColor={handleColorChange}
	rgbaFormat={false}
	colorPalletes={['#f57f17', '#00c853', '#00bfa5', '#2962ff']}
/> -->
<div>
	<ColorAlphaBar onAlpha={handleAlpha} height={50} />
</div>
<div>
	{selectedAlpha}
</div>
