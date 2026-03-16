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

<div class="mt-4 flex flex-row">
	<h2 class="text-xl font-semibold">Training Attendance</h2>
</div>
{#if trainingRecords.length == 0}
	<p class="text-center">No Training records are available...</p>
{:else}
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Date</TableHead>
				<TableHead>Training</TableHead>
				<TableHead>Attendance</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each trainingRecords as training}
				<TableRow>
					<TableCell>{training.date}</TableCell>
					<TableCell>2026-01-01</TableCell>
					<TableCell>{training.attendance}</TableCell>
					<TableCell>2 cm</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
{/if}
