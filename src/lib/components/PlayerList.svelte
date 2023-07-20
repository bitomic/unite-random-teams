<script lang="ts">
    import { _ } from '$lib/client/stores/i18n';
    import { matchroom } from '$lib/client/stores/matchroom'
    import TextInput from './TextInput.svelte';
    import Button from './Button.svelte';
    import { trpc } from '$lib/client/trpc';
    import { page } from '$app/stores';
	
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

	const drop = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.preventDefault()
		if ( !e.dataTransfer ) return
		
		const fromIndex = parseInt( e.dataTransfer.getData( 'text/plain' ) )
		const toIndex = parseInt( e.currentTarget.dataset.index ?? '' )
		
		$matchroom.swap( fromIndex, toIndex )

		document.querySelectorAll( '.playerlist__item' ).forEach( item => {
			if ( item instanceof HTMLElement ) {
				item.style.border = ''
			}
		} )
	}

	const dragover = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.preventDefault()
		e.currentTarget.style.border = '3px solid #ff7d29'
	}

	const dragleave = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.preventDefault()
		e.currentTarget.style.border = ''
	}

	const dragstart = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.currentTarget.style.opacity = '0.25'
		e.dataTransfer?.setData( 'text/plain', e.currentTarget.dataset.index ?? '' )
	}

	const dragend = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.currentTarget.style.opacity = ''
	}
</script>

<div class="playerlist">
	<TextInput placeholder={ $_.get( 'playerlist.placeholder' ) } keypress={ keypress } />

	<div class="playerlist__usernames">
		{ #each $matchroom.players as username, idx }
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="playerlist__item"
				draggable="true"
				data-index={ idx }
				on:dragover={ dragover }
				on:dragleave={ dragleave }
				on:dragstart={ dragstart }
				on:dragend={ dragend }
				on:drop={ drop }>
				<div class="playerlist__user"> { username } </div>
			</div>
		{ /each }
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
	max-height: 20em;
	margin-top: 1.5em;
	overflow-y: scroll;
}
.playerlist__item {
	align-items: center;
	background-color: rgba(34, 34, 34, 0.25);
	border-radius: 8px;
	cursor: move;
	display: flex;
	font-size: 1.2em;
	margin: 0.65em 0;
	padding: 0.5em 1em 0.5em 0.5em;
	text-align: left;
	transition: background 0.3s;
}
.playerlist__item:hover {
	background-color: rgba(34, 34, 34, 0.65);
}
.playerlist__item:nth-child( -n + 10 )::before {
	content: "";
	height: 30px;
	margin-right: 0.5em;
	mask-image: url("/pokeball.png");
	-webkit-mask-image: url("/pokeball.png");
	mask-size: contain;
	-webkit-mask-size: contain;
	width: 30px;
}
.playerlist__item:nth-child( -n + 5 )::before {
	background-color: #7f56f9;
}
.playerlist__item:nth-child( 6 )::before,
.playerlist__item:nth-child( 7 )::before,
.playerlist__item:nth-child( 8 )::before,
.playerlist__item:nth-child( 9 )::before,
.playerlist__item:nth-child( 10 )::before {
	background-color: #ff7d29;
}
.playerlist__announcement {
	margin: 0.5em 0;
}
</style>
