<script lang="ts">
	import get from 'lodash-es/get'
    import type { Player } from '$lib/stores/matchmaking'
	import pokemon from '../../pokemon.json'

	export let changeAvatar: Function
	export let changePokemon: Function
	export let team: Player[]
	export let teamNumber: 1 | 2

	type PokemonRole = typeof pokemon[ keyof typeof pokemon ][ 'role' ]

	const getRole = ( name: string ): PokemonRole => {
		if ( name === 'Mr. Mime' ) return 'Supporter'

		return get( pokemon, `${ name }.role` ) ?? 'Attacker'
	}
</script>

<div class="room__players room__players--{ teamNumber }">
	{ #each team as player, idx }
		<div class="player">
			<div class="player__avatar">
				<div class="player__background"></div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="player__image" on:click={ changeAvatar.bind( undefined, idx, teamNumber ) }>
					<img src="/trainers/{ player.gender }{ player.skin }.png" alt="{ player.gender } trainer" width="100">
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={ changePokemon.bind( undefined, idx, teamNumber ) } class="player__pokemon player__pokemon--{ getRole( player.pokemon ) }">
					<img src="/pokemon/t_Square_{ player.pokemon }.png" alt={ player.pokemon } width="50">
				</div>
			</div>
			<input type="text" class="player__name" bind:value={ player.name }>
		</div>
	{ /each }
</div>

<style>
.room__players {
	align-items: center;
	display: flex;
	justify-content: space-evenly;
}
.player {
	text-align: center;
}
.player__avatar {
	align-items: center;
	display: flex;
	flex-direction: column;
	position: relative;
}
.player__image {
	align-items: flex-end;
	display: flex;
	height: 120px;
	justify-content: center;
	overflow: hidden;
	position: relative;
	width: 100px;
}
.player__background {
	background-color: #fff;
	border-radius: 8px;
	bottom: 0px;
	height: 50px;
	position: absolute;
	transform: skewX( -30deg );
	width: 120px;
}
.player__name {
	background-color: rgba( 0, 0, 0, 0.25 );
	border: 1px solid #000;
	border-radius: 5px;
	color: #fff;
	font-size: 18px;
	margin-top: 1em;
	padding: 0.3em 0;
	text-align: center;
	max-width: 80%;
}
.player__name:focus {
	box-shadow: 2px 2px 2px #fff;
	outline: none;
}
.player__pokemon {
	align-items: center;
	background-color: #fff;
	border-radius: 8px;
	display: flex;
	height: 50px;
	justify-content: center;
	overflow: hidden;
	position: absolute;
	right: 0;
	top: 0;
	width: 50px;
}
.player__pokemon {
	--shadow: #6d4f9d;
	background-color: var( --color );
	box-shadow: 2px 2px 4px var( --shadow );
}
.room__players--2 .player__pokemon {
	--shadow: #f17f00;
}
.player__pokemon--All-Rounder {
	--color: #ce5fd3;
}
.player__pokemon--Attacker {
	--color: #f16c38;
}
.player__pokemon--Defender {
	--color: #aced5b;
}
.player__pokemon--Speedster {
	--color: #29a5e3;
}
.player__pokemon--Supporter {
	--color: #fecc51;
}

@media screen and ( max-width: 1560px ) {
	.player__image,
	.player__image img {
		width: 80px;
	}
	.room__players {
		flex-wrap: wrap;
		row-gap: 1em;
	}
	.player:nth-child(1),
	.player:nth-child(2),
	.player:nth-child(3) {
		flex-basis: 30%;
	}
}
</style>