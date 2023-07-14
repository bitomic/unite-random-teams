import { BaseStrategy } from './BaseStrategy'

export class UniqueTeamStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'unique-team' )
	public readonly identifier = UniqueTeamStrategy.identifier

	public exclude( name: string, team: string[] ): boolean {
		return !!team.find( i => i === name )
	}
}
