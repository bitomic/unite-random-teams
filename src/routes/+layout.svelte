<script lang="ts">
	import { _ } from '../lib/client/stores/i18n'
    import Navigation from '../lib/components/Navigation.svelte'

	export let data: {
		i18n: Record<string, string>
	}
	$_.i18n = data.i18n
</script>

<Navigation />
<slot />

<style>
@import 'normalize.css';
</style>