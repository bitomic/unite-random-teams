import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig( {
	// @ts-expect-error - typing mismatch for plugin
	plugins: [ sveltekit() ],
	resolve: {
		alias: {
			inspect: 'rollup-plugin-node-polyfills/polyfills/util'
		}
	},
	test: {
		include: [ 'src/**/*.{test,spec}.{js,ts}' ]
	}
} )
