<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import profilePic from '$lib/assets/placeholder.png';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';
	import EditGoalkeeperDialog from '$lib/components/people-utils/edit-goalkeeper-dialog.svelte';
	import GoalkeeperGrowthSection from '$lib/components/people-utils/goalkeepers/goalkeeper-growth-section.svelte';
	import GoalkeeperTrainingSection from '$lib/components/people-utils/goalkeepers/goalkeeper-training-section.svelte';
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';

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

	let matchPerformances = [
		{
			id: 'Friendly CA-CA',
			date: new Date('2026-03-01'),
			category: 'Seniors2025-2026',
			performanceSheet: 'https://google.com'
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

<GoalkeeperGrowthSection />

<div class="mt-4 mb-2 flex flex-row">
	<h2 class="text-xl font-semibold">Match Performances</h2>
</div>
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
					<TableCell><a href={match.performanceSheet} class="underline">Link</a></TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<GoalkeeperTrainingSection />
