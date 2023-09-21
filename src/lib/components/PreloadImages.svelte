<script lang="ts">
	import pokemon from '../../pokemon.json'
</script>

<div class="preload">
	{ #each Object.entries( pokemon ) as [ name, { holowear } ] }
		{ #each { length: holowear } as _, i }
			<img src="/tachie/{ name } { i }.webp" alt={ name }>
		{/each}
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
