<script lang="ts">
    import { _ } from '$lib/stores/i18n';
    import Button from './Button.svelte'
	import TextInput from './TextInput.svelte'
	import tmi from 'tmi.js'

	let status: 'connected' | 'connecting' | 'disconnected' = 'disconnected'
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
			channels: [ 'mairuno_' ]
		} )
		client.connect()

		client.on( 'connected', () => {
			status = 'connected'
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
</style>