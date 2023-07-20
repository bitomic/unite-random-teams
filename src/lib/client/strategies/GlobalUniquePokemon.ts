import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class GlobalUniquePokemonStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'global-unique-pokemon' )
	public readonly identifier = GlobalUniquePokemonStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const pokemon = [ options.team.map( i => i.finalPokemon ), options.otherTeam?.map( i => i.finalPokemon ) ].flat()
		return pokemon.includes( options.pokemon )
	}
}
