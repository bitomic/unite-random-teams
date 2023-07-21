import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'
import get from 'lodash-es/get'
import pokemon from '../../../pokemon.json'

export class AllRolesStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-team' )
	public readonly identifier = AllRolesStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const teamPokemon = options.team.map( i => i.finalRole ) as string[]
		const role = options.player.getPokemonRole( options.pokemon )
		return teamPokemon.includes( role )
	}
}
