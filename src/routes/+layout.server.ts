import { trpc } from '$lib/client/trpc'
import { t, TwitchClient } from '$lib/server'
import type { LayoutServerLoad } from './$types'

const availableLanguages = new Set( Object.keys( import.meta.glob( '../lib/i18n/*.json' ) ).map( i => i.match( /(\w+)\.json/ )?.at( 1 ) ) )

export const load: LayoutServerLoad = async event => {
	const acceptLanguage = event.request.headers.get( 'accept-language' )?.split( /(,|;)/g )
	const language = acceptLanguage?.find( i => availableLanguages.has( i ) ) ?? 'en'

	const userId = event.cookies.get( 'user_id' )
	try {
		const user = userId
			? await trpc( event ).twitch.me.query().catch( () => null )
			: null

		return {
			// eslint-disable-next-line
			i18n: ( await import( `../lib/i18n/${ language }.json` ) ).default as Record<string, string>,
			user: user?.data[ 0 ] ?? null
		}
	} catch {
		if ( userId ) {
			event.cookies.delete( 'user_id' )
			await TwitchClient.remove( userId )
		}

		return {
			// eslint-disable-next-line
			i18n: ( await import( `../lib/i18n/${ language }.json` ) ).default as Record<string, string>,
			user: null
		}
	}
}
