import type { Player } from './Player'

export class Waitlist {
	public players: string[] = []

	public add( name: string ): void {
		if ( this.players.includes( name ) ) return
		this.players.push( name )
	}

	public has( name: string ): boolean {
		return this.players.includes( name )
	}

	public next(): string | undefined {
		return this.players.shift()
	}

	public remove( name: string ): void {
		this.players = this.players.filter( i => i !== name )
	}

	public swap( from: string, to: string ): void {
		const fromIdx = this.players.findIndex( i => i === from )
		const toIdx = this.players.findIndex( i => i === to )
		this.players[ fromIdx ] = to
		this.players[ toIdx ] = from
	}

	public unshift( name: string ): void {
		this.players.unshift( name )
	}

	public *[ Symbol.iterator ]() {
		for ( const player of this.players ) {
			yield player
		}
	}
}
