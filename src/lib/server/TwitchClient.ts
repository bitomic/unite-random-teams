import { s } from '@sapphire/shapeshift'
import { redis } from './redis'

export interface TwitchOptions {
	access_token: string
	created_at: number
	expires_in: number
	refresh_token: string
	scope: string[]
	token_type: string
}

export class TwitchClient {
	public static readonly validator = s.object<TwitchOptions>( {
		access_token: s.string,
		created_at: s.number,
		expires_in: s.number.int,
		refresh_token: s.string,
		scope: s.string.array,
		token_type: s.string
	} ).ignore

	public static getKey( userId: string ): string {
		return `twitch/${ userId }`
	}

	public static async register( userId: string, options: unknown ) {
		const token = this.validator.parse( Object.assign( {}, options, {
			created_at: Date.now(),
		} ) )
		await redis.set( this.getKey( userId ), JSON.stringify( token ) )
	}
}
