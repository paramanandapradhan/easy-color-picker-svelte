<script lang="ts">
	import EasyColorPicker from '$lib/easy-color-picker.svelte';

	let selectedColor = $state();
	function handleColor(color: string) {
		selectedColor = color;
	}
</script>

<div style="width:300px">
	<EasyColorPicker color="#ff0000" onColor={handleColor} colorPalletes={['#f57f17', '#00c853', '#00bfa5', '#2962ff']}></EasyColorPicker>
</div>

<div>
	{selectedColor}
</div>
