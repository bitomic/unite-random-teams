<script lang="ts">
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
    import PlayerList from '$lib/components/PlayerList.svelte';
    import type { PageData } from './$types';

    export let data: PageData
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
            <PlayerList user={ data.user } />
        </div>
        <div class="module module--buttons">
            <Button fullWidth={ true } click={ () => $matchroom.shufflePlayers() }> { $_.get( 'buttons.shuffle-players' ) } </Button>
            <Button fullWidth={ true } click={ () => $matchroom.shufflePokemon() }> { $_.get( 'buttons.shuffle-pokemon' ) } </Button>
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
    display: flex;
    flex-grow: 1;
    justify-content: center;
}
.column--right {
    --spacing: 3em;
    border-left: 2px solid #222;
    margin-left: var(--spacing);
    padding-left: var(--spacing);
}
.module {
    width: 300px;
}
.module:not(:first-child) {
    border-top: 1px solid #222;
    margin-top: 2em;
    padding-top: 2em;
}
.module--buttons {
    text-align: center;
}

@media ( max-width: 1300px ) {
    .columns {
        flex-direction: column;
        justify-content: center;
    }
    .column--right {
        align-items: flex-start;
        border-left: 0;
        border-top: 2px solid #222;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-left: 0;
        margin-top: 1em;
        padding-left: 0;
        padding-top: 2px;
    }
    .column--right .module {
        background-color: rgba( 42, 42, 42, 0.2 );
        border-radius: 5px;
        border-top: 0;
        flex-basis: 40%;
        margin-top: 1em;
        padding: 1em;
    }
}
@media ( max-width: 1015px ) {
    .column--right .module {
        flex-basis: 100%;
    }
}
@media ( max-width: 680px ) {
    .columns {
        margin: 0;
    }
}
</style>