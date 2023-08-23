import { BaseStrategy, type ExclusionOptions } from './BaseStrategy'

export class BanlistStrategy extends BaseStrategy {
	public static readonly identifier = Symbol( 'banlist' )
	public readonly identifier = BanlistStrategy.identifier

	protected bannedPokemon = new Set<string>()

	public constructor() {
		super()

		if ( typeof localStorage === 'undefined' ) return
		const stored = localStorage.getItem( 'banlist' )
		if ( !stored ) return
		try {
			const list = JSON.parse( stored ) as string[]
			this.bannedPokemon = new Set( list )
		} catch {
			localStorage.removeItem( 'banlist' )
		}
	}

	protected store() {
		if ( typeof localStorage === 'undefined' ) return
		localStorage.setItem( 'banlist', JSON.stringify( [ ...this.bannedPokemon ] ) )
	}

	public add( name: string ) {
		this.bannedPokemon.add( name )
		this.store()
	}

	public has( name: string ): boolean {
		return this.bannedPokemon.has( name )
	}

	public delete( name: string ) {
		this.bannedPokemon.delete( name )
		this.store()
	}

	public exclude( options: ExclusionOptions ): boolean {
		return this.bannedPokemon.has( options.pokemon )
	}
}
