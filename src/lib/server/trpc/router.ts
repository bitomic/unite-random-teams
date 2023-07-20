import { t } from './t'
import { twitch } from './routes'

export const router = t.router( {
	twitch
} )

export type Router = typeof router
