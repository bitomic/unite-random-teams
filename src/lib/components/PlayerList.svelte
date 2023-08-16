<script lang="ts">
    import { _ } from '$lib/client/stores/i18n';
    import { matchroom } from '$lib/client/stores/matchroom'
    import TextInput from './TextInput.svelte';
    import Button from './Button.svelte';
    import { trpc } from '$lib/client/trpc';
    import { page } from '$app/stores';
    import PlayerListItem from './PlayerListItem.svelte';
    import ModuleHeader from './ModuleHeader.svelte';
	import { Matchroom as MatchroomManager } from '$lib/client/structures/Matchroom'
    import Checkbox from './Checkbox.svelte';
	
	const t = trpc($page)
	export let user: Awaited<ReturnType<typeof t[ 'twitch' ][ 'me' ][ 'query' ]>>[ 'data' ][ 0 ] | null = null

	const announce = async () => {
		const message = [
			$matchroom.team1.map( p => `🟣 ${ p.name } - ${ p.pokemon }` ).join( '\n' ),
			$matchroom.team2.map( p => `🟠 ${ p.name } - ${ p.pokemon }` ).join( '\n' )
		].join( '\n' )
		await t.twitch.announce.mutate( { message } )
	}

	const announcePlayers = async () => {
		const message = [
			'🟣',
			$matchroom.team1.map( p => `${ p.name }` ).join( ' | ' ),
			'- 🟠',
			$matchroom.team2.map( p => `${ p.name }` ).join( ' | ' )
		].join( '\n' )
		await t.twitch.announce.mutate( { message } )
	}

	const keypress = ( e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement } ) => {
		if ( e.code !== 'Enter' ) return

		const value = e.currentTarget.value.trim()
		if ( value.length === 0 ) return
		e.currentTarget.value = ''

		$matchroom.queue( value )
	}

	const toggleStreamerMode = ( e: Event & { currentTarget: EventTarget & HTMLInputElement } ) => {
		const cb = e.currentTarget
		$matchroom.streamer = cb.checked
	}
</script>

<div class="playerlist">
	<TextInput placeholder={ $_.get( 'playerlist.placeholder' ) } keypress={ keypress } />

	<div class="playerlist__usernames">
		<div class="playerlist__column playerlist__purple">
			<ModuleHeader> { $_.get( 'playerlist.team-purple' ) } </ModuleHeader>
			{ #each $matchroom.team1Players as player, idx }
				<PlayerListItem username={ player.name } color="purple" />
			{ /each }
		</div>
		<div class="playerlist__column playerlist__orange">
			<ModuleHeader> { $_.get( 'playerlist.team-orange' ) } </ModuleHeader>
			{ #each $matchroom.team2Players as player, idx }
				<PlayerListItem username={ player.name } color="orange" />
			{ /each }
		</div>
		<div class="playerlist__column playerlist__waiting">
			<ModuleHeader> { $_.get( 'playerlist.waitlist' ) } </ModuleHeader>
			{ #each $matchroom.waitlist as player, idx }
				<PlayerListItem username={ player } />
			{ /each }
		</div>
	</div>

	<div class="playerlist__rotate">
		<Checkbox center change={ toggleStreamerMode }> { $_.get( 'playerlist.streamer-mode' ) } </Checkbox>
		<Button click={ () => $matchroom.rotate( 1 ) } style="purple"> { $_.get( 'playerlist.rotate-purple' ) } </Button>
		<Button click={ () => $matchroom.rotate( 2 ) }> { $_.get( 'playerlist.rotate-orange' ) } </Button>
	</div>

	{ #if user }
		<div class="playerlist__announcement"> { $_.get( 'playerlist.announcement-details' ) } </div>
		<Button click={ announcePlayers } style="purple"> { $_.get( 'playerlist.announce-players' ) } </Button>
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
	margin: 1em 0;
}
</style>
