<script lang="ts">
	export let centered = false
</script>

<h3 class={ centered ? 'centered' : '' }> <slot /> </h3>

<style>
h3 {
	display: inline-block;
	position: relative;
}
h3::after {
	background-color: rgba(255, 106, 21, 0.6);
	bottom: 2px;
	content: "";
	height: 5px;
	left: 0;
	position: absolute;
	right: 0;
	z-index: -1;
}
h3.centered {
	display: block;
	margin: 0 auto;
	text-align: center;
	width: fit-content;
}
</style>
