import type { Player } from './Player'
import shuffle from 'lodash-es/shuffle'
import { Team } from './Team'
import { Waitlist } from './Waitlist'
import { browser } from '$app/environment'
import { s } from '@sapphire/shapeshift'
import { StrategyManager } from './StrategyManager'
import { Pokemon } from './Pokemon'
import sample from 'lodash-es/sample'
import type { Writable } from 'svelte/store'
import { UniqueTeamStrategy } from './strategies/UniqueTeam'
import { BanlistStrategy } from './strategies/Banlist'
import { GlobalUniqueStrategy } from './strategies/GlobalUnique'
import { AllRolesStrategy } from './strategies/AllRoles'

interface MatchroomOptions {
	removeAndRotate?: boolean
	streamerMode?: boolean
}

const refresh = ( ( ( _target: Function, _method: string | symbol, descriptor: PropertyDescriptor ) => { // eslint-disable-line
	const original = descriptor.value as Function // eslint-disable-line
	descriptor.value = function ( ...args: unknown[] ) {
		const result = original.call( this, ...args ) // eslint-disable-line
		Matchroom.store?.update( m => m )
		return result // eslint-disable-line
	}
} ) as unknown as ( _target: Function, _context: ClassMethodDecoratorContext ) => void ) // eslint-disable-line

const update = ( ( ( _target: Function, _method: string | symbol, descriptor: PropertyDescriptor ) => { // eslint-disable-line
	const original = descriptor.value as Function // eslint-disable-line
	descriptor.value = function ( ...args: unknown[] ) {
		const result = original.call( this, ...args ) // eslint-disable-line
		Matchroom.store?.update( m => {
			m.updateStorage()
			return m
		} )
		return result // eslint-disable-line
	}
} ) as unknown as ( _target: Function, _context: ClassMethodDecoratorContext ) => void ) // eslint-disable-line

export class Matchroom {
	public static store: Writable<Matchroom> | null = null
	public readonly strategies = new StrategyManager(
		new UniqueTeamStrategy(),
		new BanlistStrategy(),
		new GlobalUniqueStrategy(),
		new AllRolesStrategy()
	)
	public readonly team1 = new Team()
	public readonly team2 = new Team()
	public readonly waitlist = new Waitlist()

	public readonly bots: Set<string>
	public readonly options: MatchroomOptions = {}

	public constructor() {
		this.bots = new Set( this.players.map( i => i.name ) )
		this.loadStorage()
	}

	public get humans(): Player[] {
		return this.players.filter( i => !i.isBot() )
	}

	public get humans1(): Player[] {
		return this.team1.players.filter( i => !i.isBot() )
	}

	public get humans2(): Player[] {
		return this.team2.players.filter( i => !i.isBot() )
	}

	public get players(): Player[] {
		return [ ...this.team1.players, ...this.team2.players ]
	}

	public get playernames(): string[] {
		return this.players.map( i => i.name )
	}

	public findPlayerByName( name: string ): Player | undefined {
		return this.players.find( i => i.name === name )
	}

	public get( idx: number ): Player | undefined {
		if ( idx < 5 ) return this.team1.players.at( idx )
		if ( idx < 10 ) return this.team2.players.at( idx - 5 )
		return undefined
	}

	@refresh
	protected loadStorage() {
		if ( !browser ) return
		const players = localStorage.getItem( 'players' )
		if ( !players ) return
		try {
			const json = s.string.array.parse( JSON.parse( players ) )
			for ( const player of json ) {
				this.queue( player )
			}
		} catch {
			return
		}
	}

	@refresh
	@update
	public priorize( player: string ) {
		if ( !this.waitlist.has( player ) ) return
		this.waitlist.remove( player )
		this.waitlist.unshift( player )
	}

	@refresh
	@update
	public queue( name: string ): void {
		if ( this.playernames.includes( name ) ) return

		for ( const player of this.players ) {
			if ( this.bots.has( player.name ) ) {
				player.name = name
				return
			}
		}

		this.waitlist.add( name )
	}

