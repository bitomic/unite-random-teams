import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

// eslint-disable-next-line require-await
export const createContext = async ( event: RequestEvent ) => ( {
	userId: event.cookies.get( 'user_id' )
} )

export type Context = inferAsyncReturnType<typeof createContext>
