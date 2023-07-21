export class History {
	public history = new Map<string, string[]>()

	public clear() {
		this.history.clear()
	}

	public add( player: string, pokemon: string ) {
		const list = this.getPlayerHistory( player )
		list.push( pokemon )

		if ( !this.history.has( player ) ) {
			this.history.set( player, list.slice( -5 ) )
		}
	}

	public getPlayerHistory( player: string ): string[] {
		return this.history.get( player ) ?? []
	}

	public hasPlayerUsedRecently( player: string, pokemon: string ): boolean {
		const history = this.getPlayerHistory( player )
		return history.includes( pokemon )
	}
}
