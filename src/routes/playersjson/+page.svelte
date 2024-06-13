<script lang="ts">
	export let data: { summaries: Array<{ slug: string; title: string; totalPay: number }> };
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Command from '$lib/components/ui/command';

	let timer: NodeJS.Timeout;
	let searchTerm = '';
	let players = data.summaries;
	let open = false;

	async function searchPlayer() {
		const searchTermEscaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const response = await fetch(`/api/search-player?searchTerm=${searchTermEscaped}`);
		if (response.ok) {
			const result = await response.json();
			if (result.summaries) {
				players = result.summaries;
			} else {
				players = [];
			}
		} else {
			players = [];
		}
	}

	function handleInput(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm = target.value;
			searchPlayer();
		}, 300);
	}
</script>

<p>I am here src\routes\playersjson\+page.svelte</p>

<h1 class="text-3xl font-bold underline text-center mb-10">Hello World!</h1>
<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
	<div class="overflow-x-auto">
		<Input
			type="search"
			class="input mb-5 search-bar"
			placeholder="Type a command or search..."
			value={searchTerm}
			on:keyup={handleInput}
		/>
	</div>
</div>

<table class="container">
	<thead>
		<tr>
			<th>Player Name</th>
			<th>Total Pay</th>
		</tr>
	</thead>
	<tbody>
		{#each data.summaries as { slug, title, totalPay }}
			<tr>
				<td><a href={`/playersjson/${slug}`}>{title}</a></td>
				<td>${(totalPay / 1000000).toLocaleString('en-US')}M</td>
			</tr>
		{/each}
	</tbody>
</table>
<!-- Table Not working yet -->

<Button on:click={() => (open = true)}>Select Player</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each data.summaries as { title }}
			{#if title}
				<Command.Item>
					<span>{title}</span>
					<!-- Access the name property here -->
				</Command.Item>
			{/if}
		{/each}
	</Command.List>
</Command.Dialog>
