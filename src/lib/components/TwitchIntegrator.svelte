<script lang="ts">
    import { page } from '$app/stores'
    import { _ } from '$lib/client/stores/i18n'
    import { matchroom } from '$lib/client/stores/matchroom'
    import { trpc } from '$lib/client/trpc'
    import { onMount } from 'svelte'
    import Button from './Button.svelte'
    import ModuleHeader from './ModuleHeader.svelte'
	import TextInput from './TextInput.svelte'
	import tmi from 'tmi.js'

	const cooldown = 5000
	let lastCooldownCommand = 0
	let status: 'connected' | 'connecting' | 'disconnected' = 'disconnected'
	let listCommand = $_.get( 'twitch.list-command' )
	const posCommand = $_.get( 'twitch.pos-command' )
	let queueCommand = $_.get( 'twitch.default-command' )

	const t = trpc( $page )
	export let streamerUser: Awaited<ReturnType<typeof t[ 'twitch' ][ 'me' ][ 'query' ]>>[ 'data' ][ 0 ] | null = null
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let value = streamerUser?.login ?? ''

	const listPlayersHeader = $_.get( 'twitch.list-header' )
	const listNoPlayers = $_.get( 'twitch.list-no-players' )

	let client: tmi.Client | null = null

	onMount( () => {
		if ( value.length ) {
			connect()
		}
	} )

	const disconnect = () => {
		status = 'disconnected'

		if ( client ) {
			void client.disconnect()
			client = null
		}
	}

	const connect = () => {
		disconnect()

		status = 'connecting'
		client = new tmi.Client( {
			channels: [ value ],
			identity: {

			}
		} )
		void client.connect()

		client.on( 'connected', () => {
			status = 'connected'
		} )

		client.on( 'message', ( _, user, message ) => {
			const command = message.toLowerCase()

			if ( command.startsWith( `!${ queueCommand }` ) ) {
				const name = user[ 'display-name' ]
				if ( name ) {
					$matchroom.queue( name )
				}
				return
			}

			if ( !streamerUser || Date.now() < lastCooldownCommand + cooldown ) return

			if ( command.startsWith( `!${ listCommand }` ) ) {
				if ( $matchroom.waitlist.players.length ) {
					const message = `${ listPlayersHeader } ${ $matchroom.waitlist.players.slice( 0, 10 ).join( ' | ' ) }`
					void t.twitch.announce.mutate( { message } )
				} else {
					void t.twitch.announce.mutate( { message: listNoPlayers } )
				}
			} else {
				return
			}

			lastCooldownCommand = Date.now()
		} )
	}

	const keypress = ( event: KeyboardEvent ) => {
		if ( event.code !== 'Enter' ) return
		connect()
	}
</script>

<ModuleHeader> { $_.get( 'twitch.chat-title' ) } </ModuleHeader>
<div class="twitch">
	<div class="twitch__status twitch__status--{ status }">
		{ $_.get( `twitch.status-${ status }` ) }
	</div>
	<TextInput placeholder={ $_.get( 'twitch.input-placeholder' ) } bind:value={ value } keypress={ keypress } name="twitchChannel" />
	<div class="twitch__command">
		<div class="twitch__commandprefix"> ! </div>
		<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ queueCommand } />
	</div>
	{ #if streamerUser }
		<div class="twitch__command">
			<div class="twitch__commandprefix"> ! </div>
			<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ listCommand } />
		</div>
	{ /if }
	<!--
	<div class="twitch__command">
		<div class="twitch__commandprefix"> ! </div>
		<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ posCommand } />
	</div>
	-->
	{ #if status === 'disconnected' }
		<Button style="purple" click={ connect }> { $_.get( 'twitch.connect' ) } </Button>
	{ :else if status === 'connecting' }
		<Button style="purple" disabled> { $_.get( 'twitch.connect' ) } </Button>
	{ :else if status === 'connected' }
		<Button style="purple" click={ disconnect }> { $_.get( 'twitch.disconnect' ) } </Button>
	{ /if }
	<div class="twitch__details"> { $_.get( 'twitch.details' ) } </div>
</div>

<style>
.twitch {
	display: flex;
	flex-direction: column;
	font-weight: bold;
	row-gap: 1em;
	text-align: center;
}
.twitch__status--disconnected {
	color: #f16c38;
}
.twitch__status--connecting {
	color: #fecc51;
}
.twitch__status--connected {
	color: #aced5b;
}
.twitch__command {
	align-items: center;
	column-gap: 1em;
	display: flex;
	justify-content: center;
}
.twitch__commandprefix {
	border: 1px solid #222;
	border-radius: 5px;
	padding: 0.35em;
	width: 20px;
}
.twitch__details {
	font-size: 0.9em;
}
</style>
