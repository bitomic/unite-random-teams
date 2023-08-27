import get from 'lodash-es/get'
import pokemon from '../../../pokemon.json'
import { s } from '@sapphire/shapeshift'
import sample from 'lodash-es/sample'
import { matchroom } from '../stores/matchroom'

type Role = 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter'
const ROLE = s.enum( ...[ 'Attacker', 'All-Rounder', 'Defender', 'Speedster', 'Supporter' ] as const )

export class Pokemon {
	public static readonly ALL = Object.keys( pokemon )
	public static readonly ROLES = [ 'Attacker', 'All-Rounder', 'Defender', 'Speedster', 'Supporter' ]
	public static readonly PER_ROLE = Object.entries( pokemon ).reduce( ( list, item ) => {
		const role = item[ 1 ].role as Role
		const group = list[ role ] ?? [] // eslint-disable-line
		list[ role ] ??= group // eslint-disable-line
		group.push( item[ 0 ] )
		return list
	}, {} as Record<Role, string[]> )

	public static getRandomPokemon(): string {
		return sample( this.ALL ) ?? 'Pikachu'
	}

	public static getPokemonRole( name: string ): Role {
		if ( name === 'Mr. Mime' ) return 'Supporter'
		return ROLE.parse( get( pokemon, `${ name }.role` ) )
	}

	#displayName: string
	public displayRole: Role = 'Attacker'
	#name: string
	public role: Role = 'Attacker'

	public constructor( name?: string ) {
		this.#name = name ?? Pokemon.getRandomPokemon()
		this.name = this.name
		this.#displayName = this.name
		this.displayRole = this.role
	}

	public get displayName(): string {
		return this.#displayName
	}

	public set displayName( value: string ) {
		this.#displayName = value
		this.displayRole = Pokemon.getPokemonRole( value )
	}

	public get name(): string {
		return this.#name
	}

	public set name( value: string ) {
		this.#name = value
		this.role = Pokemon.getPokemonRole( value )
	}

	public shuffle( finalPokemon: string ) {
		this.name = finalPokemon

		let counter = 0
		const total = 3 + Math.random() * 3
		const interval = setInterval( () => {
			this.displayName = Pokemon.getRandomPokemon()
			matchroom.update( m => m )

			if ( ++counter >= total ) {
				this.displayName = this.name
				clearInterval( interval )
				matchroom.update( m => m )
			}
		}, 500 )
	}
}
