import { TwitchClient } from '$lib/server/TwitchClient'
import { redis } from '$lib/server/redis'
import { TRPCError } from '@trpc/server'
import { session } from '../middleware'
import { t } from '../t'
import { s } from '@sapphire/shapeshift'

const p = t.procedure.use( session )

const announce = p
	.input( s.object( {
		color: s.string.optional,
		message: s.string
	} ) )
	.mutation( async opts => {
		const client = await TwitchClient.fetch( opts.ctx.userId )
		const user = await client.get( 'users' ) as {
			data: [ {
				id: string
			} ]
		}
		const userId = user.data[ 0 ].id
		await client.post( `chat/announcements?broadcaster_id=${ userId }&moderator_id=${ userId }`, {
			color: opts.input.color,
			message: opts.input.message
		} )
	} )

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
	announce,
	loggedIn,
	me
} )
