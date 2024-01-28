import get from 'lodash-es/get'
import pokemon from '../../../pokemon.json'
import { s } from '@sapphire/shapeshift'
import sample from 'lodash-es/sample'
import { matchroom } from '../stores/matchroom'
import random from 'lodash-es/random'

type Role = 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter'
const ROLE = s.enum( ...[ 'Attacker', 'All-Rounder', 'Defender', 'Speedster', 'Supporter' ] as const )

export class Pokemon {
	public static readonly ALL = Object.keys( pokemon )
	public static readonly PER_TYPES = Object.entries( pokemon ).reduce( ( list, [ pokemon, data ] ) => {
		for ( const type of data.types ) {
			const arr = list[ type ] ?? new Set() // eslint-disable-line
			list[ type ] ??= arr // eslint-disable-line
			arr.add( pokemon )
		}
		return list
	}, {} as Record<string, Set<string>> )
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

	public static getPokemonHolowearCount( name: string ): number {
		if ( name === 'Mr. Mime' ) return pokemon[ 'Mr. Mime' ].holowear
		return s.number.parse( get( pokemon, `${ name }.holowear` ) )
	}

	public static getPokemonRole( name: string ): Role {
		if ( name === 'Mr. Mime' ) return 'Supporter'
		return ROLE.parse( get( pokemon, `${ name }.role` ) )
	}

	public static getPokemonTachie( name: string ): string {
		const holowearCount = Pokemon.getPokemonHolowearCount( name )
		const index = random( 0, holowearCount - 1, false )
		if ( name === 'Mr. Mime' ) name = 'Mr_Mime'
		return `${ name.replace( / /g, '_' ) }_${ index }`
		//return `${ name } ${ index }.webp`
	}

	#displayName: string
	public displayRole: Role = 'Attacker'
	#name: string
	public role: Role = 'Attacker'
	public tachie: string

	public constructor( name?: string ) {
		this.#name = name ?? Pokemon.getRandomPokemon()
		this.name = this.name
		this.#displayName = this.name
		this.displayRole = this.role
		this.tachie = Pokemon.getPokemonTachie( this.name )
	}

	public get displayName(): string {
		return this.#displayName
	}

	public set displayName( value: string ) {
		this.#displayName = value
		this.displayRole = Pokemon.getPokemonRole( value )
		this.tachie = Pokemon.getPokemonTachie( value )
	}

	public get name(): string {
		return this.#name
	}

	public set name( value: string ) {
		this.#name = value
		this.role = Pokemon.getPokemonRole( value )
	}

	public shuffle( finalPokemon: string, skipAnimation = false ) {
		this.name = finalPokemon

		if ( skipAnimation ) {
			this.displayName = this.name
			matchroom.update( m => m )
			return
		}

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
