import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class BanlistStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'banlist' )
	public readonly identifier = BanlistStrategy.identifier

	public bannedPokemon = new Set<string>()

	public exclude( options: ExclusionOptions ): boolean {
		return this.bannedPokemon.has( options.pokemon )
	}
}
