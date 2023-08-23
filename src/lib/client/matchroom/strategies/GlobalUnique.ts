import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class GlobalUniqueStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'global-unique' )
	public readonly identifier = GlobalUniqueStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const pokemon = [ options.team.map( i => i.pokemon.name ), options.otherTeam?.map( i => i.pokemon.name ) ].flat()
		return pokemon.includes( options.pokemon )
	}
}
