import { Player } from './Player'

export class Team {
	public readonly players: Player[] = []

	public constructor() {
		for ( let i = 0; i < 5; i++ ) {
			this.players.push( new Player() )
		}
	}

	public clear() {
		this.players.forEach( i => i.reset() )
	}

	public *[ Symbol.iterator ]() {
		for ( const player of this.players ) {
			yield player
		}
	}
}
