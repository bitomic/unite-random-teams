import { BaseStrategy } from './BaseStrategy'

export class UniqueTeamStrategy extends BaseStrategy {
	public exclude( name: string, team: string[] ): boolean {
		return !!team.find( i => i === name )
	}
}
