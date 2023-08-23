import { Matchroom } from '../matchroom'
import { writable } from 'svelte/store'

export const matchroom = writable( new Matchroom() )

matchroom.update( room => {
	Matchroom.store = matchroom
	return room
} )
