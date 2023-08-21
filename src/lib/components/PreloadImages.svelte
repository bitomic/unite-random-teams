<script lang="ts">
	import pokemon from '../../pokemon.json'
</script>

<div class="preload">
	{ #each Object.keys( pokemon ) as name }
		<img src="/roster/{ name }.png" alt={ name }>
	{ /each }
</div>

<style>
.preload {
	position: relative;
}
img {
	left: 0;
	opacity: 0;
	pointer-events: none;
	position: absolute;
	top: 0;
}
</style>
