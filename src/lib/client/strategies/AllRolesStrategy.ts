import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'
import get from 'lodash-es/get'
import pokemon from '../../../pokemon.json'

export class AllRolesStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-team' )
	public readonly identifier = AllRolesStrategy.identifier

	public exclude( options: ExclusionOptions ): boolean {
		const teamPokemon = options.team.map( i => get( pokemon, `${ i.finalPokemon as keyof typeof pokemon }.role` ) ) as string[]
		const role = get( pokemon, `${ options.pokemon as keyof typeof pokemon }.role` ) as string
		return teamPokemon.includes( role )
	}
}
