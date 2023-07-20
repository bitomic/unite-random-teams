/* eslint-disable max-classes-per-file */
import { faker } from '@faker-js/faker'
import pokemon from '../../../pokemon.json'
import { writable } from 'svelte/store'
import sample from 'lodash-es/sample'

export interface PlayerOptions {
	name: string
	pokemon: string
}

export class Player {
	public finalPokemon: string
	public readonly matchroom: Matchroom
	public readonly options: PlayerOptions

	public constructor( options: PlayerOptions, matchroom: Matchroom ) {
		this.finalPokemon = options.pokemon
		this.matchroom = matchroom
		this.options = options
	}

	public get name(): string { return this.options.name }
	public get pokemon(): string { return this.options.pokemon }
	public get role(): 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter' {
		return pokemon[ this.pokemon as keyof typeof pokemon ].role as 'Attacker' | undefined ?? 'Attacker'
	}

	public changePokemon( name?: string ) {
		this.finalPokemon = name ?? this.matchroom.getRandomPokemon()

		let counter = 1
		const iterations = Math.floor( 3 + 5 * Math.random() )

		const interval = setInterval( () => {
			if ( ++counter >= iterations ) {
				this.options.pokemon = this.finalPokemon
				clearInterval( interval )
			} else {
				this.options.pokemon = this.matchroom.getRandomPokemon()
			}

			matchroom.set( this.matchroom )
		}, 500 )
	}
}

export class Matchroom {
	public readonly team1: Player[] = []
	public readonly team2: Player[] = []

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
}

export const matchroom = writable( new Matchroom() )
