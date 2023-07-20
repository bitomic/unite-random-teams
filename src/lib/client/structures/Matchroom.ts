import { faker } from '@faker-js/faker'
import { Player } from './Player'
import pokemon from '../../../pokemon.json'
import sample from 'lodash-es/sample'
import shuffle from 'lodash-es/shuffle'
import type { Writable } from 'svelte/store'
import { Strategist } from './Strategist'
import { UniqueTeamStrategy } from '../strategies/UniqueTeam'
import { GlobalUniquePokemonStrategy } from '../strategies/GlobalUniquePokemon'

export class Matchroom {
	public readonly pickStrategies = new Strategist(
		new UniqueTeamStrategy(),
		new GlobalUniquePokemonStrategy()
	)
	public readonly waitlist = new Set<string>()
	public store: Writable<Matchroom> | null = null
	public team1: Player[] = []
	public team2: Player[] = []

	protected readonly options = Object.keys( pokemon )
	protected readonly startingNames = new Set<string>()

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
}
