<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import AddGrowthDialog from './add-growth-dialog.svelte';
	import UpdateGrowthDialog from './update-growth-dialog.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	let growthRecords = [
		{
			date: new Date('2026-01-01'),
			height: 170,
			weight: 80,
			torsoHeight: 45,
			thoracicPerimeter: 38
		},
		{
			date: new Date('2026-02-01'),
			height: 170,
			weight: 81,
			torsoHeight: 45,
			thoracicPerimeter: 38
		}
	];
</script>

<div class="mt-8 mb-2 flex flex-row justify-between">
	<h2 class="text-xl font-semibold">Growth</h2>
	<AddGrowthDialog />
</div>
<div class="rounded-md border">
	<Table>
		<TableHeader class="bg-gray-100">
			<TableRow>
				<TableHead>Date</TableHead>
				<TableHead>Height</TableHead>
				<TableHead>Weight</TableHead>
				<TableHead>Torso Height</TableHead>
				<TableHead>Thoracic Perimeter</TableHead>
				<TableHead>Annual Growth</TableHead>
				<TableHead class="text-center">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each growthRecords as growth}
				<TableRow>
					<TableCell>2026-01-01</TableCell>
					<TableCell>{growth.height} cm</TableCell>
					<TableCell>{growth.weight} kg</TableCell>
					<TableCell>{growth.torsoHeight} cm</TableCell>
					<TableCell>{growth.thoracicPerimeter} cm</TableCell>
					<TableCell>2 cm</TableCell>
					<TableCell>
						<div class="flex justify-center gap-2">
							<UpdateGrowthDialog
								date={growth.date}
								height={growth.height}
								weight={growth.weight}
								torsoHeight={growth.torsoHeight}
								thoracicPerimeter={growth.thoracicPerimeter}
							/>

							<AlertDialog.Root>
								<AlertDialog.Trigger class="w-10 {buttonVariants({ variant: 'ghost' })}">
									<Button variant="ghost" size="icon" aria-label="Submit">
										<Trash2 />
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete the record.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action>Continue</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
