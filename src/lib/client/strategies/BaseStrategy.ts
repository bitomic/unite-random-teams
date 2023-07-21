import type { Player } from '../structures'

export interface ExclusionOptions {
	otherTeam?: Player[]
	player: Player
	pokemon: string
	team: Player[]
}

export abstract class BaseStrategy {
	public abstract readonly identifier: symbol

	public abstract exclude( options: ExclusionOptions ): boolean
}
