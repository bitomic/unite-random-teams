<script lang="ts">
    import type { Player } from '$lib/client/matchroom'
    import { matchroom } from '$lib/client/stores/matchroom'

	export let disabled = false
	export let player: Player
	export let team: 'orange' | 'purple'

	const click = () => {
		$matchroom.shuffleSinglePokemon( player.name )
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="roster roster--{ player.pokemon.displayRole.toLowerCase() } roster--{ team } { disabled && 'roster--disabled' }" on:click={ click }>
	<div class="roster__image">
		<div class="roster__tachie { player.pokemon.tachie }"> &nbsp; </div>
	</div>
	<div class="roster__data">
		<div class="roster__pokemon"> { player.pokemon.displayName } </div>
		<div class="roster__trainer"> { player.name } </div>
	</div>
</div>

<style>
:root {
	--speedster: #29a5e3;
	--supporter: #fecc51;
	--defender: #aced5b;
	--all-rounder: #ce5fd3;
	--attacker: #f16c38;
}
.roster--attacker {
	--color: var(--attacker);
}
.roster--all-rounder {
	--color: var(--all-rounder);
}
.roster--defender {
	--color: var(--defender);
}
.roster--speedster {
	--color: var(--speedster);
}
.roster--supporter {
	--color: var(--supporter);
}
.roster--orange {
	--border: #f7b9a6;
	--name: #ff7d29;
	--outline: #7f56f9;
	--separator: #e96714;
}
.roster--purple {
	--border: #b8b3f8;
	--name: #7f56f9;
	--outline: #ff7d29;
	--separator: #723eee;
}
.roster {
	align-items: center;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	font-family: 'Exo 2';
	height: 270px;
	overflow: hidden;
	position: relative;
	width: 165px;
}
.roster:hover {
	outline: 4px solid var(--outline);
}
.roster__tachie {
	left: -40px;
	position: absolute;
	top: -45px;
	scale: calc( 180 / 240 );
}
.roster__image {
	--background: var( --color, #fff );
	border: 3px solid var(--border);
	border-radius: 5px;
	height: 230px;
	overflow: hidden;
	position: relative;
	width: 160px;
}
.roster__data {
	--transparent-size: 30px;
	--border-size: 40px;
	--blur: 2px;
	background-image: linear-gradient(
		-175deg,
		transparent,
		transparent var(--transparent-size),
		var(--separator) calc(var(--transparent-size) + var(--blur)),
		var(--separator) var(--border-size),
		var(--name) calc(var(--border-size) + var(--blur)),
		var(--name)
	);
	bottom: 0;
	display: flex;
	flex-direction: column;
	height: 75px;
	justify-content: flex-end;
	padding-bottom: 8px;
	padding-left: 10px;
	position: absolute;
	width: 100%;
}
.roster__pokemon {
	font-size: 1.2em;
	font-weight: bold;
}
.roster__trainer {
	color: #000;
	font-size: 1.1em;
}
.roster--disabled .roster__image {
	filter: grayscale(1);
}

@media (max-width: 1397px) {
	.roster {
		scale: 0.85;
	}
}
</style>
