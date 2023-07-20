<script>
    import { matchroom } from "$lib/client/stores/matchroom";
    import RosterBox from "./RosterBox.svelte";

</script>
<div class="matchroom">
	<div class="matchroom__team">
		{ #each $matchroom.team1 as player }
			<RosterBox player={ player } team="purple" />
		{ /each }
	</div>
	<div class="matchroom__vs">
		<img src="vs.png" alt="vs">
	</div>
	<div class="matchroom__team">
		{ #each $matchroom.team2 as player }
			<RosterBox player={ player } team="orange" />
		{ /each }
	</div>
</div>

<style>
.matchroom {
	align-items: center;
	display: flex;
	flex-direction: column;
	margin: 1em auto;
	row-gap: 1em;
	width: fit-content;
}
.matchroom__team {
	column-gap: 1.5em;
	display: flex;
}
</style>