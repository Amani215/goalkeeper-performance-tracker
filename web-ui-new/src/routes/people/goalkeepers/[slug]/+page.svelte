<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import profilePic from '$lib/assets/placeholder.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';
	import EditGoalkeeperDialog from '$lib/components/people-utils/edit-goalkeeper-dialog.svelte';
	import GoalkeeperGrowthSection from '$lib/components/people-utils/goalkeepers/goalkeeper-growth-section.svelte';
	import GoalkeeperTrainingSection from '$lib/components/people-utils/goalkeepers/goalkeeper-training-section.svelte';
	import GoalkeeperMatchSection from '$lib/components/people-utils/goalkeepers/goalkeeper-match-section.svelte';

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
</script>

<div class="grid md:grid-cols-6 md:gap-6">
	<Card class="p-4 md:order-2 md:col-span-2 md:row-span-1">
		<img
			src={profilePic}
			alt="Profile Pic"
			class="col-span-1 row-span-1 justify-self-center rounded-full"
		/>
		<Button variant="outline" size="sm" class="mt-4 w-full">Change Picture</Button>
	</Card>
	<Card class="mt-2 gap-2 p-4 md:order-1 md:col-span-4 md:row-span-1">
		<div class="mb-4 flex items-center justify-center md:justify-end">
			<EditGoalkeeperDialog
				name={goalkeeper.name}
				birthday={goalkeeper.birthday}
				phone={goalkeeper.phone}
			/>
		</div>
		<div class="space-between grid grid-cols-4 gap-1">
			<p class="col-span-1 font-semibold">Name</p>
			<p class="col-span-3 flex justify-end pr-3 md:justify-start">{goalkeeper.name}</p>

			<p class="col-span-1 font-semibold">Age</p>
			<p class="col-span-3 flex justify-end pr-3 md:justify-start">28</p>

			<p class="col-span-1 font-semibold">Birthdate</p>
			<p class="col-span-3 flex justify-end pr-3 md:justify-start">January 1, 1996</p>

			<p class="col-span-1 font-semibold">Phone Number</p>
			<p class="col-span-3 flex justify-end pr-3 md:justify-start">{goalkeeper.phone}</p>
		</div>
		<p class="font-semibold">Associated Categories</p>
		<CategoryBadges categories={associatedCategories} />
	</Card>
</div>

<GoalkeeperGrowthSection />

<GoalkeeperMatchSection />

<GoalkeeperTrainingSection />
