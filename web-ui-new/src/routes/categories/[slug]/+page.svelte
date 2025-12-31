<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let coaches = [{ name: 'Coach A' }, { name: 'Coach B' }];
	let goalkeepers: any[] = [];
</script>

<div class="mb-6 flex flex-col items-center">
	<h1 class="text-2xl font-bold">Seniors 2021-2022</h1>
</div>

<div class="flex w-full justify-end">
	<Button variant="outline">Download Documents</Button>
</div>

<div class=" mt-4 flex w-full flex-row justify-center gap-4">
	<Card class="w-full  p-4">
		<div class="flex w-full justify-end">
			<Button variant="ghost">Add Coach</Button>
		</div>

		{#if coaches.length > 0}
			{#each coaches as coach}
				<div class="flex items-center gap-2">
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={undefined} alt={coach.name} />
						<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
					</Avatar.Root>
					<p class="text-sm">{coach.name}</p>

					<Button size="icon" variant="ghost" class="ml-auto"><Trash2 /></Button>
				</div>
			{/each}
		{:else}
			<p class="mt-2 text-center text-sm">No coaches added yet...</p>
		{/if}
	</Card>
	<Card class="w-full p-4">
		<div class="flex w-full justify-end">
			<Button variant="ghost">Add Goalkeeper</Button>
		</div>

		{#if goalkeepers.length > 0}
			{#each goalkeepers as goalkeeper}
				<div class="flex items-center gap-2">
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={undefined} alt={goalkeeper.name} />
						<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
					</Avatar.Root>
					<p class="text-sm">{goalkeeper.name}</p>

					<Button size="icon" variant="ghost" class="ml-auto"><Trash2 /></Button>
				</div>
			{/each}
		{:else}
			<p class="mt-2 text-center text-sm">No goalkeepers added yet...</p>
		{/if}
	</Card>
</div>
