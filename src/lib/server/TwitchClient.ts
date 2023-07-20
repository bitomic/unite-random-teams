import { s } from '@sapphire/shapeshift'
import { redis } from './redis'
import { env } from './environment'

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
		expires_in: s.number.transform( value => value * 1000 ),
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

	public static async fetch( userId: string ): Promise<TwitchClient> {
		const stored = await redis.get( this.getKey( userId ) )
		if ( !stored ) {
			throw new Error( 'Session not found' )
		}

		const options = this.validator.parse( JSON.parse( stored ) )

		if ( options.created_at + options.expires_in >= Date.now() ) {
			throw new Error( 'Session expired' )
		}

		return new TwitchClient( options )
	}

	public readonly options: TwitchOptions

	public constructor( options: TwitchOptions ) {
		this.options = options
	}

	public async get( route: string, params: Record<string, string> = {} ): Promise<unknown> {
		const url = new URL( `helix/${ route }`, 'https://api.twitch.tv' )
		Object.entries( params ).forEach( ( [ key, value ] ) => url.searchParams.append( key, value ) )

		const req = await fetch( url, {
			headers: {
				Authorization: `Bearer ${ this.options.access_token }`,
				'Client-Id': env.TWITCH_CLIENT_ID
			}
		} )
		return req.json()
	}
}
