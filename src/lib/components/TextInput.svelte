<script lang="ts">
	export let keypress: ( ( e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement } ) => void ) | null = null
	export let name: string | null = null
	export let placeholder: string | null = null
	export let value: string | null = ''
</script>

<input
	type="text"
	name={ name }
	placeholder={ placeholder }
	on:keypress={ keypress }
	bind:value={ value }>

<style>
input {
	background-color: transparent;
	border: none;
	border-bottom: 2px solid #444;
	color: #fff;
	font-size: 1.25em;
	min-width: 275px;
	padding: 0.25em 0.45em;
	outline: 0;
	text-align: center;
}
input:focus {
	border-bottom-color: #f17f00;
}
</style>