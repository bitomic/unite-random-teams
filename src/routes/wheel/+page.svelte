<script lang="ts">
    import { onMount } from 'svelte';
    import WheelContainer from '../../lib/components/WheelContainer.svelte';
	import { players, winner } from '../../lib/stores/roulette'
    import PlayersTextarea from '../../lib/components/PlayersTextarea.svelte';
	
	players.set( [ 'Isaac', 'Magdalene', 'Cain', 'Samson', 'Eve', 'Eden', 'Forgotten', 'Keeper', 'Lost', 'Bethany', 'Lazarus', 'Judas' ] )

	let spinButton: HTMLButtonElement = document.createElement( 'button' )
	spinButton.textContent = 'Spin'

	let spinContainer: HTMLDivElement
	onMount( () => {
		spinContainer.insertAdjacentElement( 'afterbegin', spinButton )
	} )
</script>

<div class="columns">
	<div class="column column--left">
		<WheelContainer size={ 600 } button={ spinButton } />
	</div>
	<div class="column column--right">
		{ #if $winner }
			<div class="winner"> The winner is: <b>{ $winner }</b> </div>
		{ /if }

		<div class="input">
			<PlayersTextarea />
			<div class="input__buttons" bind:this={ spinContainer }>
				<div class="input__separator"></div>
				<input type="number" id="pickNumber" value="1" min="1" max={ $players.length }>
			</div>
		</div>
	</div>
</div>

<style>
.columns {
	color: #fff;
	column-gap: 20px;
	display: flex;
	font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	margin: 2em auto;
	justify-content: center;
	text-align: center;
	width: 80%;
}
.column {
	display: flex;
	flex-direction: column;
	row-gap: 1em;
}
.column--right {
	flex-grow: 1;
}
.winner {
	background-color: #313131;
	display: flex;
	flex-direction: column;
	padding: 8px;
	row-gap: 1em;
}
.winner b {
	font-size: 2.5em;
}
.input {
	column-gap: 2em;
	display: flex;
	width: 100%;
}
.input__buttons {
	display: flex;
	flex-basis: 40%;
	flex-direction: column;
}
</style>