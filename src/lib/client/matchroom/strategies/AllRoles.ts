import { Pokemon } from '../Pokemon'
import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class AllRolesStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-team' )
	public readonly identifier = AllRolesStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const teamPokemon = options.team.map( i => i.pokemon.role ) as string[]
		const role = Pokemon.getPokemonRole( options.pokemon )
		return teamPokemon.includes( role )
	}
}
