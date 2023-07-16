import type { Player } from '$lib/stores/matchmaking'
import { BaseStrategy } from './BaseStrategy'

export class CheatStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'cheat' )
	public readonly identifier = CheatStrategy.identifier

	public exclude(): boolean {
		return false
	}
}
