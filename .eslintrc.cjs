module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [ '@bitomic/eslint-config' ],
	plugins: [ 'svelte3', '@typescript-eslint' ],
	ignorePatterns: [ '*.cjs', '*.js', '*.config.ts', 'dist/**/*' ],
	overrides: [ { files: [ '*.svelte' ], processor: 'svelte3/svelte3' } ],
	settings: {
		'svelte3/typescript': () => require( 'typescript' )
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
}
