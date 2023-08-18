import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class UniqueTeamStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-team' )
	public readonly identifier = UniqueTeamStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const teamPokemon = options.team.map( i => i.finalPokemon )
		if ( options.pokemon.startsWith( 'Mewtwo' ) ) {
			return teamPokemon.some( i => i.startsWith( 'Mewtwo' ) )
		} else {
			return teamPokemon.includes( options.pokemon )
		}
	}
}
