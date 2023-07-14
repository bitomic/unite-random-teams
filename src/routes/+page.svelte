<script lang="ts">
    import { players } from '$lib/stores/matchmaking'
	import shuffle from 'lodash-es/shuffle'
    import Team from '$lib/components/Team.svelte';

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
		players.set( $players )
	}

	const randomize = () => {
		const items = shuffle( [ ...$players.team1, ...$players.team2 ] )
		$players.clear()
		for ( const item of items ) {
			$players.addPlayer( item )
		}
		players.set( $players )
	}

	const randomizePokemon = () => {
		const items = [ ...$players.team1, ...$players.team2 ]
		for ( const item of items ) {
			item.changePokemon()
		}
		players.set( $players )
	}
</script>

<svelte:head>
	<title> Crea equipos aleatorios | Pokémon UNITE </title>
</svelte:head>

<ul class="infobanner">
	<li> Puedes cambiar el nombre de cada personaje escribiendo en el cuadro debajo de su avatar. </li>
	<li> Haz click en el personaje para cambiar su avatar. </li>
	<li> Puedes hacer click en el Pokémon para obtener uno nuevo al azar. </li>
</ul>

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
		<button class="btn" disabled={ true }> Cambiar todos los Pokémon </button>
	</div>
</div>

<style>
.infobanner {
	color: #fff;
	margin: 1em auto;
	width: 80%;
}
.room {
	background-color: rgba(159, 168, 206, 0.5);
	border: 2px solid #fff;
	border-left-width: 5px;
	border-radius: 10px;
	border-right-width: 5px;
	margin: 1em auto;
	padding: 1em 0;
	width: 80%;
}
.room__separator {
	background-image: linear-gradient(to right, #6d4f9d, #6d4f9d 50%, #f17f00 50%, #f17f00);
	border-bottom: 18px solid #000;
	height: 10px;
	margin: 2em 0;
	position: relative;
	text-align: center;
	width: 100%;
}
.room__separator img {
	margin-top: -3px;
}
.columns {
	column-gap: 2em;
	display: flex;
	justify-content: space-evenly;
	margin: 0 auto;
	width: 80%;
}
.column {
	flex-basis: 0;
	flex-grow: 1;;
}
.soon {
	color: #fff;
}
.btn {
	background-color: #f17f00;
	border: 0;
	border-radius: 5px;
	cursor: pointer;
	font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-size: 18px;
	font-weight: bold;
	margin: 0.5em 0;
	padding: 1em 2em;
	text-transform: uppercase;
	width: 100%;
}
.btn:hover {
	background-color: #a85a00;
}
.btn:disabled {
	background-color: #a57c4d;
	color: #303030;
	cursor: not-allowed;
}

@media screen and ( max-width: 630px ) {
	.columns {
		flex-direction: column;
	}
}
</style>