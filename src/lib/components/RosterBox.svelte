<script lang="ts">
	export let pokemon: string
	export let role: 'attacker' | 'all-rounder' | 'defender' | 'speedster' | 'supporter'
	export let team: 'orange' | 'purple'
	export let trainer: string
</script>

<div class="roster roster--{ role } roster--{ team }">
	<div class="roster__image">
		<img src="/roster/{ pokemon }.png" alt={ pokemon } width="200">
	</div>
	<div class="roster__data">
		<div class="roster__pokemon"> { pokemon } </div>
		<div class="roster__trainer"> { trainer } </div>
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
	height: 234px;
	overflow: hidden;
	position: relative;
	width: 165px;
}
.roster:hover {
	outline: 4px solid var(--outline);
}
.roster__image {
	--background: var( --color, #fff );
	--dots-size: 250px;
	background-blend-mode: overlay, hard-light;
	background-color: var( --background );
	background-image: url( '/dots.svg' ), url( '/checkers.svg' );
	background-position: calc( 100% + 100px ) calc( 100% - 100px ), top left;
	background-repeat: no-repeat, repeat;
	background-size: var( --dots-size ), 140px;
	border: 3px solid var(--border);
	border-radius: 5px;
	display: flex;
	justify-content: center;
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
	height: 70px;
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
	font-size: 0.9em;
}
</style>