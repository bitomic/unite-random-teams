import { writable } from 'svelte/store'

export const players = writable<string[]>( [] )
export const winner = writable<string>( '' )
