<script lang="ts">
	import type { Player } from '$lib/server/sql/dbTypes';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Command from '$lib/components/ui/command';
	import { goto } from '$app/navigation';
	//pasting now
	// import { searchPlayer } from '$lib/logic/playerSearch';

	export let data: PageData;

	let popoverOpen = false;

	// let tableHeaders: string[] = ['Players', 'Artist', 'Album', 'Genre'];
	let timer: NodeJS.Timeout;
	let searchTerm = '';
	// let debounceTimeout: NodeJS.Timeout;
	let players: Player[] = data.players;

	async function searchPlayer() {
		const response = await fetch(`/api/search-player?searchTerm=${searchTerm}`);
		if (response.ok) {
			const data = await response.json();
			if (data.players) {
				players = data.players;
			}
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

	async function handleNavigation(event: Event, nameId: number, playerName: string) {
		event.preventDefault();
		await goto(`/player/${nameId}/${playerName.replace(/ /g, '-').toLowerCase()}`);
	}

	function handleKeydown(event: KeyboardEvent, nameId: number, playerName: string) {
		// console.log('Keydown event:', event.key);
		if (event.key === 'Enter' || event.key === ' ') {
			handleNavigation(event, nameId, playerName);
		}
	}
</script>

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

<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
	<div class="overflow-x-auto">
		<table class="table-auto min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
					>
						Players
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
					>
						Pay (MM)
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each players as { playerName, totalPay, nameId }}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap text-left">
							<a
								href={`/player/${playerName.replace(/ /g, '-').toLowerCase()}`}
								class="text-sm font-medium text-blue-600 hover:underline"
								on:click={(event) => handleNavigation(event, nameId, playerName)}
							>
								{playerName}
							</a>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-left">
							${((totalPay || 0) / 1000000).toLocaleString('en-US')}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="2" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
							No players found
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Button on:click={() => (popoverOpen = true)}>Select Player</Button>

<Command.Dialog bind:open={popoverOpen}>
	<Input
		type="search"
		class="input mb-5 search-bar"
		placeholder="Type a command or search..."
		value={searchTerm}
		on:keyup={handleInput}
	/>
	<Command.List role="listbox">
		<Command.Empty>No results found.</Command.Empty>
		{#each players as { playerName, nameId }}
			{#if playerName}
				<Command.Item role="option" value={playerName}>
					<span>
						<a
							href={`/player/${nameId}/${playerName.replace(/ /g, '-').toLowerCase()}`}
							tabindex="0"
							class="text-sm font-medium text-blue-600 hover:underline"
							on:click={(event) => handleNavigation(event, nameId, playerName)}
							on:keydown={(event) => handleKeydown(event, nameId, playerName)}
						>
							{playerName}
						</a>
					</span>
				</Command.Item>
			{/if}
		{/each}
	</Command.List>
</Command.Dialog>
