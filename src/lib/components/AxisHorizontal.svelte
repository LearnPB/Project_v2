<script>
	export let scale
	export let numTicks = 8
	export let top = 0

	let ticks = []
	$: ticks = scale.ticks(numTicks)
</script>

<g class="axis x-axis">
	<line x1={0} x2={scale.range()[1]} y1={top} y2={top} />
	{#each ticks as tick}
		<g class="tick tick-{tick}" transform="translate({scale(tick)}, {top})">
			<line y2={6} />
			<text text-anchor="middle" y={20}>{tick}</text>
		</g>
	{/each}
</g>
