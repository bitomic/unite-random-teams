import { createContext, router } from '$lib/server'
import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'

export const handle: Handle = createTRPCHandle( { createContext, router } )
