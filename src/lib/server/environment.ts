import { load } from 'ts-dotenv'

export const env = load( {
	REDIS_DB: Number,
	REDIS_HOST: String,
	REDIS_PASS: {
		default: '',
		type: String
	},
	REDIS_PORT: {
		default: 6379,
		type: Number
	},
	REDIS_USER: {
		default: '',
		type: String
	},
	TWITCH_CLIENT_ID: String,
	TWITCH_CLIENT_SECRET: String,
	TWITCH_REDIRECT_URI: String
} )
