<script lang="ts">
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import { Button } from '../ui/button';
	import Input from '../ui/input/input.svelte';

	let { items } = $props();
	let newItem = $state('');
</script>

<div class="mt-4 flex flex-row items-center justify-between gap-4">
	<Input
		type="text"
		id="name"
		bind:value={newItem}
		class="col-span-3"
		placeholder="New parameter..."
	/>
	<Button size="icon">
		<CirclePlus />
	</Button>
</div>

<div class="mt-4 flex flex-col gap-2 p-4">
	{#each items as item}
		<div class=" flex flex-row items-center justify-between gap-4 border-b pb-2">
			<p class="font-medium">{item}</p>
			<Button variant="ghost" size="icon">
				<Trash2 />
			</Button>
		</div>
	{/each}
</div>
