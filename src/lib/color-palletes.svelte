<script context="module" lang="ts">
	export type ColorPalletesPropsType = {
		copiedText?: string;
		color?: string;
		colorPalletes?: string[];
		className?: string;
		palleteButtonclassName?: string;
		previewButtonclassName?: string;
		onColor?: (color: string) => void;
	};
</script>

<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { blockEvent, copyText, isValidHexColor } from './utils';

	let {
		copiedText = 'Copied!',
		color = '#0000ff',
		colorPalletes = [],
		className = '',
		palleteButtonclassName = '',
		previewButtonclassName = '',
		onColor
	}: ColorPalletesPropsType = $props();

	let isCopied: boolean = $state(false);
	let oldColor: string = $state('#0000ff');
	let palletes: string[] = $state([]);

	const KEY_COLORS = 'easy.colors.values';

	let defaultColorPalletes: string[] = [
		'#f44336',
		'#E91E63',
		'#9c27b0',
		'#673ab7',
		'#3f51b5',
		'#2196F3',
		'#03a9f4',
		'#00bcd4',
		'#009688',
		'#4caf50',
		'#8bc34a',
		'#cddc39',
		'#ffeb3b',
		'#ffc107',
		'#ff9800',
		'#ff5722',
		'#795548',
		'#9e9e9e',
		'#607d8b',
		'#ffffff',
		'#000000'
	];

	export function saveLocalColor(color: string) {
		if (BROWSER && localStorage && isValidHexColor(color)) {
			let colors = getLocalColors() || [];
			colors.unshift(color);
			colors = Array.from(new Set(colors));
			colors = colors.slice(0, 10);
			localStorage.setItem(KEY_COLORS, colors.join(','));
		}
		return getLocalColors();
	}

	function calculatePalletes(_?: string[]) {
		let newpalletes = [...colorPalletes.slice(0, 4), ...defaultColorPalletes];
		let colors: string[] = getLocalColors();
		let array: string[] = [];
		for (let i = 0; i < 30 - newpalletes.length; i++) {
			let c = colors[i];
			if (c) {
				array.push(c);
			} else {
				array.push('#ffffff');
			}
		}

		palletes = [...array, ...newpalletes];
	}

	function getLocalColors(): string[] {
		let results: string[] = [];
		if (BROWSER && localStorage) {
			let str = localStorage.getItem(KEY_COLORS) || '';
			results = str.split(',').filter((o) => isValidHexColor(o));
		}
		return results;
	}

	function handleCopy() {
		isCopied = true;
		copyText(color);
		onColor && onColor(color);
		setTimeout(() => {
			isCopied = false;
		}, 700);
		saveLocalColor(color);
	}

	function handleInputFocus(e: any) {
		if (e.target) {
			setTimeout(() => {
				oldColor = color;
				e.target.select();
			}, 200);
		}
	}

	function handleEnterKey(event: any) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			onColor && onColor(color);
		}
	}

	$effect(() => {
		calculatePalletes(colorPalletes);
	});
</script>

<div class="color-container {className}">
	<div class="color-container">
		<button
			class="color-preview {previewButtonclassName}"
			style="--bgColor:{color};"
			title={color}
			onclick={handleCopy}
		>
			{#if isCopied}
				<span>{copiedText}</span>
			{:else}
				<input
					name="color"
					id="color-input"
					onclick={(event) => blockEvent(event)}
					bind:value={color}
					onfocus={handleInputFocus}
					onblur={() => onColor && onColor(color)}
					onkeydown={handleEnterKey}
				/>
			{/if}
		</button>
		<div class="color-palletes {className}">
			{#if palletes}
				{#each palletes as item}
					<button
						class="btn btn-sm p-0 pallete {palleteButtonclassName}"
						style:background-color={item}
						onclick={() => onColor && onColor(item)}
					>
						&nbsp;
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.color-container {
		display: flex;
		justify-content: start;
	}
	.color-preview {
		height: 64px;
		width: 64px;
		border: 1px solid #d1d1d1;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffffaa;
		font-size: 10px;
		text-shadow: 1px 1px 1px #000;
		background-color: var(--bgColor);
		input {
			border: none;
			padding: 0;
			width: 100%;
			color: #fff;
			font-size: 10px;
			text-shadow: 1px 1px 1px #000;
			background-color: transparent;
			outline: none;
			text-align: center;
		}
	}
	.color-palletes {
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		max-width: 184px;
		padding: 0 2px;
		margin-left: 6px;
		.pallete {
			width: 16px;
			margin: 1px;
			height: 16px;
			border: 1px solid #d1d1d1;
			border-radius: 2px;
			cursor: pointer;
		}
		.pallete:hover {
			border: 1px solid #b1b1b1;
		}
	}
</style>
