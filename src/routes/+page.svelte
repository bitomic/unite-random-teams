<script lang="ts">
    import { players } from '$lib/stores/matchmaking'
	import pokemon from '../pokemon.json'
    import Team from '$lib/components/Team.svelte'
    import { page } from '$app/stores';
    import type { BaseStrategy } from '$lib/strategies/BaseStrategy';
    import { GuaranteeRolesStrategy } from '$lib/strategies/GuaranteeRoles';
    import { UniquePokemonStrategy } from '$lib/strategies/UniquePokemon';
    import { onMount } from 'svelte';
    import Footer from '$lib/components/Footer.svelte';

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

	const randomizeTeams = () => {
		$players.shufflePlayers()
	}

	const randomizePokemon = () => {
		$players.shufflePokemon()
	}

	const copyTeams = ( e: Event & { currentTarget: EventTarget & HTMLButtonElement } ) => {
		const oldText = e.currentTarget.textContent
		navigator.clipboard.writeText( $players.list )

		e.currentTarget.textContent = '¡Copiado!'
		setTimeout( () => {
			const btn = document.querySelector( '.btn--secondary' )
			if ( btn ) {
				btn.textContent = oldText
			}
		}, 1500 )
	}

	const toggleStrategy = ( strategy: BaseStrategy ) => {
		return ( e: Event & { currentTarget: EventTarget & HTMLInputElement } ) => {
			if ( e.currentTarget.checked ) {
				$players.addStrategy( strategy )
			} else {
				$players.removeStrategy( strategy.identifier )
			}
		}
	}

	onMount( () => {
		document.querySelectorAll( '.checkbox' ).forEach( checkbox => {
			checkbox.addEventListener( 'click', () => {
				const cb = checkbox.querySelector( 'input' )
				if ( cb ) {
					cb.checked = !cb.checked
					cb.dispatchEvent( new Event( 'change' ) )
				}
			} )
		} )
	} )
</script>

<svelte:head>
	<title> Crea equipos aleatorios | Pokémon UNITE </title>
	{ #each Object.keys( pokemon ) as name }
		<link rel="prefetch" as="image" href={ `${ baseUrl }/pokemon/t_Square_${ name }.png` } />
	{ /each }
</svelte:head>

<div class="imagespreload">
	{ #each Object.keys( pokemon ) as name }
		<img src={ `/pokemon/t_Square_${ name }.png` } alt={ name } />
	{ /each }
</div>

<div class="room">
	<Team team={ $players.team1 } teamNumber={ 1 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
	<div class="room__separator">
		<img src="/vs.png" alt="vs" width="50">
	</div>
	<Team team={ $players.team2 } teamNumber={ 2 } changeAvatar={ changeAvatar } changePokemon={ changePokemon } />
</div>

<div class="columns">
	<div class="column buttons">
		<button class="btn" on:click={ randomizeTeams }> Cambiar equipos al azar </button>
		<button class="btn" on:click={ randomizePokemon }> Cambiar todos los Pokémon </button>
		<button class="btn btn--secondary" on:click={ copyTeams }> Copiar equipos al portapapeles </button>
	</div>
</div>

<div class="columns">
	<div class="column checkboxes">
		<div class="checkbox">
			<input type="checkbox" name="guaranteeRoles" on:change={ toggleStrategy( new GuaranteeRolesStrategy() ) }>
			<label for="guaranteeRoles"> Asegurar todos los roles en ambos equipos </label>
		</div>
		<div class="checkbox">
			<input type="checkbox" name="uniquePokemon" on:change={ toggleStrategy( new UniquePokemonStrategy ) }>
			<label for="uniquePokemon"> No repetir Pokémon entre ambos equipos </label>
		</div>
	</div>
</div>

<Footer />

<style src="./+page.css"></style>
