<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let coaches = [
		{ id: 1, name: 'Coach A' },
		{ id: 2, name: 'Coach B' }
	];
	let goalkeepers: any[] = [
		{ id: 1, name: 'Goalkeeper X' },
		{ id: 2, name: 'Goalkeeper Y' }
	];
</script>

<div class="mb-6 flex flex-col items-center">
	<h1 class="text-2xl font-bold">Seniors 2021-2022</h1>
</div>

<div class="flex w-full justify-end">
	<Button variant="outline">Download Documents</Button>
</div>

<div class=" mt-4 flex w-full flex-row justify-center gap-4">
	<Card class="w-full gap-1 p-4">
		<div class="mb-2 flex w-full justify-end">
			<Button variant="ghost">Add Coach</Button>
		</div>

		{#if coaches.length > 0}
			{#each coaches as coach}
				<div class="flex items-center">
					<a
						class="flex w-full items-center gap-2 rounded-sm p-2 hover:bg-gray-100"
						href={`/profile/${coach.id}`}
					>
						<Avatar.Root class="size-10">
							<Avatar.Image src={undefined} alt={coach.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<p class="text-sm">{coach.name}</p>
					</a>
					<Button size="icon" variant="ghost" class="ml-auto"><Trash2 /></Button>
				</div>
			{/each}
		{:else}
			<p class="mt-2 text-center text-sm">No coaches added yet...</p>
		{/if}
	</Card>
	<Card class="w-full gap-1 p-4">
		<div class="mb-2 flex w-full justify-end">
			<Button variant="ghost">Add Goalkeeper</Button>
		</div>

		{#if goalkeepers.length > 0}
			{#each goalkeepers as goalkeeper}
				<div class="flex items-center gap-2">
					<a
						class="flex w-full items-center gap-2 rounded-sm p-2 hover:bg-gray-100"
						href={`/people/goalkeepers/${goalkeeper.id}`}
					>
						<Avatar.Root class="size-10">
							<Avatar.Image src={undefined} alt={goalkeeper.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<p class="text-sm">{goalkeeper.name}</p>
					</a>
					<Button size="icon" variant="ghost" class="ml-auto"><Trash2 /></Button>
				</div>
			{/each}
		{:else}
			<p class="mt-2 text-center text-sm">No goalkeepers added yet...</p>
		{/if}
	</Card>
</div>
