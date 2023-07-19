import get from 'lodash-es/get'
import { writable } from 'svelte/store'

class i18nManager {
	public i18n: Record<string, string> = {}

	public get( key: string ) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return get( this.i18n, key ) ?? `<${ key }>`
	}
}

export const _ = writable( new i18nManager() )
