<script>
    import { page } from "$app/stores";
    import { trpc } from "$lib/client/trpc";
    import { _ } from "../client/stores/i18n";
    import Button from "./Button.svelte";

	const t = trpc($page)
	const isLoggedIn = t.twitch.loggedIn.query()
	const user = t.twitch.me.query()
</script>
<nav class="navigation">
	<a href="/" class="navigation__home">
		<img src="/logo-small.png" alt="logo" class="navigation__logo" width="80">
		<h1> { $_.get( 'navigation.title' ) } </h1>
	</a>
	<div class="navigation__filler"></div>
	<ul class="navigation__links">
		<li> <a href="/"> Home </a> </li>
		<!-- svelte-ignore empty-block -->
		{ #await user }
		{ :then user }
			<li class="navigation__user">
				<img src={ user.data[0].profile_image_url } alt="avatar" width="24">
				<a href="https://twitch.tv/{ user.data[0].login }"> { user.data[0].display_name } </a>
			</li>
		{ :catch _e }
		{ /await}
		{ #await isLoggedIn }
			<li> <Button style="purple"> Loading... </Button> </li>
		{ :then _isLoggedIn }
			<li> <Button href="/twitch/disconnect" style="purple"> Disconnect </Button> </li>
		{ :catch _e }
			<li> <Button href="/twitch" style="purple"> Integrate with Twitch </Button> </li>
		{ /await }
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