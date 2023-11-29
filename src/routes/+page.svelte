<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
	import Checkbox from '$lib/components/Checkbox.svelte'
	import Matchroom from '$lib/components/Matchroom.svelte'
	import TwitchIntegrator from '$lib/components/TwitchIntegrator.svelte'
	import { _ } from '$lib/client/stores/i18n'
	import Button from '$lib/components/Button.svelte'
	import { matchroom } from '$lib/client/stores/matchroom'
	import { GlobalUniqueStrategy } from '$lib/client/matchroom/strategies/GlobalUnique'
	import { AllRolesStrategy } from '$lib/client/matchroom/strategies/AllRoles'
	import PlayerList from '$lib/components/PlayerList.svelte'
	import type { PageData } from './$types'
	import ModuleHeader from '$lib/components/ModuleHeader.svelte'
	import PredictionManager from '$lib/components/PredictionManager.svelte'
	import Banlist from '$lib/components/Banlist.svelte'
	import { driver } from 'driver.js'
	import 'driver.js/dist/driver.css'
    import { monoteam } from '$lib/client/stores/monoteam'
    import { conditions } from '$lib/client/stores/conditions'

	export let data: PageData
	const tour = driver( {
		doneBtnText: $_.get( 'driver.btn-done' ),
		nextBtnText: $_.get( 'driver.btn-next' ),
		prevBtnText: $_.get( 'driver.btn-prev' ),
		progressText: $_.get( 'driver.progress' ),
		showProgress: true,
		steps: [
			{
				element: '.playerlist input',
				label: 'players-input'
			},
			{
				element: '.playerlist__usernames',
				label: 'playerlist'
			},
			{
				element: '.twitch',
				label: 'twitch'
			},
			{
				element: '.twitch input',
				label: 'twitch-input'
			},
			{
				element: '.twitch__command',
				label: 'twitch-command'
			},
			{
				element: '.navigation .btn',
				label: 'twitch-integrate',
			},
			{
				element: '.playerlist__rotate',
				label: 'playerlist-rotate'
			},
			{
				element: '.matchroom',
				label: 'matchroom'
			},
			{
				element: '.module--buttons',
				label: 'matchroom-buttons'
			},
			{
				element: '.roster',
				label: 'matchroom-roster'
			},
			{
				element: '#module-custom-rules',
				label: 'custom-rules'
			},
			{
				element: '.banlist',
				label: 'banlist'
			},
			{
				element: '.banlist__item',
				label: 'banlist-item'
			},
			{
				element: 'body',
				label: 'finish'
			}
		].map( item => ( {
			element: item.element,
			popover: {
				description: $_.get( `tour.${ item.label }-description` ),
				title: $_.get( `tour.${ item.label }` )
			}
		} ) )
	} )
</script>

<svelte:head>
	<title> { $_.get( 'navigation.title' ) } </title>
</svelte:head>

<div class="columns">
	<div class="column column--left">
		<div class="module">
			<ModuleHeader> { $_.get( 'playerlist.title' ) } </ModuleHeader>
			<div class="module__details">
				<p> { $_.get( 'playerlist.details-input' ) } </p>
				<p> { $_.get( 'playerlist.details-swap' ) } </p>
			</div>
			<PlayerList user={ data.user } />
		</div>
		<div class="module">
			<div class="module--buttons">
				<Button click={ () => $matchroom.shufflePlayers() }> { $_.get( 'buttons.shuffle-players' ) } </Button>
				<Button click={ () => $matchroom.shufflePokemon() }> { $_.get( 'buttons.shuffle-pokemon' ) } </Button>
			</div>

			<Matchroom />

			{ #if data.user }
				<PredictionManager />
			{ /if }
		</div>
		<div class="module">
			<ModuleHeader> { $_.get( 'draft.header' ) } </ModuleHeader>
			<Banlist />
		</div>
	</div>
	<div class="column column--right">
		<div class="module">
			<ModuleHeader> { $_.get( 'get-started.title' ) } </ModuleHeader>
			<br />
			<Button click={ () => tour.drive() }> { $_.get( 'get-started.start-tutorial' ) } </Button>
		</div>
		<div class="module">
			<TwitchIntegrator streamerUser={ data.user } />
		</div>
		<div class="module" id="module-custom-rules">
			<ModuleHeader> { $_.get( 'strategies.header' ) } </ModuleHeader>
			<div class="checkboxes">
				<Checkbox strategy={ new GlobalUniqueStrategy() }> { $_.get( 'strategies.global-unique-pokemon' ) } </Checkbox>
				<Checkbox strategy={ new AllRolesStrategy() }> { $_.get( 'strategies.all-roles' ) } </Checkbox>
				<Checkbox change={ i => $monoteam = i.currentTarget.checked }> { $_.get( 'strategies.monoteams' ) } </Checkbox>
				<Checkbox change={ i => $conditions = i.currentTarget.checked ? [ false, false ] : null }> { $_.get( 'strategies.conditions' ) } </Checkbox>
			</div>
		</div>
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
.column--right {
	--spacing: 3em;
	border-left: 2px solid #222;
	margin-left: var(--spacing);
	padding-left: var(--spacing);
	width: 340px;
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
	text-align: center;
}
.module__details {
	font-size: 0.95em;
	margin-bottom: 1.25em;
}

@media ( max-width: 1300px ) {
	.columns {
		flex-direction: column;
		justify-content: center;
	}
	.column--right {
		align-items: flex-start;
		border-left: 0;
		border-top: 2px solid #222;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		margin-left: 0;
		margin-top: 1em;
		padding-left: 0;
		padding-top: 2px;
	}
	.column--right .module {
		background-color: rgba( 42, 42, 42, 0.2 );
		border-radius: 5px;
		border-top: 0;
		flex-basis: 40%;
		margin-top: 1em;
		padding: 1em;
	}
}
@media ( max-width: 1015px ) {
	.column--right .module {
		flex-basis: 100%;
	}
}
@media ( max-width: 680px ) {
	.columns {
		margin: 0;
	}
}
</style>
