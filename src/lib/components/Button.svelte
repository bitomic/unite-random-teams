<script lang="ts">
	export let href: string | null = null
	export let icon = true

	const tag = href ? 'a' : 'div'
	const iconClass = icon ? 'btn--icon' : ''
</script>

<svelte:element this={ tag } href={ href } class="btn { iconClass }">
	<slot />
</svelte:element>

<style>
.btn {
	background-color: #ff6a15;
	border: 3px solid #000;
	border-radius: 18px;
	display: inline-block;
	font-size: 1.25em;
	min-width: 80px;
	overflow: hidden;
	padding: 0.5em 1em;
	position: relative;
	text-align: center;
	transition: all 0.4s;
}
.btn:hover {
	background-color: #e25e11;
	box-shadow: 0 0 7px #ff6a15;
}
.btn--icon::after {
	background-image: url("/pokeball.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
	bottom: 0;
	content: "";
	height: 40px;
	opacity: 0.25;
	position: absolute;
	rotate: -45deg;
	right: -10px;
	width: 40px;
}
</style>