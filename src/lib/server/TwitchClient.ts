import { s } from '@sapphire/shapeshift'
import { redis } from './redis'
import { env } from './environment'
import { t } from './trpc'
import { trpc } from '$lib/client/trpc'

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
		await redis.expire( this.getKey( userId ), token.expires_in / 1000 )

		const client = await TwitchClient.fetch( userId )
		try {
			const req = await client.get( 'users' ) as {
				data: [ {
					display_name: string
					login: string
					profile_image_url: string
				} ]
			}
			const [ user ] = req.data
			await fetch( env.DISCORD_WEBHOOK, {
				body: JSON.stringify( {
					embeds: [ {
						author: {
							icon_url: user.profile_image_url,
							name: user.display_name,
							url: `https://twitch.tv/${ user.login }`
						},
						color: 0x7f56f9
					} ]
				} ),
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST'
			} )
		} catch { // eslint-disable-line no-empty

		}
	}

	public static async fetch( userId: string ): Promise<TwitchClient> {
		const stored = await redis.get( this.getKey( userId ) )
		if ( !stored ) {
			throw new Error( 'Session not found' )
		}

		const options = this.validator.parse( JSON.parse( stored ) )

		if ( options.created_at + options.expires_in <= Date.now() ) {
			throw new Error( 'Session expired' )
		}

		return new TwitchClient( options )
	}

	public static async remove( userId: string ): Promise<void> {
		const key = this.getKey( userId )
		await redis.del( key )
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

	public async post( route: string, body: Record<string, unknown> ) {
		const url = new URL( `helix/${ route }`, 'https://api.twitch.tv' )

		const req = await fetch( url, {
			body: JSON.stringify( body ),
			headers: {
				Authorization: `Bearer ${ this.options.access_token }`,
				'Client-Id': env.TWITCH_CLIENT_ID,
				'Content-Type': 'application/json'
			},
			method: 'POST'
		} )

		return req
	}
}
