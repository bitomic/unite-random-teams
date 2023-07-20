import { Redis } from 'ioredis'
import { env } from './environment'

export const redis = new Redis( {
	db: env.REDIS_DB,
	host: env.REDIS_HOST,
	keyPrefix: 'unite:',
	password: env.REDIS_PASS,
	port: env.REDIS_PORT,
	username: env.REDIS_USER
} )
