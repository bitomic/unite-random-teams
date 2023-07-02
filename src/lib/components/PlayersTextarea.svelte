<script lang="ts">
    import { players } from "../stores/roulette";

	const typePlayers = ( e: Event & { currentTarget: HTMLTextAreaElement } ) => {
		const names = e.currentTarget.value.split( /\n/ ).map( i => i.trim() ).filter( i => i.length )
		if ( names.length >= 2 ) {
			players.set( names )
		}
	}
</script>

<textarea on:input={ typePlayers }>{ $players.join( '\n' ) }</textarea>

<style>
textarea {
	background-color: #181818;
	border: 0;
	border-radius: 5px;
	color: #fff;
	font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	max-height: 300px;
	min-height: 120px;
	padding: 8px;
	resize: vertical;
	width: 100%;
}
</style>