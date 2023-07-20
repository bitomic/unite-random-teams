import { TwitchClient } from '$lib/server/TwitchClient'
import { redis } from '$lib/server/redis'
import { TRPCError } from '@trpc/server'
import { session } from '../middleware'
import { t } from '../t'

const p = t.procedure.use( session )

const loggedIn = p.query( async opts => {
	const key = TwitchClient.getKey( opts.ctx.userId )
	const exists = await redis.exists( key )
	if ( !exists ) throw new TRPCError( { code: 'UNAUTHORIZED' } )
	return true
} )

const me = p.query( async opts => {
	const client = await TwitchClient.fetch( opts.ctx.userId )
	const user = await client.get( 'users' ) as {
		data: [ {
			display_name: string
			login: string
			profile_image_url: string
		} ]
	}
	return user
} )

export const twitch = t.router( {
	loggedIn,
	me
} )
