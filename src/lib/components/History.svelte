<script>
    import { _ } from '$lib/client/stores/i18n'
    import { matchroom } from '$lib/client/stores/matchroom'
    import ModuleHeader from './ModuleHeader.svelte'

</script>

<ModuleHeader> { $_.get( 'history.title' ) } </ModuleHeader>
<div class="history">
	{ #if $matchroom.history.history.size }
		{ #each $matchroom.history.history.entries() as [ player, pokemon ] }
			<div class="history__block">
				<div class="history__player"> { player } </div>
				<div class="history__pokemon">
					{ #each pokemon ?? [] as name }
						<img src="/pokemon/t_Square_{ name.replace( / /g, '_' ) }.png" alt={ name } class="history__item" width="50">
					{ /each }
				</div>
			</div>
		{ /each }
	{ :else }
		<p> { $_.get( 'history.empty' ) } </p>
	{ /if }
</div>

<style>
.history {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	row-gap: 1em;
}
.history__block {
	flex-basis: 30%;
}
.history__pokemon {
	background-color: rgba(34, 34, 34, 0.25);
	border-radius: 5px;
	margin-top: 1em;
	padding: 0.5em 0;
	text-align: center;
}
.history__player {
	font-size: 1.2em;
}
.history__item {
	border-radius: 100%;
	margin: 0 0.3em;
}
</style>