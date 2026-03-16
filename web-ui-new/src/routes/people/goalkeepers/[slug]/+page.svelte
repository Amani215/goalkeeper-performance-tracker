<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import profilePic from '$lib/assets/placeholder.png';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';
	import Trash from '@lucide/svelte/icons/trash';
	import EditGoalkeeperDialog from '$lib/components/people-utils/edit-goalkeeper-dialog.svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import UpdateGrowthDialog from '$lib/components/people-utils/goalkeepers/update-growth-dialog.svelte';
	import AddGrowthDialog from '$lib/components/people-utils/goalkeepers/add-growth-dialog.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let goalkeeper = {
		id: '1',
		name: 'John Doe',
		birthday: new Date('1996-01-01'),
		phone: '(123) 456-7890'
	};

	let associatedCategories: any[] = [
		{ id: '1', name: 'Seniors 2024-2025', season: '2024-2025', archived: false },
		{ id: '2', name: 'Juniors 2023-2024', season: '2023-2024', archived: true }
	];

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

<div class="grid grid-cols-6 gap-6">
	<Card class="col-span-4 row-span-1 gap-2 p-4">
		<div class="mb-4 flex items-center justify-end">
			<EditGoalkeeperDialog
				name={goalkeeper.name}
				birthday={goalkeeper.birthday}
				phone={goalkeeper.phone}
			/>
		</div>
		<div class="grid grid-cols-4 gap-1">
			<p class="col-span-1 font-semibold">Name</p>
			<p class="col-span-3">{goalkeeper.name}</p>

			<p class="col-span-1 font-semibold">Age</p>
			<p class="col-span-3">28</p>

			<p class="col-span-1 font-semibold">Birthdate</p>
			<p class="col-span-3">January 1, 1996</p>

			<p class="col-span-1 font-semibold">Phone Number</p>
			<p class="col-span-3">{goalkeeper.phone}</p>
		</div>
		<p class="font-semibold">Associated Categories</p>
		<CategoryBadges categories={associatedCategories} />
	</Card>
	<Card class="col-span-2 row-span-1 p-4">
		<img
			src={profilePic}
			alt="Profile Pic"
			class="col-span-1 row-span-1 justify-self-center rounded-full"
		/>
		<Button variant="outline" size="sm" class="mt-4 w-full">Change Picture</Button>
	</Card>
</div>

<div class="mt-8 mb-2 flex flex-row justify-between">
	<h2 class="text-xl font-semibold">Growth</h2>
	<AddGrowthDialog />
</div>
<Table>
	<TableHeader>
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
							<AlertDialog.Trigger class={buttonVariants({ variant: 'ghost' })}>
								<Button variant="ghost" size="icon" aria-label="Submit">
									<Trash />
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

<div class="mt-4 flex flex-row">
	<h2 class="text-xl font-semibold">Match Performances</h2>
</div>

<div class="mt-4 flex flex-row">
	<h2 class="text-xl font-semibold">Training Attendance</h2>
</div>
