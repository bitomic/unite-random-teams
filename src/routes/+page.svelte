<script lang="ts">
    import { players } from '$lib/stores/matchmaking'
	import pokemon from '../pokemon.json'
    import Team from '$lib/components/Team.svelte'
    import { page } from '$app/stores';

	const baseUrl = `${ $page.url.protocol }//${ $page.url.host }`

	$players.clear()

	for ( let idx = 1; idx <= 5; idx++ ) {
		$players.addPlayer( `Entrenador ${ idx }` )
		$players.addPlayer( `Entrenador ${ idx }` )
	}

	const changeAvatar = ( position: number, team: 1 | 2 ) => {
		const player = $players[ `team${ team }` ].at( position )
		if ( !player ) return
		player.changeSkin()
		players.set( $players )
	}

	const changePokemon = ( position: number, team: 1 | 2 ) => {
		const player = $players[ `team${ team }` ].at( position )
		if ( !player ) return
		player.changePokemon()
	}

	const randomize = () => {
		$players.shufflePlayers()
	}

	const randomizePokemon = () => {
		$players.shufflePokemon()
	}
</script>

<svelte:head>
	<title> Crea equipos aleatorios | Pokémon UNITE </title>
	{ #each Object.keys( pokemon ) as name }
		<link rel="prefetch" as="image" href={ `${ baseUrl }/pokemon/t_Square_${ name }.png` } />
	{ /each }
</svelte:head>

<div class="room">
	<Team team={ $players.team1 } teamNumber={ 1 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
	<div class="room__separator">
		<img src="/vs.png" alt="vs" width="50">
	</div>
	<Team team={ $players.team2 } teamNumber={ 2 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
</div>

<div class="columns">
	<div class="column buttons">
		<button class="btn" on:click={ randomize }> Cambiar equipos al azar </button>
		<button class="btn" on:click={ randomizePokemon }> Cambiar todos los Pokémon </button>
	</div>
</div>

<style src="./+page.css"></style>