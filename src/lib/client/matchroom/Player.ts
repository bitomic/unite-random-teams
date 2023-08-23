import { faker } from '@faker-js/faker'
import { Pokemon } from './Pokemon'

export class Player {
	protected botName: string
	public name: string
	public pokemon: Pokemon

	public constructor() {
		this.botName = faker.science.chemicalElement().name
		this.name = this.botName
		this.pokemon = new Pokemon()
	}

	public isBot(): boolean {
		return this.name === this.botName
	}

	public reset(): void {
		this.name = this.botName
	}
}
