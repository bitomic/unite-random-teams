import type { Player } from '$lib/stores/matchmaking'
import { BaseStrategy } from './BaseStrategy'

export class HistoryStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'history' )
	public readonly identifier = HistoryStrategy.identifier

	public readonly history: Record<string, Set<string>> = {}

	public exclude( name: string, _team: string[], _team2: string[], player?: Player ): boolean {
		if ( !player ) return false
		const playerHistory = this.history[ player.name ]
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if ( !playerHistory ) return false
		return playerHistory.has( name )

	}
}
