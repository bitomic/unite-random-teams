import type { BaseStrategy, ExclusionOptions } from '../strategies/BaseStrategy'

export class Strategist {
	public strategies: BaseStrategy[] = []

	public constructor( ...strategies: BaseStrategy[] ) {
		this.strategies = strategies
	}

	public addStrategy( strategy: BaseStrategy ): void {
		if ( this.hasStrategy( strategy.identifier ) ) return
		this.strategies.push( strategy )
	}

	public hasStrategy( identifier: symbol ): boolean {
		return !!this.strategies.find( s => s.identifier === identifier )
	}

	public removeStrategy( strategy: BaseStrategy ): void {
		this.strategies = this.strategies.filter( i => i.identifier !== strategy.identifier )
	}

	public exclude( options: ExclusionOptions ): boolean {
		return this.strategies.some( s => s.exclude( options ) )
	}
}
