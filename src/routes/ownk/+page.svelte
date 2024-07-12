<!-- with Select.svelte** <script>
 
	import Select from '$lib/components/Select.svelte';
</script>

<div class="pt-8">
	<Select />
</div> -->

<script lang="ts">
	import { COUNTRIES } from './countries';
	import Graph from '$lib/components/Graph.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';

	let country = '';

	$: COUNTRIES.map((d) => d.name).includes(country);

	export let form;

	import { enhance } from '$app/forms';

	let w = 0;
	let h = 0;

	let disabled = true;

	const handleChange = (e: any) => {
		if (!COUNTRIES.map((d) => d.name).includes(e.detail)) return (disabled = true);

		disabled = false;
	};
</script>

<div class="w-[100%] m-auto max-w-[720px]">
	<h1 class="text-skin-heading">GDP per capita tracker</h1>
	<form
		class="grid grid-cols-[1fr_auto] gap-[10px] pt-5 pb-5"
		method="POST"
		use:enhance
		autocomplete="off"
	>
		<Dropdown
			placeholder="United Kingdom"
			label="Select a country"
			data={COUNTRIES.map((d) => d.name)}
			on:select={handleChange}
		/>
		<button
			{disabled}
			class="flex self-end items-center bg-skin-foreground text-skin-paragraph hover:shadow-l shadow font-bold px-4 text-xl h-[50px] rounded"
			type="submit"
		>
			<div>&#x2192;</div>
		</button>
	</form>
</div>

<div class="flex place-content-center bg-skin-foreground p-5 min-h-[400px]">
	{#if form?.error_message}
		<div class="flex w-full place-items-center justify-center text-skin-paragraph text-s">
			<p>We were unable to fetch the requested data. Please try again later</p>
		</div>
	{/if}

	{#if form?.data}
		<div class="w-full max-w-[720px]">
			<h2 class="text-skin-heading">GDP per capita (current US$), {form.data[0].country}</h2>
			<div class="h-[400px]" bind:clientWidth={w} bind:clientHeight={h}>
				{#if w > 0}
					<Graph data={form.data} x="date" y="value" width={w} height={h} />
				{/if}
			</div>
			<span class="text-skin-paragraph text-xs"
				>Source: <a href="https://worldbank.org">World Bank</a></span
			>
		</div>
	{/if}
</div>
