import type { Player } from '$lib/stores/matchmaking'

export abstract class BaseStrategy {
	public abstract readonly identifier: symbol

	public abstract exclude( name: string, team: string[], otherTeam: string[], player?: Player ): boolean
}
