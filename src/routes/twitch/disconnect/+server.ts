import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { env, redis, TwitchClient } from '$lib/server'

export const GET = async ( req: RequestEvent ) => {
	const userId = req.cookies.get( 'user_id' )
	if ( !userId ) throw redirect( 302, '/' )

	const client = await TwitchClient.fetch( userId )

	const url = new URL( 'https://id.twitch.tv/oauth2/revoke' )
	url.searchParams.append( 'client_id', env.TWITCH_CLIENT_ID )
	url.searchParams.append( 'token', client.options.access_token )

	try {
		await redis.del( TwitchClient.getKey( userId ) )
		const revoke = await req.fetch( url, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		} )
	} finally {
		// eslint-disable-next-line no-unsafe-finally
		throw redirect( 302, '/' )
	}
}
