import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { env } from '$lib/server'

export const GET = ( req: RequestEvent ) => {
	const userId = crypto.randomUUID()
	req.cookies.set( 'user_id', userId, {
		path: '/'
	} )

	const url = new URL( 'https://id.twitch.tv/oauth2/authorize' )
	url.searchParams.append( 'client_id', env.TWITCH_CLIENT_ID )
	url.searchParams.append( 'redirect_uri', env.TWITCH_REDIRECT_URI )
	url.searchParams.append( 'response_type', 'code' )
	url.searchParams.append( 'scope', 'channel:read:predictions channel:manage:predictions channel:read:subscriptions channel:read:vips moderator:read:chatters moderator:read:followers' )
	url.searchParams.append( 'state', userId )

	throw redirect( 302, url.href )
}
