<script lang="ts">
    import { matchroom } from '$lib/client/stores/matchroom'

	export let color: 'orange' | 'purple' | 'default' = 'default'
	export let ign: string | null = null
	export let priorizable = false
	export let username: string

	const drop = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.preventDefault()
		if ( !e.dataTransfer ) return

		const fromIndex = e.dataTransfer.getData( 'text/plain' )
		const toIndex = e.currentTarget.dataset.name ?? ''

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
		e.currentTarget.style.border = '3px solid transparent'
	}

	const dragstart = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.currentTarget.style.opacity = '0.25'
		e.dataTransfer?.setData( 'text/plain', e.currentTarget.dataset.name ?? '' )
	}

	const dragend = ( e: DragEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		e.currentTarget.style.opacity = ''
	}

	const removePlayer = ( e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		const { player } = e.currentTarget.dataset
		if ( !player ) return
		$matchroom.remove( player )
	}

	const priorizePlayer = ( e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement } ) => {
		const { player } = e.currentTarget.dataset
		if ( !player ) return
		$matchroom.priorize( player )
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="playerlist__item playerlist__item--{ color }"
	draggable="true"
	data-name={ username }
	on:dragover={ dragover }
	on:dragleave={ dragleave }
	on:dragstart={ dragstart }
	on:dragend={ dragend }
	on:drop={ drop }>
	<div class="playerlist__user">
		<div class="playerlist__name">
			{ username }
			{ #if ign }
				<div class="playerlist__ign"> { ign } </div>
			{ /if }
		</div>
		{ #if priorizable }
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="playerlist__action playerlist__action--priorize" data-player={ username } on:click={ priorizePlayer }> &uarr; </div>
		{ /if }
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="playerlist__action playerlist__action--remove" data-player={ username } on:click={ removePlayer }> &times; </div>
	</div>
</div>

<style>

.playerlist__item {
	align-items: center;
	background-color: rgba(34, 34, 34, 0.25);
	border: 3px solid transparent;
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
.playerlist__item--orange::before,
.playerlist__item--purple::before {
	content: "";
	height: 30px;
	margin-right: 0.5em;
	mask-image: url("/pokeball.png");
	-webkit-mask-image: url("/pokeball.png");
	mask-size: contain;
	-webkit-mask-size: contain;
	width: 30px;
}
.playerlist__item--purple::before {
	background-color: #7f56f9;
}
.playerlist__item--orange::before {
	background-color: #ff7d29;
}
.playerlist__user {
	align-items: center;
	display: inline-flex;
	flex-grow: 1;
	height: 30px;
	position: relative;
}
.playerlist__name {
	flex-grow: 1;
}
.playerlist__ign {
	color: #aaa;
	font-size: 0.85em;
	margin-left: 0.75em;
}
.playerlist__action {
	align-items: center;
	border-radius: 5px;
	cursor: pointer;
	display: flex;
	height: 14px;
	justify-content: center;
	padding: 0.2em;
	position: absolute;
	right: 0;
	width: 14px;
}
.playerlist__action--remove {
	background-color: rgba(177, 0, 0, 0.5);
}
.playerlist__action--priorize {
	background-color: rgba(35, 177, 0, 0.5);
	right: 32px;
}
</style>
