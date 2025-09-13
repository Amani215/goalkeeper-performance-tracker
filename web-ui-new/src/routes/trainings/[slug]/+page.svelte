<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let goalkeepers = [{ name: 'John Doe', status: 'Present', duration: 90 }];
</script>

<div class="mb-6 flex flex-col items-center gap-2">
	<p class="text-3xl font-bold">Training Senior 2021-2022</p>
	<p class="text-xl font-semibold">22/10/2021</p>
	<p class="text-xl font-semibold">90 min</p>

	<div class="mt-4 flex flex-row gap-2">
		<Button>Add Form</Button>
		<Button variant="outline">Download Form</Button>
	</div>

	<Card class="mt-6 w-full p-4">
		<div class="flex w-full justify-end">
			<Button>Add Goalkeeper</Button>
		</div>

		{#if goalkeepers.length > 0}
			{#each goalkeepers as goalkeeper}
				<div class="flex flex-row justify-between">
					<div class="grid grid-cols-2">
						<img
							class="h-10 w-10 place-self-center rounded-full"
							src="https://avatars.githubusercontent.com/u/194400?v=4"
							alt="Avatar"
						/>
						<div class="content-center">
							<p class="font-bold">{goalkeeper.name}</p>
							<p class="text-gray-500">{goalkeeper.status} - {goalkeeper.duration}</p>
						</div>
					</div>
					<div class="content-end">
						<Button size="icon" variant="ghost"><PenLine /></Button>
						<Button size="icon" variant="ghost"><Trash2 /></Button>
					</div>
				</div>
				<Separator class="-mt-4" />
			{/each}
		{:else}
			<p class="mt-2 text-center text-sm">No players added yet...</p>
		{/if}
	</Card>
</div>
