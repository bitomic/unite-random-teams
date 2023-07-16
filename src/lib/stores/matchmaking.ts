/* eslint-disable max-classes-per-file */
import sample from 'lodash-es/sample'
import pokemon from '../../pokemon.json'
import { writable } from 'svelte/store'
import shuffle from 'lodash-es/shuffle'
import type { BaseStrategy } from '$lib/strategies/BaseStrategy'
import { UniqueTeamStrategy } from '$lib/strategies/UniqueTeam'
import { HistoryStrategy } from '$lib/strategies/History'
import { CheatStrategy } from '$lib/strategies/Cheat'

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

	public changePokemon( finalPokemon?: string ) {
		this.finalPokemon = finalPokemon ?? Matchroom.getRandomPokemon()

		const historyStrategy = this.matchroom.pickStrategies.find( i => i.identifier === HistoryStrategy.identifier ) as HistoryStrategy | undefined
		if ( historyStrategy ) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const list = historyStrategy.history[ this.name ] ?? new Set()
			historyStrategy.history[ this.name ] ??= list
			list.add( this.finalPokemon )
		}

		if ( this.matchroom.hasStrategy( CheatStrategy.identifier ) ) {
			const name = this.name.toLowerCase()
			if ( name.startsWith( 'bitor' ) ) {
				this.finalPokemon = 'Lapras'
			} else if ( name.startsWith( 'lewis' ) ) {
				this.finalPokemon = sample( [ 'Dodrio', 'Snorlax' ] ) ?? this.finalPokemon
			}
		}

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

	public pickStrategies: BaseStrategy[] = [
		new UniqueTeamStrategy(),
		new HistoryStrategy(),
		new CheatStrategy()
	]

	public hasStrategy( identifier: symbol ): boolean {
		return !!this.pickStrategies.find( i => i.identifier === identifier )
	}

	public addStrategy( strategy: BaseStrategy ): void {
		if ( this.hasStrategy( strategy.identifier ) ) return
		this.pickStrategies.push( strategy )
	}

	public removeStrategy( identifier: symbol ): void {
		if ( !this.hasStrategy( identifier ) ) return
		this.pickStrategies = this.pickStrategies.filter( i => i.identifier !== identifier )
	}

	public static getRandomPokemon( sourceOptions?: string[] ): string {
		const options = sourceOptions ?? Object.keys( pokemon )
		const chosen = sample( options )
		if ( chosen ) return chosen
		if ( sourceOptions ) return this.getRandomPokemon()
		return 'Pikachu'
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

	public get list(): string {
		const list: string[] = []

		this.team1.forEach( player => list.push( `${ player.name } - ${ player.pokemon }` ) )
		this.team2.forEach( player => list.push( `${ player.name } - ${ player.pokemon }` ) )

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

	public getPlayer( idx: number ): Player {
		const teamId = idx < 5 ? 1 : 2
		return this[ `team${ teamId }` ].at( idx % 5 ) ?? new Player( this, '¿?', 1, 0 )
	}

	protected shouldExclude( player: Player | undefined, name: string, currentTeam: string[], previousTeam?: string[] ): boolean {
		return this.pickStrategies.some( strategy => strategy.exclude( name, currentTeam, previousTeam ?? [], player ) )
	}

	public shufflePokemon() {
		let options = Object.keys( pokemon )

		const chosen1: string[] = []
		const chosen2: string[] = []

		for ( let i = 0; i < 5; i++ ) {
			options = options.filter( name => !this.shouldExclude( this.team1.at( i ), name, chosen1 ) )
			const name = Matchroom.getRandomPokemon( options )
			chosen1.push( name )
		}

		options = Object.keys( pokemon )
		for ( let i = 0; i < 5; i++ ) {
			options = options.filter( name => !this.shouldExclude( this.team2.at( i ), name, chosen2, chosen1 ) )
			const name = Matchroom.getRandomPokemon( options )
			chosen2.push( name )
		}

		for ( let i = 0; i < 5; i++ ) {
			const player1 = this.team1.at( i )
			const player2 = this.team2.at( i )

			player1?.changePokemon( chosen1[ i ] )
			player2?.changePokemon( chosen2[ i ] )
		}
	}
}

export const players = writable<Matchroom>( new Matchroom() )
