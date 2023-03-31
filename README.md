# easy-color-picker

Implement this simple and lightweight color picker specifically for Svelte without any dependencies, maintaining a small package footprint. Easily obtain the color value by utilizing the on:change event for the picker. Simply add it to any component.

# Install
```sh
npm install @cloudparker/easy-color-picker-svelte --save-dev
```

# Screenshot

<img src="https://raw.githubusercontent.com/paramanandapradhan/screenshots/master/%40cloudparker/easy-color-picker/screenshot.webp" width="340">

# Sample
```html
<script lang="ts">
	import EasyColorPicker from '$lib';
	const handleColorChange = (ev: CustomEvent) => {
		let color = ev.detail;
		console.log(color);
	};
</script>

<EasyColorPicker on:change={handleColorChange} rgbaOutput />
```

# Demo
NA

# Props
### rgbaOutput
default: false
Enable this when the rgba color value required, by default the color picker return hex color value.

# Events
on:change
Tigger with the color value `rgba` or `hex` format when color chnaged.

