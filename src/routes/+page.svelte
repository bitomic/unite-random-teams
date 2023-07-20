<script>
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Matchroom from '$lib/components/Matchroom.svelte'
    import PreloadImages from '$lib/components/PreloadImages.svelte';
    import TextInput from '$lib/components/TextInput.svelte';
    import TwitchIntegrator from '$lib/components/TwitchIntegrator.svelte';
    import { _ } from '$lib/client/stores/i18n';
    import Button from '$lib/components/Button.svelte';
    import { matchroom } from '$lib/client/stores/matchroom';
    import { GlobalUniquePokemonStrategy } from '$lib/client/strategies/GlobalUniquePokemon';
    import { AllRolesStrategy } from '$lib/client/strategies/AllRolesStrategy';

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
            <Button click={ () => $matchroom.shufflePlayers() }> Shuffle players </Button>
            <Button click={ () => $matchroom.shufflePokemon() }> Shuffle Pokémon </Button>
        </div>
        <div class="module">
            <h3> { $_.get( 'strategies.header' ) } </h3>
            <div class="checkboxes">
                <Checkbox strategy={ new GlobalUniquePokemonStrategy() }> { $_.get( 'strategies.global-unique-pokemon' ) } </Checkbox>
                <Checkbox strategy={ new AllRolesStrategy() }> { $_.get( 'strategies.all-roles' ) } </Checkbox>
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