<script lang="ts">
	import AddDialog from '$lib/components/match-utils/add-dialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	const matches = [
		{
			date: '2023-01-01',
			category: 'Seniors 2021-2022',
			localTeam: 'EST',
			visitorTeam: 'CA',
			type: 'Tournament'
		},
		{
			date: '2023-01-02',
			category: 'Seniors 2021-2022',
			localTeam: 'CA',
			visitorTeam: 'EST',
			type: 'Friendly'
		},
		{
			date: '2023-01-03',
			category: 'Seniors 2021-2022',
			localTeam: 'ASM',
			visitorTeam: 'EST',
			type: 'Friendly'
		}
	];
</script>

<div class="p-8">
	<div class="mb-4 flex w-full justify-end">
		<AddDialog />
	</div>
	<Table.Root>
		<Table.Caption>A list of your recent matches.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Date</Table.Head>
				<Table.Head>Category</Table.Head>
				<Table.Head>Local Team</Table.Head>
				<Table.Head>Visitor Team</Table.Head>
				<Table.Head class="text-right">Type</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each matches as match (match)}
				<Table.Row>
					<Table.Cell class="font-medium">{match.date}</Table.Cell>
					<Table.Cell>{match.category}</Table.Cell>
					<Table.Cell>{match.localTeam}</Table.Cell>
					<Table.Cell>{match.visitorTeam}</Table.Cell>
					<Table.Cell class="text-right">{match.type}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
