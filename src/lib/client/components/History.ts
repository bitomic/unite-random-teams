export class History {
	public history: Record<string, string[] | undefined> = {}

	public clear() {
		this.history = {}
	}

	public add( player: string, pokemon: string ) {
		const list = this.getPlayerHistory( player )
		list.push( pokemon )
		this.history[ player ] = list.slice( -5 )
	}

	public getPlayerHistory( player: string ): string[] {
		return this.history[ player ] ?? []
	}

	public hasPlayerUsedRecently( player: string, pokemon: string ): boolean {
		const history = this.getPlayerHistory( player )
		return history.includes( pokemon )
	}
}
