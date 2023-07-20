import type { Router } from '$lib/server/trpc'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof createTRPCClient<Router>> | null = null

export const trpc = ( init?: TRPCClientInit ) => {
	const isBrowser = typeof window !== 'undefined'
	if ( isBrowser && browserClient ) return browserClient
	const client = createTRPCClient<Router>( { init } )
	if ( isBrowser ) browserClient = client
	return client
}
