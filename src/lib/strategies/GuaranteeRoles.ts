import { BaseStrategy } from './BaseStrategy'
import pokemon from '../../pokemon.json'

export class GuaranteeRolesStrategy extends BaseStrategy {
	public exclude( name: string, previousPokemon: string[] ): boolean {		
		const usedRoles = previousPokemon.map( i => this.getRole( i ) )
		const role = this.getRole( name )

		console.log( [ name, previousPokemon, usedRoles, role ] )

		return usedRoles.includes( role )
	}

	protected getRole( name: string ): string | undefined {
		const item = name in pokemon ? pokemon[ name as keyof typeof pokemon ] : undefined
		return item?.role
	}
}
