<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import profilePic from '$lib/assets/placeholder.png';
	import CategoryBadges from '$lib/components/category-utils/category-badges.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { columns } from '$lib/components/match-performance-utils/sequence-columns';
	import DataTable from '$lib/components/ui/data-table.svelte';

	let goalkeeper = {
		id: 1,
		name: 'John Doe',
		order: 1,
		profilePic: 'url',
		categories: [{ id: 'seniors2021_2022', name: 'Seniors 2021-2022', season: '2021-2022' }]
	};
	let match = {
		localTeam: 'EST',
		visitorTeam: 'CA',
		type: 'Tournament',
		category: 'seniors2021_2022',
		matchDate: '2021-10-22',
		localTeamScore: 2,
		visitorTeamScore: 1
	};

	let categoryLabel = () => {
		var arr = match.category.match(/^([^0-9]+)(\d+.*)/);
		if (arr) {
			return ` ${arr[1].charAt(0).toUpperCase() + arr[1].slice(1)} ${arr[2].replace('_', '-')}`;
		}
		return match.category;
	};

	let sequences = [
		{
			num: 1,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 2,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 3,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 4,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 5,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 6,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 7,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		},
		{
			num: 8,
			action: 'action',
			reaction: 'reaction',
			result: 'good',
			comment: ''
		}
	];
</script>

<div class="mb-6">
	<div class="flex flex-col gap-2  items-center">
		<p class="text-xl font-bold">Tournament {match.matchDate}</p>
		<p class="text-l font-semibold">{categoryLabel()}</p>
		<p class="text-m font-bold">
			{match.localTeam}
			{match.localTeamScore} - {match.visitorTeamScore}
			{match.visitorTeam}
		</p>
	</div>
</div>

<div class="grid grid-cols-5 md:gap-4">
	<div class="p-4 col-span-5 md:order-2 md:col-span-1 md:row-span-1">
		<div  class="grid justify-items-center gap-2">
		<img
			src={profilePic}
			alt="Profile Pic"
			class="col-span-1 row-span-1 h-40 w-40 justify-self-center rounded-full"
		/>
		<h4 class="text-xl font-bold">{goalkeeper.name} ({goalkeeper.order})</h4>
		<CategoryBadges categories={goalkeeper.categories} />
		</div>
	</div>
	<Card class="gap-1 p-4 col-span-5 md:order-2 md:col-span-4 md:row-span-1">
		<div class="mb-4 flex items-center justify-center md:justify-end">
			<Button>Add Sequence</Button>
		</div>
		<DataTable data={sequences} {columns} pageSize={3}/>
	</Card>
</div>
