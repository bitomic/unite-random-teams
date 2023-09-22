<script lang="ts">
	import { _ } from '../lib/client/stores/i18n'
    import Navigation from '../lib/components/Navigation.svelte'
    import type { LayoutData } from './$types'

	export let data: LayoutData
	$_.i18n = data.i18n
</script>

<Navigation user={ data.user } />
<slot />

<style>
@import 'normalize.css';
@import '/static/spritesheet.css';
</style>
