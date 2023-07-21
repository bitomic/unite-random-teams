<script lang="ts">
    import { page } from "$app/stores";
    import { trpc } from "$lib/client/trpc";
    import { _ } from "../client/stores/i18n";
    import Button from "./Button.svelte";

	const t = trpc($page)
	export let user: Awaited<ReturnType<typeof t[ 'twitch' ][ 'me' ][ 'query' ]>>[ 'data' ][ 0 ] | null = null
</script>

<nav class="navigation">
	<a href="/" class="navigation__home">
		<img src="/logo-small.png" alt="logo" class="navigation__logo" width="80">
		<h1> { $_.get( 'navigation.title' ) } </h1>
	</a>
	<div class="navigation__filler"></div>
	<ul class="navigation__links">
		<li> <a href="/"> { $_.get( 'navigation.home' ) } </a> </li>
		<li> <a href="/privacy/{ $_.get( 'privacy.lang' ) }"> { $_.get( 'privacy.label' ) } </a> </li>
		<!-- svelte-ignore empty-block -->
		{ #if user }
			<li class="navigation__user">
				<img src={ user.profile_image_url } alt="avatar" width="24">
				<a href="https://twitch.tv/{ user.login }"> { user.display_name } </a>
			</li>
			<li> <Button href="/twitch/disconnect" style="purple"> { $_.get( 'navigation.disconnect' ) } </Button> </li>
		{ :else }
			<li> <Button href="/twitch" style="purple"> { $_.get( 'twitch.integrate' ) } </Button> </li>
		{ /if }
	</ul>
</nav>

<style>
.navigation,
.navigation__home {
	align-items: center;
	display: flex;
}
.navigation {
	border-bottom: 1px solid #222;
	padding: 0.5em 2em 0em;
}
a {
	color: inherit;
	text-decoration: none;
}
.navigation__filler {
	flex-grow: 1;
}
.navigation__links {
	align-items: center;
	column-gap: 2em;
	display: flex;
	list-style: none;
}
.navigation__links a {
	color: #f17f00;
	font-weight: bold;
	text-transform: uppercase;
}
.navigation__user {
	align-items: center;
	column-gap: 0.5em;
	display: flex;
}
.navigation__user img {
	border-radius: 100%;
}
</style>