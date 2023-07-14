import type { Player } from '$lib/stores/matchmaking'
import { BaseStrategy } from './BaseStrategy'

export class UniqueTeamStrategy extends BaseStrategy {
	public exclude( name: string, previousPokemon: string[] ): boolean {
		if ( previousPokemon.length > 5 ) previousPokemon = previousPokemon.slice( 5 )
		return !!previousPokemon.find( i => i === name )
	}
}
