<script lang="ts">
    import { matchroom } from '$lib/client/stores/matchroom';
    import { BanlistStrategy } from '$lib/client/strategies/Banlist';
    import { get } from 'lodash-es';
	import pokemon from '../../pokemon.json'

	let banlist = $matchroom.pickStrategies.strategies.find( i => i.identifier === BanlistStrategy.identifier ) as BanlistStrategy

	const toggle = ( name: string ) => {
		if ( banlist.bannedPokemon.has( name ) ) {
			banlist.bannedPokemon.delete( name )
		} else {
			banlist.bannedPokemon.add( name )
		}
		banlist = banlist
	}

	const getRole = ( name: string ) => pokemon[ name as keyof typeof pokemon ].role.toLowerCase()
</script>

<div class="banlist">
	{ #each Object.keys( pokemon ).sort() as name }
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			on:click={ toggle.bind( undefined, name ) }
			class="banlist__item banlist__item--{ banlist.bannedPokemon.has( name ) ? 'disabled' : 'enabled' } banlist__item--{ getRole( name ) }">
			<img
				src="/pokemon/t_Square_{ name.replace( / /g, '_' ) }.png"
				alt={ name }
				width="80">
		</div>
	{ /each }
</div>

<style>

:root {
	--speedster: #29a5e3;
	--supporter: #fecc51;
	--defender: #aced5b;
	--all-rounder: #ce5fd3;
	--attacker: #f16c38;
}
.banlist__item--attacker {
	--color: var(--attacker);
}
.banlist__item--all-rounder {
	--color: var(--all-rounder);
}
.banlist__item--defender {
	--color: var(--defender);
}
.banlist__item--speedster {
	--color: var(--speedster);
}
.banlist__item--supporter {
	--color: var(--supporter);
}
.banlist__item {
	background-color: var(--color);
	border-radius: 5px;
	display: inline-block;
	height: 80px;
	margin: 0.5em;
	width: 80px;
}
.banlist__item--disabled img {
	filter: grayscale( 1 )
}
</style>