<script lang="ts">
    import Wheel from './Wheel.svelte'

	export let button: HTMLButtonElement
	export let size: number
</script>

<div class="wheel-container">
	<Wheel size={ size } button={ button } />
</div>

<style>
.wheel-container {
	align-items: center;
	background-color: #313131;
	border-radius: 8px;
	display: flex;
	height: 600px;
	justify-content: center;
	overflow: hidden;
	padding: 1em;
	position: relative;
	width: 600px;
}
.wheel-container::after {
	border-bottom: 10px solid transparent;
	border-right: 10px solid #fff;
	border-top: 10px solid transparent;
	content: "";
	height: 0;
	width: 0;
}
</style>
