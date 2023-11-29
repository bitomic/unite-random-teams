<script lang="ts">
    import { Pokemon } from '$lib/client/matchroom'
    import { conditions } from '$lib/client/stores/conditions'
    import { _ } from '$lib/client/stores/i18n'
    import { matchroom } from '$lib/client/stores/matchroom'
    import { monoteam } from '$lib/client/stores/monoteam'
    import Button from './Button.svelte'
    import RosterBox from './RosterBox.svelte'
	import random from 'lodash-es/random'
	import sample from 'lodash-es/sample'
	import sampleSize from 'lodash/sampleSize'
    import Condition from './Condition.svelte'

	const monotypes = Object.values( Pokemon.PER_TYPES ).filter( i => i.size >= 5 )
		.map( i => [ ...i ] )
	const monoroles = Object.values( Pokemon.PER_ROLE )

	const randomMono = ( teamId: 1 | 2, collection: string[][] ) => {
		const team = $matchroom[ `team${ teamId }` ]
		const options = [ ...sample( collection )! ]
		const list = sampleSize( options, 5 )
		for ( let i = 0; i < 5; i++ ) {
			const player = team.players[ i ]
			player.pokemon.shuffle( list[ i ] ?? Pokemon.getRandomPokemon() )
		}
	}

	const randomAnyMono = ( teamId: 1 | 2 ) => {
		const collection = [ monotypes, monoroles ].at( random( 0, 1 ) ) ?? monotypes
		randomMono( teamId, collection )
	}
</script>
<div class="matchroom">
	<div class="matchroom__team">
		{ #each $matchroom.team1 as player }
			<RosterBox player={ player } team="purple" disabled={ $conditions?.[ 0 ] } />
		{ /each }
	</div>
	{ #if $monoteam }
		<div class="matchroom__buttons">
			<Button style="purple" click={ randomMono.bind( undefined, 1, monotypes ) }> { $_.get( 'playerlist.random-monotype' ) } </Button>
			<Button style="purple" click={ randomMono.bind( undefined, 1, monoroles ) }> { $_.get( 'playerlist.random-monorole' ) } </Button>
			<Button style="purple" click={ randomAnyMono.bind( undefined, 1 ) }> { $_.get( 'playerlist.random-any' ) } </Button>
		</div>
	{ /if }
	{ #if $conditions }
		<Condition index={ 0 } />
	{ /if }
	<div class="matchroom__vs">
		<img src="vs.png" alt="vs">
	</div>
	<div class="matchroom__team">
		{ #each $matchroom.team2 as player }
			<RosterBox player={ player } team="orange" disabled={ $conditions?.[ 1 ] } />
		{ /each }
	</div>
	{ #if $conditions }
		<Condition index= { 1 } />
	{ /if }
	{ #if $monoteam }
		<div class="matchroom__buttons">
			<Button click={ randomMono.bind( undefined, 2, monotypes ) }> { $_.get( 'playerlist.random-monotype' ) } </Button>
			<Button click={ randomMono.bind( undefined, 2, monoroles ) }> { $_.get( 'playerlist.random-monorole' ) } </Button>
			<Button click={ randomAnyMono.bind( undefined, 2 ) }> { $_.get( 'playerlist.random-any' ) } </Button>
		</div>
	{ /if }
</div>

<style>
.matchroom {
	align-items: center;
	display: flex;
	flex-direction: column;
	margin: 1em auto;
	row-gap: 1em;
	width: fit-content;
}
.matchroom__team {
	column-gap: 1.5em;
	display: flex;
}
@media (max-width: 1397px) {
	.matchroom {
		margin: 0;
	}
	.matchroom__team {
		column-gap: 0;
	}
}
@media (max-width: 840px) {
	.matchroom__team {
		column-gap: 2em;
		flex-wrap: wrap;
		justify-content: center;
	}
}
</style>
