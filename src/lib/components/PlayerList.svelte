<script lang="ts">
    import { _ } from '$lib/client/stores/i18n';
    import { matchroom } from '$lib/client/stores/matchroom'
    import TextInput from './TextInput.svelte';
    import Button from './Button.svelte';
    import { trpc } from '$lib/client/trpc';
    import { page } from '$app/stores';
    import PlayerListItem from './PlayerListItem.svelte';
    import ModuleHeader from './ModuleHeader.svelte';
	
	const t = trpc($page)
	export let user: Awaited<ReturnType<typeof t[ 'twitch' ][ 'me' ][ 'query' ]>>[ 'data' ][ 0 ] | null = null

	const announce = async () => {
		const message = [
			$matchroom.team1.map( p => `🟣 ${ p.name } - ${ p.pokemon }` ).join( '\n' ),
			$matchroom.team2.map( p => `🟠 ${ p.name } - ${ p.pokemon }` ).join( '\n' )
		].join( '\n' )
		await t.twitch.announce.mutate( { message } )
	}

	const keypress = ( e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement } ) => {
		if ( e.code !== 'Enter' ) return

		const value = e.currentTarget.value.trim()
		e.currentTarget.value = ''

		$matchroom.queue( value )
	}
</script>

<div class="playerlist">
	<TextInput placeholder={ $_.get( 'playerlist.placeholder' ) } keypress={ keypress } />

	<div class="playerlist__usernames">
		<div class="playerlist__column playerlist__purple">
			<ModuleHeader> { $_.get( 'prediction.team-purple' ) } </ModuleHeader>
			{ #each $matchroom.team1Players as player, idx }
				<PlayerListItem { idx } username={ player.name } color="purple" />
			{ /each }
		</div>
		<div class="playerlist__column playerlist__orange">
			<ModuleHeader> { $_.get( 'prediction.team-orange' ) } </ModuleHeader>
			{ #each $matchroom.team2Players as player, idx }
				<PlayerListItem idx={ idx + 5 } username={ player.name } color="orange" />
			{ /each }
		</div>
		<div class="playerlist__column playerlist__waiting">
			<ModuleHeader> { $_.get( 'prediction.waitlist' ) } </ModuleHeader>
			{ #each $matchroom.waitlist as player, idx }
				<PlayerListItem idx={ idx + 10 } username={ player } />
			{ /each }
		</div>
	</div>

	{ #if user }
		<div class="playerlist__announcement"> { $_.get( 'playerlist.announcement-details' ) } </div>
		<Button click={ announce } style="purple"> { $_.get( 'playerlist.announce' ) } </Button>
	{ /if }
</div>

<style>
.playerlist {
	text-align: center;
}
.playerlist__usernames {
	column-gap: 1em;
	display: flex;
	margin-top: 1.5em;
}
.playerlist__column {
	flex-basis: 0;
	flex-grow: 1;
}
.playerlist__waiting {
	max-height: 380px;
	overflow-y: auto;
}
.playerlist__announcement {
	margin: 0.5em 0;
}
</style>
