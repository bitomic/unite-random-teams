<script>
    import Checkbox from '$lib/components/Checkbox.svelte';
import Matchroom from '$lib/components/Matchroom.svelte'
    import PreloadImages from '$lib/components/PreloadImages.svelte';
    import TextInput from '$lib/components/TextInput.svelte';
    import TwitchIntegrator from '$lib/components/TwitchIntegrator.svelte';
    import { _ } from '$lib/client/stores/i18n';

</script>

<PreloadImages />

<div class="columns">
    <div class="column column--left">
        <Matchroom />
    </div>
    <div class="column column--right">
        <div class="module">
            <TwitchIntegrator />
        </div>
        <div class="module">
            <h3> { $_.get( 'rules.header' ) } </h3>
            <div class="checkboxes">
                <Checkbox> A </Checkbox>
                <Checkbox> A </Checkbox>
                <Checkbox> A </Checkbox>
            </div>
        </div>
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
.module:not(:first-child) {
    border-top: 1px solid #222;
    margin-top: 2em;
    padding-top: 2em;
}
</style>