import type { Pokemon } from './Pokemon'
import type { BaseStrategy, ExclusionOptions } from './strategies/BaseStrategy'

export class StrategyManager {
	public readonly strategies = new Map<symbol, BaseStrategy>()

	public constructor( ...strategies: BaseStrategy[] ) {
		for ( const strategy of strategies ) {
			this.strategies.set( strategy.identifier, strategy )
		}
	}

	public add( strategy: BaseStrategy ): void {
		if ( this.strategies.has( strategy.identifier ) ) return
		this.strategies.set( strategy.identifier, strategy )
	}

	public delete( strategy: BaseStrategy ): void {
		this.strategies.delete( strategy.identifier )
	}

	public get( identifier: symbol ): BaseStrategy | undefined {
		return this.strategies.get( identifier )
	}

	public has( identifier: symbol ): boolean {
		return this.strategies.has( identifier )
	}

	public get functions() {
		return [ ...this.strategies.values() ]
	}

	public filter( pokemon: string[], exclusionOptions: Omit<ExclusionOptions, 'pokemon'> ): string[] {
		return pokemon.filter( option => !this.functions.some( strategy => strategy.exclude( {
			...exclusionOptions,
			pokemon: option
		} ) ) )
	}
}
