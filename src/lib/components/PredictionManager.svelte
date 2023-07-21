<script lang="ts">
    import { page } from "$app/stores";
    import { _ } from "$lib/client/stores/i18n";
    import { trpc } from "$lib/client/trpc";
    import Button from "./Button.svelte";

	const t = trpc($page)
	let prediction: Awaited<ReturnType<typeof t[ 'twitch' ][ 'createPrediction' ][ 'mutate' ]>> | null = null

	const startPrediction = async ( e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement } ) => {
		e.currentTarget.disabled = true
		
		prediction = await t.twitch.createPrediction.mutate( {
			outcomes: [
				$_.get( 'prediction.team-orange' ),
				$_.get( 'prediction.team-purple' )
			],
			time: 120,
			title: $_.get( 'prediction.question' )
		} )
		
		if ( 'error' in prediction ) {
			prediction = null
			return
		}

		e.currentTarget.disabled = false
	}

	const stopPrediction = ( team: 'orange' | 'purple' ) => {
		return async ( e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement } ) => {
			if ( !prediction ) return
			e.currentTarget.disabled = true

			try {
				await t.twitch.endPrediction.mutate( {
					broadcasterId: prediction.data[0].broadcaster_id,
					id: prediction.data[0].id,
					winner: prediction.data[0].outcomes.find( i => i.title === $_.get( `prediction.team-${ team }` ) )!.id
				} )
			} finally {
				prediction = null
				e.currentTarget.disabled = false
			}
		}
	}
</script>

<div class="prediction">
	{ #if prediction }
		<Button style="default" click={ stopPrediction( 'orange' ) }> { $_.get( 'prediction.team-orange' ) } </Button>
		<Button style="purple" click={ stopPrediction( 'purple' ) }> { $_.get( 'prediction.team-purple' ) } </Button>
	{ :else }
		<Button style="purple" click={ startPrediction }> { $_.get( 'prediction.start' ) } </Button>
	{ /if }
</div>

<style>
.prediction {
	margin-top: 2em;
	text-align: center;
}
</style>