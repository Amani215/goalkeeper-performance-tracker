<script>
	import AddGoalkeeperDialog from '$lib/components/match-utils/add-goalkeeper-dialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import FileChartPie from '@lucide/svelte/icons/file-chart-pie';
	import EditMatchDialog from '$lib/components/match-utils/edit-dialog.svelte';

	let goalkeepers = [{ name: 'John Doe' }, { name: 'Jane Smith' }];

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

	let outcome = () => {
		if (match.localTeamScore > match.visitorTeamScore) {
			return 'Win';
		} else if (match.localTeamScore < match.visitorTeamScore) {
			return 'Loss';
		} else {
			return 'Draw';
		}
	};
</script>

<div class="flex w-full justify-end">
	<EditMatchDialog {...match} />
</div>

<div class="mb-6 flex flex-col items-center gap-2">
	<p class="text-3xl font-bold">Tournament ({outcome()})</p>
	<p class="text-2xl">{categoryLabel()}</p>
	<p class="text-xl font-bold">{match.matchDate}</p>
</div>

<div class=" flex w-full flex-row justify-center gap-2">
	<Card class="w-full items-center p-4">
		<p class="text-2xl font-bold">{match.localTeam}</p>
		<p class="text-xl font-bold">{match.localTeamScore}</p>
	</Card>
	<Card class="w-full items-center p-4">
		<p class="text-2xl font-bold">{match.visitorTeam}</p>
		<p class="text-xl font-bold">{match.visitorTeamScore}</p>
	</Card>
</div>

<Card class="mt-6 w-full p-4">
	<div class="flex w-full justify-end">
		<AddGoalkeeperDialog />
	</div>
	{#if goalkeepers.length === 0}
		<p class="mt-2 text-center text-sm">No goalkeepers added yet...</p>
	{:else}
		{#each goalkeepers as goalkeeper}
			<div class="flex flex-row justify-between">
				<p>{goalkeeper.name}</p>
				<div class="flex flex-row">
					<Button size="icon" variant="ghost"><FileChartPie /></Button>
					<Button size="icon" variant="ghost"><Trash2 /></Button>
				</div>
			</div>
			<Separator class="-mt-4" />
		{/each}
	{/if}
</Card>
