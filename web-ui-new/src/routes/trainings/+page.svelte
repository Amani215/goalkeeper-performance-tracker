<script lang="ts">
	import { goto } from '$app/navigation';
	import AddDialog from '$lib/components/training-utils/add-dialog.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	const trainingSessions = [
		{
			date: '2023-01-01',
			category: 'Seniors 2021-2022',
			duration: 90
		},
		{
			date: '2023-01-02',
			category: 'Seniors 2021-2022',
			duration: 90
		},
		{
			date: '2023-01-03',
			category: 'Seniors 2021-2022',
			duration: 90
		}
	];
</script>

<div class="mb-4 flex w-full justify-end">
	<AddDialog />
</div>
<Table.Root>
	<Table.Caption>A list of your recent training sessions.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Date</Table.Head>
			<Table.Head>Category</Table.Head>
			<Table.Head>Duration</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each trainingSessions as session (session)}
			<Table.Row onclick={() => goto(`/trainings/1`)} class="hover:bg-muted/50 cursor-pointer">
				<Table.Cell class="font-medium">{session.date}</Table.Cell>
				<Table.Cell>{session.category}</Table.Cell>
				<Table.Cell>{session.duration}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
