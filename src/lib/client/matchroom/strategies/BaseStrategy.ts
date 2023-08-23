import type { Player } from '../Player'
import type { Pokemon } from '../Pokemon'

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
