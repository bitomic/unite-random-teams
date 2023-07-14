import type { Player } from '$lib/stores/matchmaking'

export abstract class BaseStrategy {
	public abstract exclude( name: string, team: string[], otherTeam: string[] ): boolean
}
