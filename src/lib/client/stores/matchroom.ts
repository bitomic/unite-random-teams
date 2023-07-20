import { Matchroom } from '../structures'
import { writable } from 'svelte/store'

export const matchroom = writable( new Matchroom() )

matchroom.update( room => {
	room.store = matchroom
	return room
} )
