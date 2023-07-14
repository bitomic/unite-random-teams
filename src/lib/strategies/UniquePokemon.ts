import { BaseStrategy } from './BaseStrategy'

export class UniquePokemonStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-pokemon' )
	public readonly identifier = UniquePokemonStrategy.identifier

	public exclude( name: string, team: string[], otherTeam: string[] ): boolean {
		const found = team.find( i => i === name ) ?? otherTeam.find( i => i === name )
		return !!found
	}
}
