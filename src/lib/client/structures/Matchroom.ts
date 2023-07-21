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
				player: player.name,
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
				player: player.name,
				pokemon,
				team: this.team2.slice( 0, i )
			} ) )
			player.changePokemon( sample( options ) )
		}
	}

	public get players(): string[] { return this.playerlist }

	public queue( name: string ) {
		if ( this.playerlist.includes( name ) ) return
		this.playerlist.push( name )

		const defaultPlayer = [ ...this.team1, ...this.team2 ].find( p => this.startingNames.has( p.name ) )
		if ( defaultPlayer ) {
			defaultPlayer.name = name
		}

		this.store?.set( this )
	}

	public swap( from: number, to: number ) {
		if ( from >= this.playerlist.length || to >= this.playerlist.length ) return

		const pivot = this.playerlist.at( from )
		if ( !pivot ) return

		this.playerlist[ from ] = this.playerlist[ to ]
		this.playerlist[ to ] = pivot

		const fromPlayer = this.findPlayerByName( this.playerlist[ from ] )
		const toPlayer = this.findPlayerByName( this.playerlist[ to ] )
		if ( fromPlayer ) fromPlayer.name = this.playerlist[ to ]
		if ( toPlayer ) toPlayer.name = this.playerlist[ from ]

		this.store?.set( this )
	}

	public findPlayerByName( name?: string ): Player | undefined {
		return this.team1.find( p => p.name === name )
			?? this.team2.find( p => p.name === name )
	}
}
