import type { Matchroom } from './Matchroom'
import pokemon from '../../../pokemon.json'
import type { Writable } from 'svelte/store'

export interface PlayerOptions {
	name: string
	pokemon: string
}

export class Player {
	#finalPokemon: string
	public readonly matchroom: Matchroom
	public readonly options: PlayerOptions

	public constructor( options: PlayerOptions, matchroom: Matchroom ) {
		this.#finalPokemon = options.pokemon
		this.matchroom = matchroom
		this.options = options
	}

	public get name(): string { return this.options.name }
	public set name( value: string ) { this.options.name = value }
	public get pokemon(): string { return this.options.pokemon }
	public get role(): 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter' {
		return this.getPokemonRole( this.pokemon )
	}
	public get finalPokemon(): string { return this.#finalPokemon }
	public set finalPokemon( name: string ) {
		this.#finalPokemon = name
		if ( this.matchroom.startingNames.has( this.name ) ) return
		this.matchroom.history.add( this.name, name )
	}
	public get finalRole(): 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter' {
		return this.getPokemonRole( this.finalPokemon )
	}

	public getPokemonRole( name: string ): 'Attacker' | 'All-Rounder' | 'Defender' | 'Speedster' | 'Supporter' {
		if ( name === 'Mr. Mime' ) return 'Supporter'

		return pokemon[ name as keyof typeof pokemon ].role as 'Attacker' | undefined ?? 'Attacker'
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

			this.matchroom.store?.set( this.matchroom )
		}, 500 )
	}
}
