<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import profilePic from '$lib/assets/placeholder.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import Label from '$lib/components/ui/label/label.svelte';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';

	let admin = true;
	let archived = false;
	let associatedCategories = [
		{ id: '1', name: 'Seniors 2021-2022', season: '2021-2022', archived: false },
		{ id: '2', name: 'Seniors 2022-2023', season: '2022-2023', archived: true }
	];
</script>

<Card class="p-8 ">
	<div class="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 gap-6">
		<img
			src={profilePic}
			alt="Profile Pic"
			class="order-2 lg:order-1 col-span-1 lg:row-span-1 h-32 w-32 justify-self-center rounded-full"
		/>

		<div class="order-1 lg:order-2 col-span-1 lg:col-span-5 lg:row-span-1 content-center justify-self-center lg:justify-self-start text-center lg:text-left">
			<h2 class="mb-4 text-xl font-bold {archived ? 'italic text-gray-500' : ''}">
				John Doe {archived ? '(Archived)' : ''}
			</h2>
			<h3 class="text-l -mt-4 mb-2 text-gray-500">{admin ? 'Admin' : 'Coach'}</h3>
		</div>

		<Button variant="outline" size="sm" class="order-3">Change Picture</Button>
		<div class="order-4 col-span-1 lg:col-start-2 lg:col-end-7 lg:row-span-5 space-y-4">
			<div class="flex items-center space-x-2">
				<Switch bind:checked={archived} />
				<Label for="admin-switch">{archived ? 'Unarchive' : 'Archive'}</Label>
			</div>

			<div class="flex items-center space-x-2">
				<Switch bind:checked={admin} />
				<Label for="admin-switch">{admin ? 'Revoke Admin' : 'Make Admin'}</Label>
			</div>

			<div class="mt-6">
				<h3 class="text-l font-semibold">Associated Categories:</h3>
				<CategoryBadges categories={associatedCategories} />
			</div>
		</div>
	</div>
</Card>
