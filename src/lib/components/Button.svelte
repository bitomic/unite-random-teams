<script lang="ts">
	export let click: ( () => void ) | null = null
	export let href: string | null = null
	export let icon = true
	export let style: 'default' | 'purple' = 'default'

	const tag = href ? 'a' : 'div'
	const iconClass = icon ? 'btn--icon' : ''
</script>

<svelte:element
	this={ tag }
	href={ href }
	class="btn btn--{ style } { iconClass }"
	role="button"
	tabindex="0"
	on:click={ click }>
	<slot />
</svelte:element>

<style>
.btn--default {
	--color: #ff6a15;
	--hover: #e25e11;
}
.btn--purple {
	--color: #7f56f9;
	--hover: #723eee;
}
.btn {
	background-color: var(--color);
	border: 3px solid #000;
	border-radius: 18px;
	color: inherit;
	cursor: pointer;
	display: inline-block;
	font-size: 1.25em;
	min-width: 80px;
	overflow: hidden;
	padding: 0.5em 1em;
	position: relative;
	text-align: center;
	text-decoration: none;
	transition: all 0.4s;
}
.btn:hover {
	background-color: var(--hover);
	box-shadow: 0 0 7px var(--color);
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