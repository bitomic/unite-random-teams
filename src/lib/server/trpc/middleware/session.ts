import { t } from '../t'
import { TRPCError } from '@trpc/server'

export const session = t.middleware( ( { next, ctx } ) => {
	if ( !ctx.userId ) throw new TRPCError( { code: 'UNAUTHORIZED' } )
	return next( {
		ctx: {
			userId: ctx.userId
		}
	} )
} )
