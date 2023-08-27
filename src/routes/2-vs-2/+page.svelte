<script lang="ts">
	import Matchroom from '$lib/components/Matchroom.svelte'
	import PreloadImages from '$lib/components/PreloadImages.svelte'
	import { _ } from '$lib/client/stores/i18n'
	import Button from '$lib/components/Button.svelte'
	import { matchroom } from '$lib/client/stores/matchroom'
	import TextInput from '$lib/components/TextInput.svelte'
    import ModuleHeader from '$lib/components/ModuleHeader.svelte'
    import { Pokemon } from '$lib/client/matchroom'
	import get from 'lodash-es/get'
	import shuffle from 'lodash-es/shuffle'

	const teamNames: [ string, string ] = [ 'Equipo anaranjado', 'Equipo morado' ]

	$matchroom.team1.players.splice( 2 )
	$matchroom.team2.players.splice( 2 )
	$matchroom.players.forEach( p => p.reset() )
	$matchroom = $matchroom

	let picks1: Record<string, string> = {}
	let picks2: Record<string, string> = {}

	const toggle1 = ( name: string, role: string ) => {
		picks1[ role ] = name
		picks1 = picks1
	}

	const toggle2 = ( name: string, role: string ) => {
		picks2[ role ] = name
		picks2 = picks2
	}

	const shufflePokemon = () => {
		const pokemon1 = shuffle( Object.values( picks1 ) )
		const pokemon2 = shuffle( Object.values( picks2 ) )

		for ( let i = 0; i < 2; i++ ) {
			const option1 = pokemon1[ i ] ?? Pokemon.getRandomPokemon()
			$matchroom.team1.players[ i ].pokemon.name = option1
			$matchroom.team1.players[ i ].pokemon.displayName = option1

			const option2 = pokemon2[ i ] ?? Pokemon.getRandomPokemon()
			$matchroom.team2.players[ i ].pokemon.name = option2
			$matchroom.team2.players[ i ].pokemon.displayName = option2
		}

		matchroom.update( m => m )
	}
</script>

<svelte:head>
	<title> { $_.get( 'navigation.title' ) } </title>
</svelte:head>

<PreloadImages />

<div class="columns">
	<div class="column column--left">
		<div class="module">
			<div class="module--buttons">
				<Button click={ shufflePokemon }> { $_.get( 'buttons.shuffle-pokemon' ) } </Button>
			</div>

			<ModuleHeader centered> { teamNames[ 0 ] } </ModuleHeader>
			<Matchroom />
			<ModuleHeader centered> { teamNames[ 1 ] } </ModuleHeader>
		</div>
	</div>
</div>

<div class="teampick">
	<div class="teampick__column">
		<div style:text-align="center" style:display="flex" style:flex-direction="column">
			<TextInput bind:value={ teamNames[ 0 ] }></TextInput>
			<TextInput bind:value={ $matchroom.team1.players[ 0 ].name }></TextInput>
			<TextInput bind:value={ $matchroom.team1.players[ 1 ].name }></TextInput>
		</div>
		{ #each Pokemon.ROLES as role }
			<br style="clear: both;" />
			<ModuleHeader> { role } </ModuleHeader>
			<div class="teampick__boxes">
				{ #each get( Pokemon.PER_ROLE, role ) as pokemon }
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						on:click={ toggle1.bind( undefined, pokemon, role ) }
						class="teampick__pokemon teampick__pokemon--{ get( picks1, role ) === pokemon ? '' : 'disabled' }">
						<img
							src="/pokemon/t_Square_{ pokemon.replace( / /g, '_' ) }.png"
							alt={ pokemon }
							width="80">
					</div>
				{ /each }
			</div>
		{ /each }
	</div>
	<div class="teampick__column">
		<div style:text-align="center" style:display="flex" style:flex-direction="column">
			<TextInput bind:value={ teamNames[ 1 ] }></TextInput>
			<TextInput bind:value={ $matchroom.team2.players[ 0 ].name }></TextInput>
			<TextInput bind:value={ $matchroom.team2.players[ 1 ].name }></TextInput>
		</div>
		{ #each Pokemon.ROLES as role }
			<br style="clear: both;" />
			<ModuleHeader> { role } </ModuleHeader>
			<div class="teampick__boxes">
				{ #each get( Pokemon.PER_ROLE, role ) as pokemon }
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						on:click={ toggle2.bind( undefined, pokemon, role ) }
						class="teampick__pokemon teampick__pokemon--{ get( picks2, role ) === pokemon ? '' : 'disabled' }">
						<img
							src="/pokemon/t_Square_{ pokemon.replace( / /g, '_' ) }.png"
							alt={ pokemon }
							width="80">
					</div>
				{ /each }
			</div>
		{ /each }
	</div>
</div>

<style>
:global(a) {
	color: #f17f00;
	font-weight: bold;
}
.columns {
	display: flex;
	margin: 1em 4em;
}
.column--left {
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}
.module {
	width: 100%;
}
.module:not(:first-child) {
	border-top: 1px solid #222;
	margin-top: 2em;
	padding-top: 2em;
}
.module--buttons {
	margin: 1em 0;
	text-align: center;
}

@media ( max-width: 1300px ) {
	.columns {
		flex-direction: column;
		justify-content: center;
	}
}
@media ( max-width: 680px ) {
	.columns {
		margin: 0;
	}
}
.teampick {
	column-gap: 2em;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	width: 80%;
}
.teampick__column {
	flex-basis: 45%;
}
.teampick__boxes {
	display: flex;
	flex-wrap: wrap;
}
.teampick__pokemon--disabled {
	filter: grayscale( 1 );
}
</style>
