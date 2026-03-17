<script lang="ts">
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';

	let matchPerformances = [
		{
			id: 'Friendly CA-CA',
			date: new Date('2026-03-01'),
			category: 'Seniors2025-2026',
			performanceSheet: 'https://google.com'
		}
	];
</script>

<div class="mt-4 mb-2 flex flex-row">
	<h2 class="text-xl font-semibold">Match Performances</h2>
</div>

{#if matchPerformances.length == 0}
	<p class="text-center">No match records are available...</p>
{:else}
	<div class="rounded-md border">
		<Table>
			<TableHeader class="bg-gray-100">
				<TableRow>
					<TableHead>Match</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Category</TableHead>
					<TableHead>Performance Sheet</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each matchPerformances as match}
					<TableRow>
						<TableCell>{match.id}</TableCell>
						<TableCell>2026-01-01</TableCell>
						<TableCell>{match.category}</TableCell>
						<TableCell><a href={`/matches/${match.id}`} class="underline">Link</a></TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
