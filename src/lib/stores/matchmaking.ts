/* eslint-disable max-classes-per-file */
import sample from 'lodash-es/sample'
import pokemon from '../../pokemon.json'
import { writable } from 'svelte/store'

export class Player {
	public gender: 'male' | 'female' = 'male'
	public pokemon = 'Pikachu'
	public name = 'Unknown'
	public skin: 1 | 2 | 3 | 4 = 1

	public constructor( name: string ) {
		this.name = name
	}

	public changeSkin() {
		if ( this.skin < 4 ) {
			++this.skin
		} else {
			this.skin = 1
			this.gender = this.gender === 'female' ? 'male' : 'female'
		}
	}

	public changePokemon( allowedList?: string[] ) {
		allowedList ??= Object.keys( pokemon )
		this.pokemon = sample( allowedList ) ?? 'Pikachu'
	}
}

export class Matchroom {
	public readonly team1: Player[] = []
	public readonly team2: Player[] = []

	public addPlayer( name: string | Player ) {
		const array = this.team1.length <= this.team2.length ? this.team1 : this.team2

		if ( typeof name === 'string' ) {
			const player = new Player( name )
			array.push( player )
		} else {
			array.push( name )
		}
	}

	public clear() {
		this.team1.splice( 0, this.team1.length )
		this.team2.splice( 0, this.team2.length )
	}

	public get players(): string {
		const list: string[] = []

		for ( let i = 0; i < 5; i++ ) {
			const player1 = this.team1.at( i )
			const player2 = this.team2.at( i )
			if ( player1 ) list.push( player1.name )
			if ( player2 ) list.push( player2.name )
		}

		return list.join( '\n' )
	}

	public set players( names: string ) {
		const list = names.split( /\n/g ).slice( 0, 10 )

		for ( let i = 0; i < list.length; i++ ) {
			const name = list[ i ]
			if ( !name.length ) continue

			const array = i % 2 === 0 ? this.team1 : this.team2
			const index = Math.floor( i / 2 )
			const player = array.at( index )
			if ( player ) {
				player.name = name
			} else {
				array.push( new Player( name ) )
			}
		}
	}
}

export const players = writable<Matchroom>( new Matchroom() )
