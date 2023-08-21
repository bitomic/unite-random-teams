<script lang="ts">
    import { matchroom } from '$lib/client/stores/matchroom'
    import { BanlistStrategy } from '$lib/client/strategies/Banlist'
	import pokemon from '../../pokemon.json'
    import { onMount } from 'svelte'

	let banlist = $matchroom.pickStrategies.strategies.find( i => i.identifier === BanlistStrategy.identifier ) as BanlistStrategy

	const toggle = ( name: string ) => {
		if ( banlist.has( name ) ) {
			banlist.delete( name )
		} else {
			banlist.add( name )
		}
		banlist = banlist
	}

	const getRole = ( name: string ) => pokemon[ name as keyof typeof pokemon ].role.toLowerCase()

	onMount( () => {
		banlist = banlist
	} )

	const roles = [ ...new Set( Object.values( pokemon ).map( i => i.role ) ) ].sort()
	const sortedPokemon: string[] = []
	for ( const role of roles ) {
		const list = Object.entries( pokemon ).filter( i => i[ 1 ].role === role )
			.map( i => i[ 0 ] )
		sortedPokemon.push( ...list )
	}
</script>

<div class="banlist">
	{ #each sortedPokemon as name }
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			on:click={ toggle.bind( undefined, name ) }
			class="banlist__item banlist__item--{ banlist.has( name ) ? 'disabled' : 'enabled' } banlist__item--{ getRole( name ) }">
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
