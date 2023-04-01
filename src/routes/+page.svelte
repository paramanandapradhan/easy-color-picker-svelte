<script lang="ts">
	import EasyColorPicker from '$lib';
	
	const handleColorChange = (ev: CustomEvent) => {
		let color = ev.detail;
		console.log(color);
	};
</script>

<EasyColorPicker
	on:color={handleColorChange}
	rgbaFormat={false}
	colorPalletes={['#f57f17', '#00c853', '#00bfa5', '#2962ff']}
/>
