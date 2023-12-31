import { TwitchClient } from '$lib/server/TwitchClient'
import { redis } from '$lib/server/redis'
import { TRPCError } from '@trpc/server'
import { session } from '../middleware'
import { t } from '../t'
import { s } from '@sapphire/shapeshift'
import { TmiClient } from '$lib/server/tmi'

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

const createPrediction = p
	.input( s.object( {
		outcomes: s.string.lengthLessThanOrEqual( 25 ).array,
		time: s.number.greaterThanOrEqual( 30 ).lessThanOrEqual( 1800 ),
		title: s.string.lengthLessThanOrEqual( 45 )
	} ) )
	.mutation( async opts => {
		const client = await TwitchClient.fetch( opts.ctx.userId )
		const user = await client.get( 'users' ) as {
			data: [ {
				id: string
			} ]
		}
		const userId = user.data[ 0 ].id
		const req = await client.post( 'predictions', {
			broadcaster_id: userId,
			outcomes: opts.input.outcomes.map( title => ( { title } ) ),
			prediction_window: opts.input.time,
			title: opts.input.title
		} )
		const prediction = await req.json() as {
			data: [ {
				broadcaster_id: string
				id: string
				outcomes: Array<{
					id: string
					title: string
				}>
			} ]
		}
		return prediction
	} )

const endPrediction = p
	.input( s.object( {
		broadcasterId: s.string,
		id: s.string,
		winner: s.string
	} ) )
	.mutation( async opts => {
		const client = await TwitchClient.fetch( opts.ctx.userId )
		await client.post( 'predictions', {
			broadcaster_id: opts.input.broadcasterId,
			id: opts.input.id,
			status: 'RESOLVED',
			winning_outcome_id: opts.input.winner
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
	try {
		const user = await client.get( 'users' ) as {
			data: [ {
				display_name: string
				login: string
				profile_image_url: string
			} ]
		}
		return user
	} catch {
		await TwitchClient.remove( opts.ctx.userId )
		throw new TRPCError( {
			code: 'UNAUTHORIZED'
		} )
	}
} )

const say = p
	.input( s.object( {
		message: s.string
	} ) )
	.mutation( async opts => {
		const client = await TwitchClient.fetch( opts.ctx.userId )
		const user = await client.get( 'users' ) as {
			data: [ {
				login: string
			} ]
		}
		const username = user.data[ 0 ].login

		const tmi = await TmiClient.getClient()
		await tmi.say( username, opts.input.message )
			.catch( () => null )
	} )

export const twitch = t.router( {
	announce,
	createPrediction,
	endPrediction,
	loggedIn,
	me,
	say
} )
