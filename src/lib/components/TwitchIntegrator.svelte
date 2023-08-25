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
    import { Player } from '$lib/client/matchroom'

	const cooldown = 5000
	let lastCooldownCommand = 0
	let status: 'connected' | 'connecting' | 'disconnected' = 'disconnected'
	let listCommand = $_.get( 'twitch.list-command' )
	let ignCommand = $_.get( 'twitch.ign-command' )
	let posCommand = $_.get( 'twitch.pos-command' )
	let queueCommand = $_.get( 'twitch.default-command' )

	const t = trpc( $page )
	export let streamerUser: Awaited<ReturnType<typeof t[ 'twitch' ][ 'me' ][ 'query' ]>>[ 'data' ][ 0 ] | null = null
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let value = streamerUser?.login ?? ''

	const listPlayersHeader = $_.get( 'twitch.list-header' )
	const listNoPlayers = $_.get( 'twitch.list-no-players' )
	const posNoneTemplate = $_.get( 'twitch.message-pos-none' )
	const posNowTemplate = $_.get( 'twitch.message-pos-now' )
	const posTemplate = $_.get( 'twitch.message-pos' )

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
			const name = user[ 'display-name' ]
			if ( !name ) return

			if ( command.startsWith( `!${ queueCommand }` ) ) {
				$matchroom.queue( name )
				return
			}

			if ( command.startsWith( `!${ ignCommand }` ) ) {
				const [ , ign ] = command.split( / /g )
				if ( !ign ) return

				const player = $matchroom.findPlayerByName( name )
				if ( !player ) {
					Player.IGN[ name ] = ign
					return
				}

				player.ign = ign.slice( 0, 10 )
				matchroom.update( m => m )
			}

			if ( !streamerUser || Date.now() < lastCooldownCommand + cooldown ) return

			if ( command.startsWith( `!${ listCommand }` ) ) {
				if ( $matchroom.waitlist.players.length ) {
					const message = `${ listPlayersHeader } ${ $matchroom.waitlist.players.slice( 0, 10 ).join( ' | ' ) }`
					void t.twitch.say.mutate( { message } )
				} else {
					void t.twitch.say.mutate( { message: listNoPlayers } )
				}
			} else if ( command.startsWith( `!${ posCommand }` ) ) {
				if ( $matchroom.playernames.includes( name ) ) {
					const message = posNowTemplate.replace( '$1', name )
					void t.twitch.say.mutate( { message } )
				} else if ( $matchroom.waitlist.has( name ) ) {
					const index = $matchroom.waitlist.players.findIndex( i => i === name ) + 1
					const message = posTemplate.replace( '$1', name ).replace( '$2', `${ index }` )
					void t.twitch.say.mutate( { message } )
				} else {
					const message = posNoneTemplate.replace( '$1', name )
					void t.twitch.say.mutate( { message } )
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
	<p> { @html $_.get( 'twitch.bot-details' ) } </p>
	<div class="twitch__status twitch__status--{ status }">
		{ $_.get( `twitch.status-${ status }` ) }
	</div>
	<TextInput placeholder={ $_.get( 'twitch.input-placeholder' ) } bind:value={ value } keypress={ keypress } name="twitchChannel" />
	<div class="twitch__command">
		<div class="twitch__commandprefix"> ! </div>
		<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ queueCommand } />
	</div>
	<div class="twitch__command">
		<div class="twitch__commandprefix"> ! </div>
		<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ ignCommand } />
	</div>
	{ #if streamerUser }
		<div class="twitch__command">
			<div class="twitch__commandprefix"> ! </div>
			<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ listCommand } />
		</div>
		<div class="twitch__command">
			<div class="twitch__commandprefix"> ! </div>
			<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ posCommand } />
		</div>
	{ /if }
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
