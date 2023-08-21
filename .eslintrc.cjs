module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [ '@bitomic/eslint-config' ],
	plugins: [ 'svelte', '@typescript-eslint' ],
	ignorePatterns: [ '*.cjs', '*.js', '*.config.ts', 'dist/**/*' ],
	overrides: [ {
		files: [ '**/*.svelte' ],
		parser: 'svelte-eslint-parser',
		parserOptions: {
			parser: '@typescript-eslint/parser'
		}
	} ],
	settings: {
		'svelte3/typescript': () => require( 'typescript' )
	},
	parserOptions: {
		extraFileExtensions: [ '.svelte' ],
		project: 'tsconfig.json',
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'no-self-assign': 'off'
	}
}
