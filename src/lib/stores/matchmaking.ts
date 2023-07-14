/* eslint-disable max-classes-per-file */
import sample from 'lodash-es/sample'
import pokemon from '../../pokemon.json'
import { writable } from 'svelte/store'
import shuffle from 'lodash-es/shuffle'

export class Player {
	public gender: 'male' | 'female' = 'male'
	public pokemon = 'Pikachu'
	public matchroom: Matchroom
	public name = 'Unknown'
	public skin: 1 | 2 | 3 | 4 = 1
	public team: 1 | 2
	public position: 0 | 1 | 2 | 3 | 4

	public finalPokemon = 'Pikachu'

	public constructor( matchroom: Matchroom, name: string, team: 1 | 2, position: 0 | 1 | 2 | 3 | 4 ) {
		this.matchroom = matchroom
		this.name = name
		this.team = team
		this.position = position
	}

	public changeSkin() {
		if ( this.skin < 4 ) {
			++this.skin
		} else {
			this.skin = 1
			this.gender = this.gender === 'female' ? 'male' : 'female'
		}
	}

	protected isPokemonTaken( name: string ) {
		const players: Player[] = []
		if ( this.team === 2 ) {
			players.push( ...this.matchroom.team1 )
		}
		players.push( ...this.matchroom[ `team${ this.team }` ].slice( 0, this.position ) )
		return players.map( i => i.finalPokemon ).includes( name )
	}

	protected getUniquePokemon() {
		let pokemon = Matchroom.getRandomPokemon()
		while ( this.isPokemonTaken( pokemon ) ) {
			pokemon = Matchroom.getRandomPokemon()
		}
		return pokemon
	}

	public changePokemon() {
		this.finalPokemon = this.getUniquePokemon()
		let counter = 1
		const iterations = Math.floor( 3 + 5 * Math.random() )

		const interval = setInterval( () => {
			this.pokemon = Matchroom.getRandomPokemon()

			if ( ++counter >= iterations ) {
				this.pokemon = this.finalPokemon
				clearInterval( interval )
			}

			players.set( this.matchroom )
		}, 500 )
	}
}

export class Matchroom {
	public readonly team1: Player[] = []
	public readonly team2: Player[] = []

	public static getRandomPokemon(): string {
		return sample( Object.keys( pokemon ) ) ?? 'Pikachu'
	}

	public addPlayer( name: string | Player ) {
		const teamNumber = this.team1.length <= this.team2.length ? 1 : 2
		const array = this[ `team${ teamNumber }` ]

		if ( typeof name === 'string' ) {
			const player = new Player( this, name, teamNumber, array.length as 0 | 1 | 2 | 3 | 4 )
			array.push( player )
		} else {
			name.team = teamNumber
			name.position = array.length as 0 | 1 | 2 | 3 | 4
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

	public shufflePlayers() {
		const items = shuffle( [ ...this.team1, ...this.team2 ] )
		this.clear()
		for ( const item of items ) {
			this.addPlayer( item )
		}
		players.set( this )
	}

	public shufflePokemon() {
		const items = [ ...this.team1, ...this.team2 ]
		for ( const item of items ) {
			item.changePokemon()
		}
		players.set( this )
	}
}

export const players = writable<Matchroom>( new Matchroom() )
