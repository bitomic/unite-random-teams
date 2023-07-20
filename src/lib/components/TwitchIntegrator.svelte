<script lang="ts">
    import { _ } from '$lib/client/stores/i18n';
    import { matchroom } from '$lib/client/stores/matchroom';
    import Button from './Button.svelte'
	import TextInput from './TextInput.svelte'
	import tmi from 'tmi.js'

	let status: 'connected' | 'connecting' | 'disconnected' = 'disconnected'
	let command = $_.get( 'twitch.default-command' )
	let value = ''

	let client: tmi.Client | null = null

	const viewers = new Set<string>()

	const handle = () => {
		status = 'connecting'

		if ( client  ) {
			client.disconnect()
			client = null
		}

		client = new tmi.Client( {
			channels: [ value ]
		} )
		client.connect()

		client.on( 'connected', () => {
			status = 'connected'
		} )

		client.on( 'message', ( _, user, message ) => {
			if ( !message.toLowerCase().startsWith( `!${ command }` ) ) return
			const name = user[ 'display-name' ]
			if ( name ) {
				$matchroom.waitlist.add( name )
			}
		} )
	}

	const keypress = ( event: KeyboardEvent ) => {
		if ( event.code !== 'Enter' ) return
		handle()
	}
</script>

<div class="twitch">
	<div class="twitch__status twitch__status--{ status }">
		{ $_.get( `twitch.status-${ status }` ) }
	</div>
	<TextInput placeholder={ $_.get( 'twitch.input-placeholder' ) } bind:value={ value } keypress={ keypress } name="twitchChannel" />
	<div class="twitch__command">
		<div class="twitch__commandprefix"> ! </div>
		<TextInput placeholder={ $_.get( 'twitch.command' ) } bind:value={ command } />
	</div>
	<Button style="purple" click={ handle }> { $_.get( 'twitch.connect' ) } </Button>
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
</style>