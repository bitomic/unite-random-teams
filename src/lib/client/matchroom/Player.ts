import { faker } from '@faker-js/faker'
import { Pokemon } from './Pokemon'

export class Player {
	public static readonly IGN: Record<string, string> = {}

	protected botName: string
	#ign: string | undefined = undefined
	#name: string
	public pokemon: Pokemon

	public constructor() {
		this.botName = faker.science.chemicalElement().name
		this.#name = this.botName
		this.pokemon = new Pokemon()
	}

	public get name(): string {
		return this.#name
	}

	public set name( value: string ) {
		this.#name = value
		this.ign = Player.IGN[ value ]
	}

	public get ign(): string | undefined {
		return this.#ign
	}

	public set ign( value: string ) {
		this.#ign = value
		Player.IGN[ this.name ] = value
	}

	public isBot(): boolean {
		return this.name === this.botName
	}

	public reset(): void {
		this.name = this.botName
	}
}
