<script lang="ts">
    import { matchroom } from '$lib/client/stores/matchroom'
    import type { BaseStrategy } from '$lib/client/matchroom/strategies/BaseStrategy'
    import { onMount } from 'svelte'

	export let center = false
	export let strategy: BaseStrategy | null = null
	let checkbox: HTMLInputElement | null

	export let change = ( e: Event & { currentTarget: EventTarget & HTMLInputElement } ) => {
		if ( !strategy ) return
		const cb = e.currentTarget
		if ( cb.checked ) {
			$matchroom.strategies.add( strategy )
		} else {
			$matchroom.strategies.delete( strategy )
		}
	}

	onMount( () => {
		if ( !checkbox || !strategy ) return
		checkbox.checked = $matchroom.strategies.has( strategy.identifier )
	} )
</script>

<div class="checkbox { center ? 'checkbox--center' : '' }">
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
.checkbox--center {
	justify-content: center;
}
input {
	height: 25px;
	width: 25px;
}
</style>
