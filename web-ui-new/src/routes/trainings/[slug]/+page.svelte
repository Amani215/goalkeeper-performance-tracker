<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import AddGoalkeeperDialog from '$lib/components/training-utils/add-goalkeeper-dialog.svelte';
	import UpdateAttendanceDialog from '$lib/components/training-utils/update-attendance-dialog.svelte';
	import { Avatar } from 'bits-ui';
	import EditDialog from '$lib/components/training-utils/edit-dialog.svelte';

	let goalkeepers = [{ id: 1, name: 'John Doe', status: 'Absent', duration: 90 }];
</script>

<div class="mb-4 flex w-full justify-center md:justify-end">
	<EditDialog category="seniors2021_2022" trainingDate="2021-10-22T10:00:00Z" duration={90} />
</div>

<div class="mb-6 flex flex-col items-center gap-2">
	<p class="text-3xl font-bold text-center">Training Seniors 2021-2022</p>
	<p class="text-xl font-semibold text-center">22/10/2021</p>
	<p class="text-xl font-semibold text-center">90 min</p>

	<div class="mt-4 flex flex-row gap-2">
		<Button>Add Form</Button>
		<Button variant="outline">Download Form</Button>
	</div>

	<Card class="mt-6 w-full p-4">
		<div class="flex w-full justify-center md:justify-end">
			<AddGoalkeeperDialog />
		</div>

		{#if goalkeepers.length > 0}
			{#each goalkeepers as goalkeeper}
				<div class="flex flex-row items-center">
					<div class="flex w-full items-center gap-2">
						<a
							class="flex w-full items-center gap-2 rounded-sm p-2 hover:bg-gray-100"
							href={`/people/goalkeepers/${goalkeeper.id}`}
						>
							<Avatar.Root class="size-10">
								<Avatar.Image
									class="rounded-full"
									src={'https://avatars.githubusercontent.com/u/194400?v=4'}
									alt={goalkeeper.name}
								/>
								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>
							<div class="content-center">
								<p class="font-bold">{goalkeeper.name}</p>
								<p class="text-gray-500">{goalkeeper.status} - {goalkeeper.duration}</p>
							</div>
						</a>
					</div>
					<div class="ml-auto flex flex-row items-center gap-2">
						<UpdateAttendanceDialog attendance={goalkeeper.status} duration={goalkeeper.duration} />
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