	@refresh
	@update
	public remove( name: string ): void {
		if ( this.waitlist.has( name ) ) {
			this.waitlist.remove( name )
			return
		}

		const player = this.findPlayerByName( name )
		if ( !player ) return

		const next = this.waitlist.next()
		if ( next ) {
			player.name = next
		} else {
			player.reset()
		}
	}

	@refresh
	@update
	public rotate( teamIdx: 1 | 2 ): void {
		const team = this[ `team${ teamIdx }` ].players.slice( this.options.streamerMode && teamIdx === 1 ? 1 : 0 )
		const rotatedNames = team.map( i => i.name )

		for ( const player of team ) {
			const next = this.waitlist.next()
			if ( next ) player.name = next
			else player.reset()
		}

		if ( this.options.removeAndRotate ) return
		const shuffled = shuffle( rotatedNames )
		for ( const name of shuffled ) {
			this.queue( name )
		}
	}

	@refresh
	@update
	public shufflePlayers() {
		const streamer = this.team1.players.at( 0 )?.name
		const shuffled = shuffle( this.players ).map( i => i.name )
		const replacement = shuffled.at( 0 )

		if ( this.options.streamerMode && streamer && replacement ) {
			const streamerIdx = shuffled.findIndex( i => i === streamer )
			const [ pivot ] = shuffled
			shuffled[ 0 ] = streamer
			shuffled[ streamerIdx ] = pivot
		}

		for ( let i = 0; i < shuffled.length; i++ ) {
			const player = this.get( i )
			const replacement = shuffled.at( i )
			if ( player && replacement && !this.bots.has( replacement ) ) {
				player.name = replacement
			} else {
				player?.reset()
			}
		}
	}

	@refresh
	public shufflePokemon() {
		this.shuffleTeamPokemon( this.team1.players )
		this.shuffleTeamPokemon( this.team2.players, this.team1.players )
	}

	@refresh
	public shuffleSinglePokemon( name: string ): void {
		const teamIdx = this.team1.players.find( p => p.name === name ) ? 1 : 2
		const team = this[ `team${ teamIdx }` ]
		const playerIdx = team.players.findIndex( p => p.name === name )
		const player = team.players.at( playerIdx )
		if ( !player ) return

		const options = this.strategies.filter( Pokemon.ALL, {
			otherTeam: teamIdx === 1 ? this.team2.players : this.team1.players,
			player,
			team: team.players.filter( p => p.name !== name )
		} )
		const pokemon = new Pokemon( sample( options ) ?? Pokemon.getRandomPokemon() )
		player.pokemon.shuffle( pokemon.name )
	}

	protected shuffleTeamPokemon( team: Player[], otherTeam?: Player[] ) {
		const processedPlayers: Player[] = []
		let options = Pokemon.ALL
		for ( const player of team ) {
			options = this.strategies.filter( options, {
				otherTeam,
				player,
				team: processedPlayers
			} )
			processedPlayers.push( player )

			const finalPokemon = sample( options ) ?? Pokemon.getRandomPokemon()
			player.pokemon.shuffle( finalPokemon )
		}
	}

	@refresh
	@update
	public swap( from: string, to: string ) {
		const fromInWaitlist = this.waitlist.has( from )
		const toInWaitlist = this.waitlist.has( to )

		if ( fromInWaitlist && toInWaitlist ) {
			this.waitlist.swap( from, to )
		} else if ( fromInWaitlist || toInWaitlist ) {
			const waitIdx = this.waitlist.players.findIndex( i => i === from || i === to )
			const player = this.findPlayerByName( from ) ?? this.findPlayerByName( to )
			if ( !player ) return

			const pivot = player.name
			player.name = this.waitlist.players[ waitIdx ]
			this.waitlist.players[ waitIdx ] = pivot
		} else {
			const fromPlayer = this.findPlayerByName( from )
			const toPlayer = this.findPlayerByName( to )
			if ( !fromPlayer || !toPlayer ) return

			const pivot = fromPlayer.name
			fromPlayer.name = toPlayer.name
			toPlayer.name = pivot
		}
	}

	public updateStorage() {
		if ( !browser ) return
		const players = this.players.filter( i => !i.isBot() ).map( i => i.name )
		const list = [ ...players, ...this.waitlist ]
		localStorage.setItem( 'players', JSON.stringify( list ) )
	}
}
