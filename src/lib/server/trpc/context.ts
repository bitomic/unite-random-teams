import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

export const createContext = ( event: RequestEvent ) => ( {
	userId: event.cookies.get( 'user_id' )
} )

export type Context = inferAsyncReturnType<typeof createContext>
