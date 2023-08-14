import { faker } from '@faker-js/faker'
import { Player } from './Player'
import pokemon from '../../../pokemon.json'
import sample from 'lodash-es/sample'
import shuffle from 'lodash-es/shuffle'
import type { Writable } from 'svelte/store'
import { Strategist } from './Strategist'
import { UniqueTeamStrategy } from '../strategies/UniqueTeam'
import { GlobalUniquePokemonStrategy } from '../strategies/GlobalUniquePokemon'
import { History } from '../components'
import { browser } from '$app/environment'

export class Matchroom {
	public readonly history = new History()
	public readonly pickStrategies = new Strategist(
		new UniqueTeamStrategy(),
		new GlobalUniquePokemonStrategy()
	)
	protected playerlist: string[] = []
	public store: Writable<Matchroom> | null = null
	public team1: Player[] = []
	public team2: Player[] = []

	protected readonly options = Object.keys( pokemon )
	public readonly startingNames = new Set<string>()

	public constructor() {
		for ( let i = 1; i <= 10; i++ ) {
			const team = i <= 5 ? this.team1 : this.team2
			const player = new Player( {
				name: faker.science.chemicalElement().name,
				pokemon: this.getRandomPokemon()
			}, this )
			team.push( player )
			this.startingNames.add( player.name )
		}
		this.loadStorage()
	}

	protected loadStorage() {
		if ( !browser ) return
		const players = localStorage.getItem( 'players' )
		if ( !players ) return
		try {
			const json = JSON.parse( players ) as string[]
			for ( const player of json ) {
				this.queue( player )
			}
		} catch {
			return
		}
	}

	protected updateStorage() {
		if ( !browser ) return
		const players = this.playerlist.filter( i => !this.startingNames.has( i ) )
		localStorage.setItem( 'players', JSON.stringify( players ) )
	}

	public getRandomPokemon(): string {
		return sample( this.options ) ?? 'Absol'
	}

	public shufflePlayers(): void {
		const players = shuffle( [ ...this.team1, ...this.team2 ] )
		this.team1 = players.slice( 0, 5 )
		this.team2 = players.slice( 5 )
		this.store?.set( this )
	}

	public shufflePokemon(): void {
		let options = Object.keys( pokemon )

		for ( let i = 0; i < 5; i++ ) {
			const player = this.team1.at( i )
			if ( !player ) continue

			options = options.filter( pokemon => !this.pickStrategies.exclude( {
				player,
				pokemon,
				team: this.team1.slice( 0, i )
			} ) )
			player.changePokemon( sample( options ) )
		}

		options = Object.keys( pokemon )
		for ( let i = 0; i < 5; i++ ) {
			const player = this.team2.at( i )
			if ( !player ) continue

			options = options.filter( pokemon => !this.pickStrategies.exclude( {
				otherTeam: this.team1,
				player,
				pokemon,
				team: this.team2.slice( 0, i )
			} ) )
			player.changePokemon( sample( options ) )
		}
	}

	public get players(): string[] { return this.playerlist }

	public findPlayerTeam( name: string ): 1 | 2 | null {
		const team1 = this.team1.find( i => i.name === name )
		if ( team1 ) return 1

		const team2 = this.team2.find( i => i.name === name )
		if ( team2 ) return 2

		return null
	}

	public updatePlayerlist() {
		const teamPlayers = new Set<string>()
		const list: string[] = []
		for ( const player of [ ...this.team1, ...this.team2 ] ) {
			if ( this.startingNames.has( player.name ) ) continue
			teamPlayers.add( player.name )
			list.push( player.name )
		}

		const filtered = this.playerlist.filter( i => !teamPlayers.has( i ) )
		list.push( ...filtered )
		this.playerlist = [ ...new Set( list ) ]
	}

	public remove( name: string ) {
		this.playerlist = this.playerlist.filter( i => i !== name )
		this.history.history.delete( name )
		const player = this.findPlayerByName( name )

		if ( player ) {
			const unusedName = this.playerlist.at( 9 )
				?? [ ...this.startingNames ].find( i => !this.findPlayerByName( i ) )
				?? faker.science.chemicalElement().name
			player.name = unusedName
		}
		this.updatePlayerlist()

		this.store?.set( this )
		this.updateStorage()
	}

	public queue( name: string ) {
		if ( this.playerlist.includes( name ) ) return
		this.playerlist.push( name )

		const defaultPlayer = [ ...this.team1, ...this.team2 ].find( p => this.startingNames.has( p.name ) )
		if ( defaultPlayer ) {
			defaultPlayer.name = name
		}

		this.store?.set( this )
		this.updateStorage()
	}

	public swap( from: string, to: string ) {
		const fromIndex = this.playerlist.findIndex( i => i === from )
		const toIndex = this.playerlist.findIndex( i => i === to )
		const pivot = this.playerlist.at( fromIndex )
		if ( !pivot ) return

		this.playerlist[ fromIndex ] = this.playerlist[ toIndex ]
		this.playerlist[ toIndex ] = pivot

		const fromPlayer = this.findPlayerByName( from )
		const toPlayer = this.findPlayerByName( to )
		if ( fromPlayer ) fromPlayer.name = to
		if ( toPlayer ) toPlayer.name = from

		this.updatePlayerlist()
		this.store?.set( this )
		this.updateStorage()
	}

	public findPlayerByName( name?: string ): Player | undefined {
		return this.team1.find( p => p.name === name )
			?? this.team2.find( p => p.name === name )
	}

	public teamPlayers( list: Player[] ): Player[] {
		return list.filter( i => !this.startingNames.has( i.name ) )
	}

	public get team1Players(): Player[] {
		return this.teamPlayers( this.team1 )
	}

	public get team2Players(): Player[] {
		return this.teamPlayers( this.team2 )
	}

	public get waitlist(): string[] {
		return this.playerlist.filter( i => !this.startingNames.has( i ) && !this.team1.find( j => j.name === i ) && !this.team2.find( j => j.name === i ) )
	}

	public rotate( team: 1 | 2 ): void {
		const newPlayers = this.waitlist.slice( 0, 5 )

		const teamPlayers = shuffle( this[ `team${ team }` ].map( i => i.name ) )

		if ( newPlayers.length < 5 ) {
			newPlayers.push( ...teamPlayers.slice( 0, 5 - newPlayers.length ) )
		}

		for ( let idx = 0; idx < 5; idx++ ) {
			const player = this[ `team${ team }` ].at( idx )
			const name = newPlayers.at( idx )
			if ( !player || !name ) continue
			player.name = name
		}

		const teamPlayersSet = new Set( teamPlayers )
		this.playerlist = this.playerlist.filter( i => !teamPlayersSet.has( i ) )
		this.playerlist.push( ...teamPlayersSet )
		this.updatePlayerlist()

		this.store?.set( this )
		this.updateStorage()
	}
}
