import { writable } from 'svelte/store'

export const conditions = writable<null | [ boolean, boolean ]>( null )
