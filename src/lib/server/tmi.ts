import { s } from '@sapphire/shapeshift'
import { redis } from './redis'
import { Client } from 'tmi.js'
import { env } from './environment'

const assertConnection = ( ( ( _target: Function, _method: string | symbol, descriptor: PropertyDescriptor ) => { // eslint-disable-line
	const original = descriptor.value as Function // eslint-disable-line
	descriptor.value = async function ( ...args: unknown[] ) {
		if ( TmiClient.instance?.expired ) {
			await TmiClient.reconnect()
		}
		const result = original.call( this, ...args ) // eslint-disable-line
		return result // eslint-disable-line
	}
} ) as unknown as ( _target: Function, _context: ClassMethodDecoratorContext ) => void ) // eslint-disable-line

export class TmiClient {
	public static instance: TmiClient | null = null
	protected static readonly schema = s.object( {
		access_token: s.string,
		created_at: s.string.transform( value => parseInt( value, 10 ) ),
		expires_in: s.string.transform( value => parseInt( value, 10  ) )
	} )

	public client: Client
	public expiry = 0

	public static async getClient(): Promise<TmiClient> {
		if ( !this.instance || this.instance.expired ) {
			this.instance = await this.reconnect()
		}
		return this.instance
	}

	public static async reconnect(): Promise<TmiClient> {
		const stored = TmiClient.schema.parse( await redis.hgetall( 'twitch-user' ) )
		const client = new Client( {
			identity: {
				password: `oauth:${ stored.access_token }`,
				username: env.TWITCH_USER
			}
		} )
		const tmi = new TmiClient( client )
		tmi.expiry = stored.created_at + stored.expires_in * 1000
		await client.connect()
		return tmi
	}

	public constructor( client: Client ) {
		this.client = client
	}

	public get expired(): boolean {
		return Date.now() > this.expiry
	}

	@assertConnection
	public async say( channel: string, message: string ): Promise<void> {
		await this.client.say( channel, message )
	}
}
