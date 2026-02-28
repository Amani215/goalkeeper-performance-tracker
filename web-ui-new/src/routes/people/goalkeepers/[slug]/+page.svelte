<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import profilePic from '$lib/assets/placeholder.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';

	let associatedCategories: any[] = [
		{ id: '1', name: 'Seniors 2024-2025', season: '2024-2025', archived: false },
		{ id: '2', name: 'Juniors 2023-2024', season: '2023-2024', archived: true }
	];
</script>

<div class="grid grid-cols-6 gap-6">
	<Card class="col-span-4 row-span-1 gap-2 p-4">
		<div class="mb-4 flex items-center justify-end">
			<Button variant="ghost" size="sm" class="mb-4">Edit</Button>
		</div>
		<div class="grid grid-cols-4 gap-1">
			<p class="col-span-1 font-semibold">Name</p>
			<p class="col-span-3">John Doe</p>

			<p class="col-span-1 font-semibold">Age</p>
			<p class="col-span-3">28</p>

			<p class="col-span-1 font-semibold">Birthdate</p>
			<p class="col-span-3">January 1, 1996</p>

			<p class="col-span-1 font-semibold">Phone Number</p>
			<p class="col-span-3">(123) 456-7890</p>
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

<div class="mt-8 flex flex-row">
	<h2 class="text-xl font-semibold">Growth</h2>
	<Button size="sm" class="ml-auto">Add New Entry</Button>
</div>

<div class="mt-4 flex flex-row">
	<h2 class="text-xl font-semibold">Match Performances</h2>
</div>

<div class="mt-4 flex flex-row">
	<h2 class="text-xl font-semibold">Training Attendance</h2>
</div>
