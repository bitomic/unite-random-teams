<div class="checkbox">
	<input type="checkbox">
	<label for=""> <slot /> </label>
</div>

<style>
.checkbox {
	align-items: center;
	column-gap: 0.85em;
	display: flex;
	margin: 0.75em 0;
}
input {
	height: 25px;
	width: 25px;
}
</style>