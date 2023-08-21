<div class="container">
	<slot />
</div>

<style>
.container {
	margin: 1em auto;
	width: 80%;
}
:global(a) {
    color: #f17f00;
    font-weight: bold;
}
:global(.container p, .container li) {
	font-size: 1.15em;
	line-height: 1.5;
}
</style>
