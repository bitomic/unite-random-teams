import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { env, TwitchClient } from '$lib/server'

export const load: PageServerLoad = async event => {
	const url = new URL( event.request.url )
	const userId = event.cookies.get( 'user_id' )

	if ( !userId ) {
		throw error( 400 )
	} else if ( userId !== url.searchParams.get( 'state' ) ) {
		throw error( 401 )
	}

	try {
		const tokenUrl = new URL( 'https://id.twitch.tv/oauth2/token' )
		Object.entries( {
			client_id: env.TWITCH_CLIENT_ID,
			client_secret: env.TWITCH_CLIENT_SECRET,
			code: url.searchParams.get( 'code' ) ?? '',
			grant_type: 'authorization_code',
			redirect_uri: env.TWITCH_REDIRECT_URI
		} ).forEach( ( [ key, value ] ) => tokenUrl.searchParams.append( key, value ) )

		const req = await event.fetch( tokenUrl, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		} )
		const token = await req.json() as unknown
		await TwitchClient.register( userId, token )
		throw redirect( 302, '/' )
	} catch {
		throw error( 400 )
	}
}
