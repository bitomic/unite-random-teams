<script lang="ts">
    import { players } from '$lib/stores/matchmaking'
    import Team from '$lib/components/Team.svelte'
    import TopBanner from '$lib/components/TopBanner.svelte'

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
</svelte:head>

<TopBanner />

<div class="room">
	<Team team={ $players.team1 } teamNumber={ 1 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
	<div class="room__separator">
		<img src="/vs.png" alt="vs" width="50">
	</div>
	<Team team={ $players.team2 } teamNumber={ 2 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
</div>

<div class="columns">
	<div class="column soon">
		<h2> Próximamente... </h2>
		<ul>
			<li> Cambia todos los Pokémon a la vez. </li>
			<li> Aplica filtros para las opciones de Pokémon (solo permitir cierto rol, solo permitir ciertas opciones, evitar que se repitan Pokémon entre ambos equipos). </li>
		</ul>
	</div>
	<div class="column buttons">
		<button class="btn" on:click={ randomize }> Cambiar equipos al azar </button>
		<button class="btn" on:click={ randomizePokemon }> Cambiar todos los Pokémon </button>
	</div>
</div>

<style src="./+page.css"></style>