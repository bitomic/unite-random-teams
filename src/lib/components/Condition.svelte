<script lang="ts">
    import sampleSize from 'lodash-es/sampleSize'
	import matchConditions from '../../match-conditions.json'
	import { _ } from '../client/stores/i18n'
	import { conditions } from '../client/stores/conditions'
    import { onMount } from 'svelte'

	export let index: 0 | 1

	let name = ''
	let description = ''

	const update = ( option: { name: string, overrules?: boolean | undefined } ) => {
		if ( !$conditions ) return

		const label = option.name

		description = $_.get( `conditions.${ label }.description` )
		name = $_.get( `conditions.${ label }.name` )
		$conditions[ index ] = option.overrules || false
	}

	const randomCondition = () => {
		const options = sampleSize( matchConditions, 2 )
		const oldDescription = description

		update( options[ 0 ] )

		if ( description === oldDescription ) {
			update( options[ 1 ] )
		}
	}

	onMount( randomCondition )
</script>

<div class="condition">
	<p> <b> { name }: </b> { description } </p>
	<button on:click={ randomCondition }> <img src="/refresh.png" width="16" alt="refresh"> </button>
</div>

<style>
.condition {
	align-items: center;
	column-gap: 2em;
	display: flex;
	width: 100%;
}
.condition p {
	flex-grow: 1;
	text-align: center;
}
.condition button {
	background-color: transparent;
	border: none;
	cursor: pointer;
	filter: grayscale(1);
	flex-basis: 32px;
}
.condition button:hover {
	filter: none;
}
</style>
