<script lang="ts">
	import { onMount } from 'svelte';
	import type { Player } from '$lib/server/sql/dbTypes';
	import type { PageData } from './$types';
	import { writable, get } from 'svelte/store'; // Import writable and get from svelte/store
	import SearchInput from '$lib/components/SearchInput.svelte';
	import PlayerTable from '$lib/components/PlayerTable.svelte';
	import PlayerCommandDialog from '$lib/components/PlayerCommandDialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { searchPlayer, handleNavigation, handleKeydown } from '$lib/logic/playerLogic';

	export let data: PageData;

	let popoverOpen = false;
	let timer: NodeJS.Timeout;
	let searchTerm = writable<string>(''); // Explicitly type searchTerm
	let players = writable<Player[]>(data.players); // Explicitly type players

	async function performSearch() {
		const term = get(searchTerm); // Use get to access the value of searchTerm
		players.set(await searchPlayer(term));
	}

	function handleInput(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm.set(target.value);
			performSearch();
		}, 300);
	}

	$: if (get(searchTerm).length < 3) {
		// Use get to access the value of searchTerm
		players.set(data.players);
	}

	onMount(() => {
		performSearch();
	});
</script>

<h1 class="text-3xl font-bold underline text-center mb-10">Hello World!</h1>
<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
	<SearchInput bind:searchTerm {handleInput} />
</div>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
	<PlayerTable {players} {handleNavigation} />
</div>

<Button on:click={() => (popoverOpen = true)}>Select Player</Button>

<PlayerCommandDialog
	bind:open={popoverOpen}
	bind:searchTerm
	bind:players
	{handleInput}
	{handleNavigation}
	{handleKeydown}
/>
