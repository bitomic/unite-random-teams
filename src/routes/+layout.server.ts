import type { LayoutServerLoad } from './$types'

const availableLanguages = new Set( Object.keys( import.meta.glob( '../lib/i18n/*.json' ) ).map( i => i.match( /(\w+)\.json/ )?.at( 1 ) ) )

export const load: LayoutServerLoad = async event => {
	const acceptLanguage = event.request.headers.get( 'accept-language' )?.split( /(,|;)/g )
	const language = acceptLanguage?.find( i => availableLanguages.has( i ) ) ?? 'en'

	return {
		// eslint-disable-next-line
		i18n: ( await import( `../lib/i18n/${ language }.json` ) ).default
	}
}
