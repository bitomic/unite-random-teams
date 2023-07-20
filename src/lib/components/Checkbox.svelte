<script lang="ts">
    import { matchroom } from '$lib/client/stores/matchroom';
    import type { BaseStrategy } from '$lib/client/strategies/BaseStrategy'
    import { onMount } from 'svelte';

	export let strategy: BaseStrategy
	let checkbox: HTMLInputElement

	const change = ( e: Event & { currentTarget: EventTarget & HTMLInputElement } ) => {
		const cb = e.currentTarget
		if ( cb.checked ) {
			$matchroom.pickStrategies.addStrategy( strategy )
		} else {
			$matchroom.pickStrategies.removeStrategy( strategy )
		}
	}

	onMount( () => {
		if ( !checkbox ) return
		checkbox.checked = $matchroom.pickStrategies.hasStrategy( strategy.identifier )
	} )
</script>

<div class="checkbox">
	<input type="checkbox" on:change={ change } bind:this={ checkbox }>
	<label for=""> <slot /> </label>
</div>

<style>
.checkbox {
	align-items: center;
	column-gap: 0.85em;
	display: flex;
	margin: 0.75em 0;
}
input {
	height: 25px;
	width: 25px;
}
</style>