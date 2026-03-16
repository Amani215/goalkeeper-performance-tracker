<script lang="ts">
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';

	let trainingRecords = [
		{ id: 'Seniors 2025-2026 Training', date: '2026-01-02', attendance: 'Present' }
	];
</script>

<div class="mt-4 mb-2 flex flex-row">
	<h2 class="text-xl font-semibold">Training Attendance</h2>
</div>
{#if trainingRecords.length == 0}
	<p class="text-center">No Training records are available...</p>
{:else}
	<div class="rounded-md border">
		<Table>
			<TableHeader class="bg-gray-100">
				<TableRow>
					<TableHead>Training</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Attendance</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each trainingRecords as training}
					<TableRow>
						<TableCell>{training.id}</TableCell>
						<TableCell>2026-01-01</TableCell>
						<TableCell>{training.attendance}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
