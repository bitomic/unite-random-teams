import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import rollupNodePolyfill from 'rollup-plugin-node-polyfills'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig( {
	build: {
		rollupOptions: {
			// @ts-expect-error - typing mismatch for plugin
			plugins: [ rollupNodePolyfill() ]
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// @ts-expect-error - typing mismatch for plugin
			plugins: [ NodeModulesPolyfillPlugin() ]
		}
	},
	// @ts-expect-error - typing mismatch for plugin
	plugins: [ sveltekit() ],
	resolve: {
		alias: {
			buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
			util: 'rollup-plugin-node-polyfills/polyfills/util'
		}
	},
	test: {
		include: [ 'src/**/*.{test,spec}.{js,ts}' ]
	}
} )
