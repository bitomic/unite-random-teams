<script>
    import Matchroom from '$lib/components/Matchroom.svelte'
    import TextInput from '$lib/components/TextInput.svelte';
    import TwitchIntegrator from '$lib/components/TwitchIntegrator.svelte';
    import { _ } from '$lib/stores/i18n';

</script>

<div class="columns">
    <div class="column column--left">
        <Matchroom />
    </div>
    <div class="column column--right">
        <TwitchIntegrator />
    </div>
</div>

<style>
.columns {
    display: flex;
    margin: 1em 4em;
}
.column--left {
    flex-grow: 1;
}
.column--right {
    --spacing: 3em;
    border-left: 2px solid #222;
    margin-left: var(--spacing);
    padding-left: var(--spacing);
}
</style>