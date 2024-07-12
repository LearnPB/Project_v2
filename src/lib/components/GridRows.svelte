<script>
	export let scale;
	export let numTicks = 8;
	export let left = 0;
	export let width = 0;

	let ticks = [];
	$: ticks = scale.ticks(numTicks);
</script>

<g class="gridrows">
	{#each ticks as tick}
		<g transform="translate({left}, {scale(tick)})">
			<line x1={0} x2={width} />
		</g>
	{/each}
</g>
