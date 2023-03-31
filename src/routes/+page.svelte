<script lang="ts">
	import EasyColorPicker from '$lib';
	const handleColorChange = (ev: CustomEvent) => {
		let color = ev.detail;
		console.log(color);
	};
</script>

<EasyColorPicker on:change={handleColorChange} rgbaOutput />
