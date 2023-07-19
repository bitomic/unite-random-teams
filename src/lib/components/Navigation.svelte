<script>
    import { _ } from "../stores/i18n";
    import Button from "./Button.svelte";

</script>
<nav class="navigation">
	<a href="/" class="navigation__home">
		<img src="logo-small.png" alt="logo" class="navigation__logo" width="80">
		<h1> { $_.get( 'navigation.title' ) } </h1>
	</a>
	<div class="navigation__filler"></div>
	<ul class="navigation__links">
		<li> <a href="/"> Home </a> </li>
		<li> <a href="/"> Home </a> </li>
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
	column-gap: 2em;
	display: flex;
	list-style: none;
}
.navigation__links a {
	color: #f17f00;
	font-weight: bold;
	text-transform: uppercase;
}
</style>